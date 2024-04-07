package ch.example.app.timeapplication.business;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import ch.example.app.timeapplication.persistence.ActivityType;
import ch.example.app.timeapplication.persistence.EmploymentType;
import ch.example.app.timeapplication.persistence.TimeActivity;
import ch.example.app.timeapplication.persistence.TimeActivityRepository;
import ch.example.app.timeapplication.persistence.TimeSheet;
import ch.example.app.timeapplication.persistence.TimeSheetRepository;
import ch.example.app.timeapplication.persistence.User;
import ch.example.app.timeapplication.persistence.UserRepository;

/*
 * Logic for time management goes here
 * e.g. 8h work per day
 *  
 */
//@author Saverio Damiani

@Service
@Component
public class TimeCalculation {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private TimeSheetRepository timeSheetRepository;

	@Autowired
	private TimeActivityRepository timeActivityRepository;
	
	// Compare if Start and End Date are different
	public boolean compareStartEnd(TimeActivity timeActivity) {
		return (timeActivity.getStart().get(Calendar.DAY_OF_MONTH) != timeActivity.getEnd().get(Calendar.DAY_OF_MONTH))
				|| (timeActivity.getStart().get(Calendar.MONTH) != timeActivity.getEnd().get(Calendar.MONTH))
				|| (timeActivity.getStart().get(Calendar.YEAR) != timeActivity.getEnd().get(Calendar.YEAR));
	}

	// Calculate time duration between start and end of a TimeActivity
	public float calculateTimeDuration(TimeActivity timeActivity) {
		return Duration.between(timeActivity.getStart().toInstant(), timeActivity.getEnd().toInstant()).toMinutes();
	}

	// Calculate time duration between start and end of a TimeActivity
	public float calculateTimeDuration(Calendar start, Calendar end) {
		return Duration.between(start.toInstant(), end.toInstant()).toMinutes();
	}

	// (8h or 4h work per day 5 times per week - vacation) -> updates
	// workHourTimeBalance in User Class
	@Scheduled(cron = "0 0 0 * *  MON-FRI")
	public void dailyTimeCalculationTask() {
		// Gets all users with userType head and user
		List<User> users = userRepository.findAllByUserType();

		for (User u : users) {
			TimeSheet timeSheet = u.getTimeSheet();

			// Add worktime
			switch (u.getEmploymentType()) {

			case FULLTIME:
				timeSheet.addWorkTime(EmploymentType.FULLTIME.getWorkTime());
				break;

			case PARTTIME:
				timeSheet.addWorkTime(EmploymentType.PARTTIME.getWorkTime());
				break;
			}

			timeSheetRepository.saveAndFlush(timeSheet);

			// Add vacation time
			// Get list with all timeActivites from user, which are not booked and in the past 
			List<TimeActivity> vacation = timeActivityRepository.findAllByTimeSheetAndStartBeforeTodayAndBookedFalse(timeSheet.getId());

			for (TimeActivity tA : vacation) {
				// Checks for activityType and if approved from head
				if ((tA.getActivityType() == ActivityType.VACATION
						|| tA.getActivityType() == ActivityType.ABSENCE) && tA.isApproved()) {
					tA.setBooked(true);
					timeSheet.addWorkTime(calculateTimeDuration(tA));
					timeActivityRepository.saveAndFlush(tA);
					timeSheetRepository.saveAndFlush(timeSheet);
				}
			}
		}
	}

	// Once a year add vacationTimeBalance
	@Scheduled(cron = "0 0 0 1 1 *")
	public void yearlyTimeCalculationTask() {
		// Gets all users with userType head and user
		List<User> users = userRepository.findAllByUserType();

		for (User u : users) {
			TimeSheet timeSheet = u.getTimeSheet();

			// Add vacationTimeBalance
			switch (u.getEmploymentType()) {

			case FULLTIME:
				timeSheet.addVacationTimeBalance(EmploymentType.FULLTIME.getVacationTime());
				break;

			case PARTTIME:
				timeSheet.addVacationTimeBalance(EmploymentType.PARTTIME.getVacationTime());
				break;
			}

			timeSheetRepository.saveAndFlush(timeSheet);
		}
	}

	public List<TimeActivity> splitTimeActivity(TimeActivity timeActivity) {
		// Calculates amount of days between start and end date
		double dayDifference = Math.ceil(calculateTimeDuration(timeActivity) / 1440);
	
		List<TimeActivity> splittedTimeActivites = new ArrayList<>();

		for (int i = 0; i <= dayDifference; i++) {
			TimeActivity tA = new TimeActivity();
			// Deep copy clone()
			Calendar newStart = (Calendar) timeActivity.getStart().clone();
			newStart.add(Calendar.DAY_OF_MONTH, i);
			Calendar newEnd = (Calendar) timeActivity.getEnd().clone();
			newEnd.add(Calendar.DAY_OF_MONTH, -(int) dayDifference + i);
			tA.setStart(newStart);
			tA.setEnd(newEnd);
			tA.setActivityType(timeActivity.getActivityType());
			tA.setTimeSheet(timeActivity.getTimeSheet());
			tA.setApproved(true);

			if (i == 0) {
				tA.getStart().set(Calendar.HOUR_OF_DAY, timeActivity.getStart().get(Calendar.HOUR_OF_DAY));
				tA.getStart().set(Calendar.MINUTE, timeActivity.getStart().get(Calendar.MINUTE));
				tA.getStart().set(Calendar.SECOND, timeActivity.getStart().get(Calendar.SECOND));
				tA.getStart().set(Calendar.MILLISECOND, timeActivity.getStart().get(Calendar.MILLISECOND));

				tA.getEnd().set(Calendar.HOUR_OF_DAY, 23);
				tA.getEnd().set(Calendar.MINUTE, 59);
				tA.getEnd().set(Calendar.SECOND, 59);
				tA.getEnd().set(Calendar.MILLISECOND, 999);
			} else if (i == dayDifference) {
				tA.getStart().set(Calendar.HOUR_OF_DAY, 0);
				tA.getStart().set(Calendar.MINUTE, 0);
				tA.getStart().set(Calendar.SECOND, 0);
				tA.getStart().set(Calendar.MILLISECOND, 0);

				tA.getEnd().set(Calendar.HOUR_OF_DAY, timeActivity.getEnd().get(Calendar.HOUR_OF_DAY));
				tA.getEnd().set(Calendar.MINUTE, timeActivity.getEnd().get(Calendar.MINUTE));
				tA.getEnd().set(Calendar.SECOND, timeActivity.getEnd().get(Calendar.SECOND));
				tA.getEnd().set(Calendar.MILLISECOND, timeActivity.getEnd().get(Calendar.MILLISECOND));
			} else {
				tA.getStart().set(Calendar.HOUR_OF_DAY, 0);
				tA.getStart().set(Calendar.MINUTE, 0);
				tA.getStart().set(Calendar.SECOND, 0);
				tA.getStart().set(Calendar.MILLISECOND, 0);

				tA.getEnd().set(Calendar.HOUR_OF_DAY, 23);
				tA.getEnd().set(Calendar.MINUTE, 59);
				tA.getEnd().set(Calendar.SECOND, 59);
				tA.getEnd().set(Calendar.MILLISECOND, 999);
			}
			splittedTimeActivites.add(tA);

		}
		return splittedTimeActivites;
	}

	// https://stackoverflow.com/questions/17106670/how-to-check-a-timeperiod-is-overlapping-another-time-period-in-java
	public boolean isOverlapping(List<TimeActivity> timeActivities, Calendar start, Calendar end) {
		for (TimeActivity tA : timeActivities) {
			if (!start.after(tA.getEnd()) && !tA.getStart().after(end)) {
				return true;
			}
		}
		return false;
	}

	/*
	 * Calculates Vacation Time in Minutes e.g. MON - FRI 
	 *  without counting the time before 08:00 and after 17:00
	 */
	public float calculateVacationTime(TimeActivity timeActivity) {
		float vacationTime = 0;
		List<TimeActivity> splittedTimeActivities = splitTimeActivity(timeActivity);
		
		for (int i = 0; i < splittedTimeActivities.size(); i++) {

			if (i == 0) {
				Calendar end = splittedTimeActivities.get(i).getEnd();
				end.set(Calendar.HOUR_OF_DAY, 17);
				end.set(Calendar.MINUTE, 00);
				end.set(Calendar.SECOND, 00);
				end.set(Calendar.MILLISECOND, 00);
				
				vacationTime += calculateTimeDuration(splittedTimeActivities.get(i).getStart(), end);
				
			} else if (i == splittedTimeActivities.size() - 1) {
				Calendar start = splittedTimeActivities.get(i).getStart();
				start.set(Calendar.HOUR_OF_DAY, 8);
				start.set(Calendar.MINUTE, 00);
				start.set(Calendar.SECOND, 00);
				start.set(Calendar.MILLISECOND, 00);
				
				vacationTime += calculateTimeDuration(start, splittedTimeActivities.get(i).getEnd());
			} else {
				vacationTime += 480;
			}
		}
		return vacationTime;
	}
}
