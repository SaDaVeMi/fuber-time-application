package ch.example.app.timeapplication.service.time;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import ch.example.app.timeapplication.business.TimeCalculation;
import ch.example.app.timeapplication.business.UserVerification;
import ch.example.app.timeapplication.common.ServiceLocator;
import ch.example.app.timeapplication.persistence.TimeActivity;
import ch.example.app.timeapplication.persistence.TimeActivityRepository;
import ch.example.app.timeapplication.persistence.TimeSheet;
import ch.example.app.timeapplication.persistence.TimeSheetRepository;
import ch.example.app.timeapplication.persistence.User;
import ch.example.app.timeapplication.persistence.UserRepository;
import ch.example.app.timeapplication.security.MyUserDetails;

@RestController
public class UserClockInService {

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

	@PostMapping(path = "/api/time/clockIn", produces = "application/json")
	public boolean clockIn(@AuthenticationPrincipal MyUserDetails userDetails) {
//		MyUserDetails userDetails = (MyUserDetails) SecurityContextHolder.getContext().getAuthentication()
//				.getPrincipal();
		Optional<User> user = userRepository.findByUserName(userDetails.getUsername());
		TimeSheet timeSheet = user.get().getTimeSheet();

		if (!user.get().getTimeSheet().isClockedIn() && user.isPresent()) {
			TimeActivity timeActivity = new TimeActivity();
			timeActivity.setStart(Calendar.getInstance());
			timeActivity.setActivityType("WORK");
			timeActivity.setTimeSheet(timeSheet);
			timeSheet.setClockedIn(true);
			timeSheetRepository.saveAndFlush(timeSheet);
			timeActivityRepository.saveAndFlush(timeActivity);
			serviceLocator.logInfo(user.get().getUserName() + " Clocked In");
			return true;
		} else {
			serviceLocator.logWarning(user.get().getUserName() + " Clock In failed");
			return false;
		}
	}

	@PostMapping(path = "/api/time/clockOut", produces = "application/json")
	public boolean clockOut(@AuthenticationPrincipal MyUserDetails userDetails) {
//		MyUserDetails userDetails = (MyUserDetails) SecurityContextHolder.getContext().getAuthentication()
//				.getPrincipal();
		Optional<User> user = userRepository.findByUserName(userDetails.getUsername());
		TimeSheet timeSheet = user.get().getTimeSheet();

		if (timeSheet.isClockedIn() && user.isPresent()) {
			TimeActivity timeActivity = timeActivityRepository.findByEndIsNull();
			timeActivity.setEnd(Calendar.getInstance());
			timeSheet.setClockedIn(false);

			// Checks if start and end date is the same and if not it will be splitted in
			// multiple TimeActivites
			if (timeCalculation.compareStartEnd(timeActivity)) {
				List<TimeActivity> splittedTimeActivites = timeCalculation.splitTimeActivity(timeActivity);

				// No need for the old TimeActivity
				timeActivityRepository.delete(timeActivity);

				timeActivityRepository.saveAll(splittedTimeActivites);

				// Calculates time difference of all timeActivites
				for (TimeActivity tA : splittedTimeActivites) {
					timeSheet.addWorkTime(timeCalculation.calculateTimeDuration(tA));
					timeSheetRepository.saveAndFlush(timeSheet);
				}
			} else {
				// Calculates time difference between clockedIn and clockedOut and saves it
				timeSheet.addWorkTime(timeCalculation.calculateTimeDuration(timeActivity));
				timeSheetRepository.saveAndFlush(timeSheet);
				timeActivityRepository.saveAndFlush(timeActivity);
				serviceLocator.logInfo(user.get().getUserName() + " Clocked Out");
			}
			return true;
		} else {
			serviceLocator.logWarning(user.get().getUserName() + " Clock Out failed");
			return false;
		}
	}

	// This Method is to return all TimeActivites form an user
	@GetMapping("/api/time/timeactivities")
	public List<TimeActivity> getTimeActivities(@AuthenticationPrincipal MyUserDetails userDetails) {

		Optional<User> user = userRepository.findByUserName(userDetails.getUsername());

		user.get().getTimeSheet().getTimeActivities();
		serviceLocator.logInfo("Listed all Timeactivies for: " + user.get().getUserName());

		return user.get().getTimeSheet().getTimeActivities();
	}

	// This method returns all Dates when an user has clocked in and Out
	@GetMapping("/api/time/timeactivities/dates")
	public List<Date> getTimeActivitiesDates(@AuthenticationPrincipal MyUserDetails userDetails) {
//		MyUserDetails userDetails = (MyUserDetails) SecurityContextHolder.getContext().getAuthentication()
//				.getPrincipal();
		Optional<User> user = userRepository.findByUserName(userDetails.getUsername());

		List<Date> clockedDates = new ArrayList<Date>();

		for (int i = 0; i < user.get().getTimeSheet().getTimeActivities().size(); i++) {
			clockedDates.add(user.get().getTimeSheet().getTimeActivities().get(i).getStart().getTime());
			clockedDates.add(user.get().getTimeSheet().getTimeActivities().get(i).getEnd().getTime());
		}
		serviceLocator.logInfo("Listed all Clock Dates for: " + user.get().getUserName());
		return clockedDates;

	}

	// This method returns the time balance
	@GetMapping("/api/time/workTimeBalance")
	public float getWorkTimeBalance(@AuthenticationPrincipal MyUserDetails userDetails) {
		Optional<User> user = userRepository.findByUserName(userDetails.getUsername());
		return user.get().getTimeSheet().getWorkTimeBalance();
	}

}