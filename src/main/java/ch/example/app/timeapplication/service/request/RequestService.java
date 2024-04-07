package ch.example.app.timeapplication.service.request;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ch.example.app.timeapplication.business.TimeCalculation;
import ch.example.app.timeapplication.business.UserVerification;
import ch.example.app.timeapplication.common.ServiceLocator;
import ch.example.app.timeapplication.persistence.ActivityType;
import ch.example.app.timeapplication.persistence.DepartmentRepository;
import ch.example.app.timeapplication.persistence.Request;
import ch.example.app.timeapplication.persistence.RequestRepository;
import ch.example.app.timeapplication.persistence.TimeActivity;
import ch.example.app.timeapplication.persistence.TimeActivityRepository;
import ch.example.app.timeapplication.persistence.TimeSheet;
import ch.example.app.timeapplication.persistence.TimeSheetRepository;
import ch.example.app.timeapplication.persistence.User;
import ch.example.app.timeapplication.persistence.UserRepository;
import ch.example.app.timeapplication.persistence.UserType;
import ch.example.app.timeapplication.security.MyUserDetails;

//@author Saverio Damiani
/*
 * REST API for creating and processing vacation/absence request
 *
 */
@RestController
public class RequestService {

	private ServiceLocator serviceLocator = ServiceLocator.getServiceLocator();

	@Autowired
	private UserRepository userRepository;
	@Autowired
	private UserVerification userVeryification;
	@Autowired
	private TimeCalculation timeCalculation;
	@Autowired
	private TimeSheetRepository timeSheetRepository;
	@Autowired
	private TimeActivityRepository timeActivityRepository;
	@Autowired
	private RequestRepository requestRepository;
	@Autowired
	private DepartmentRepository departmentRepository;

	@GetMapping(path = "/api/request/requests", produces = "application/json")
	public List<Request> getRequests(@AuthenticationPrincipal MyUserDetails userDetails) {
		Optional<User> user = userRepository.findByUserName(userDetails.getUsername());
		
		List<Request> requestList = new ArrayList<>();

		if (user.isPresent()) {
			if (user.get().getUserType() == UserType.ROLE_HEAD) {
				// Get all users by department name of the supervisor
				List<Integer> users = userRepository.findAllByDepartment(user.get().getDepartment().getName());
				// Get all requests from all user in the department of the supervisor
				requestList = requestRepository.findAllByUserIdIn(users);
			}
		}
		return requestList;
	}

	@PutMapping(path = "/api/request/process/{id}/{approved}", produces = "application/json")
	public boolean processRequest(@AuthenticationPrincipal MyUserDetails userDetails, @PathVariable int id,
			@PathVariable boolean approved) {
		Optional<User> user = userRepository.findByUserName(userDetails.getUsername());

		Optional<Request> request = requestRepository.findById(id);

		if (user.isPresent()) {
			if (user.get().getUserType() == UserType.ROLE_HEAD) {
				TimeActivity timeActivity = request.get().getTimeActivity();
				User requestUser = request.get().getUser();
				// If request accepted or denied change approved field in timeActivity or delete it
				if (approved) {
					// Approve TimeActivity and delete Request of requestUser
					timeActivity.setApproved(approved);
					timeActivityRepository.saveAndFlush(timeActivity);
					requestUser.deleteRequest(request.get());
					userRepository.saveAndFlush(requestUser);
					requestRepository.delete(request.get());
					return true;
				} else {
					float vacationTime;
					/*
					 *  Refund deducted vacationTime (from the method createRequest)
					 *  and split up if necessary (for further information look up 
					 *  timeCalculation.calculateVacationTime())
					 */
					if (timeActivity.getActivityType() != ActivityType.ABSENCE && 
							timeCalculation.compareStartEnd(timeActivity)) {
						// Calculates effective vacation time
						vacationTime = timeCalculation.calculateVacationTime(timeActivity);
						requestUser.getTimeSheet().addVacationTimeBalance(vacationTime);
					}
					else if (timeActivity.getActivityType() != ActivityType.ABSENCE){
						vacationTime = timeCalculation.calculateTimeDuration(timeActivity);
						requestUser.getTimeSheet().addVacationTimeBalance(vacationTime);
					}
					// Delete Request and TimeActivity of requestUser
					requestUser.deleteRequest(request.get());
					userRepository.saveAndFlush(requestUser);
					requestUser.getTimeSheet().deleteTimeActivity(timeActivity);
					timeSheetRepository.saveAndFlush(requestUser.getTimeSheet());
					timeActivityRepository.delete(timeActivity);
					requestRepository.delete(request.get());
					return true;
				}
			}
		}
		return false;
	}
	
	@PostMapping(path = "/api/request/create", produces = "application/json")
	public boolean createVacationRequest(@AuthenticationPrincipal MyUserDetails userDetails,
			@RequestParam String startDate, @RequestParam String endDate, @RequestParam String activityType) {

		Optional<User> user = userRepository.findByUserName(userDetails.getUsername());
		TimeSheet timeSheet = user.get().getTimeSheet();
		
		if (user.isPresent()) {

			// Replace "T" and ":" of the form date (datetime-local input) with "-"
			String formattedStartDate = startDate.replaceAll("[:T]", "-");
			String formattedEndDate = endDate.replaceAll("[:T]", "-");
			// Afterwards split by "-" and create Calendar Object for TimeActivity
			String[] splittedStartDate = formattedStartDate.split("-");
			String[] splittedEndDate = formattedEndDate.split("-");

			Calendar start = Calendar.getInstance();
			start.set(Calendar.YEAR, Integer.parseInt(splittedStartDate[0]));
			start.set(Calendar.MONTH, Integer.parseInt(splittedStartDate[1]) - 1);
			start.set(Calendar.DAY_OF_MONTH, Integer.parseInt(splittedStartDate[2]));
			start.set(Calendar.HOUR_OF_DAY, Integer.parseInt(splittedStartDate[3]));
			start.set(Calendar.MINUTE, Integer.parseInt(splittedStartDate[4]));
			start.set(Calendar.SECOND, 0);
			start.set(Calendar.MILLISECOND, 0);
			Calendar end = Calendar.getInstance();
			end.set(Calendar.YEAR, Integer.parseInt(splittedEndDate[0]));
			end.set(Calendar.MONTH, Integer.parseInt(splittedEndDate[1]) - 1);
			end.set(Calendar.DAY_OF_MONTH, Integer.parseInt(splittedEndDate[2]));
			end.set(Calendar.HOUR_OF_DAY, Integer.parseInt(splittedEndDate[3]));
			end.set(Calendar.MINUTE, Integer.parseInt(splittedEndDate[4]));
			end.set(Calendar.SECOND, 0);
			end.set(Calendar.MILLISECOND, 0);
			
			//Check if TimeActivity overlaps with other existing timeActivities
			
			//Create List with all timeActivites and filter by ActivityType = VACATION or ABSENCE
			List<TimeActivity> timeActivities = timeSheet.getTimeActivities();
			List<TimeActivity> filteredTimeActivity = timeActivities.stream()
			.filter(a -> a.getActivityType() == ActivityType.VACATION || a.getActivityType() == ActivityType.ABSENCE)
			.collect(Collectors.toList());
			
			//Check if TimeActivity overlap if other TimeActivity of type VACATION or ABSENCE
			if (timeCalculation.isOverlapping(filteredTimeActivity, start, end)) {
				return false;
			}
			
			TimeActivity timeActivity = new TimeActivity();
			timeActivity.setStart(start);
			timeActivity.setEnd(end);
			timeActivity.setActivityType(activityType);
			timeActivity.setTimeSheet(timeSheet);
			timeActivity.setBooked(false);
			
			float vacationTime;
			
			// Calculates effective vacation time
			/*
			 * The if statement split the timeactivity (for further 
			 * information look up timeCalculation.calculateVacationTime() method)
			 * and calculates effective Time duration of the vacation
			 * and the else statement does not split the timeActivity to calculate duration
			 *  
			 */
			if (timeCalculation.compareStartEnd(timeActivity)) {
				vacationTime = timeCalculation.calculateVacationTime(timeActivity);
				System.out.println(vacationTime);
			}
			else {
				vacationTime = timeCalculation.calculateTimeDuration(timeActivity);
				System.out.println(vacationTime);
			}
			
			// If the user has not enough vacationTime return false and delete TimeActivity
			// Exception if ActivityType = ABSENCE
			if (vacationTime > timeSheet.getVacationTimeBalance() 
					&& timeActivity.getActivityType() ==  ActivityType.VACATION) {
				timeSheet.deleteTimeActivity(timeActivity);
				timeActivityRepository.delete(timeActivity);
				return false;
			} else if (timeActivity.getActivityType() ==  ActivityType.VACATION){
				//Deduct vacation time 
				timeSheet.addVacationTimeBalance(-vacationTime);
			}
			
			timeSheetRepository.saveAndFlush(timeSheet);
			timeActivityRepository.saveAndFlush(timeActivity);
			
			/*Create Request only if UserType = User 
			*and Supervisors (ROLE_HEAD) do not send vacation requests
			*/
			if (user.get().getUserType() == UserType.ROLE_USER) {
				timeActivity.setApproved(false);
				
				// Create Request
				Request vacationRequest = new Request();
				vacationRequest.setTimeActivity(timeActivity);
				vacationRequest.setUser(user.get());
				requestRepository.saveAndFlush(vacationRequest);
			}
		}
		return true;
	}
}
