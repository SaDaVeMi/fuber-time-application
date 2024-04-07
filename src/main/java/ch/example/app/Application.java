package ch.example.app;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.TimeZone;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

import ch.example.app.timeapplication.common.ServiceLocator;
import ch.example.app.timeapplication.persistence.ActivityType;
import ch.example.app.timeapplication.persistence.Department;
import ch.example.app.timeapplication.persistence.DepartmentRepository;
import ch.example.app.timeapplication.persistence.EmploymentType;
import ch.example.app.timeapplication.persistence.Request;
import ch.example.app.timeapplication.persistence.RequestRepository;
import ch.example.app.timeapplication.persistence.TimeActivity;
import ch.example.app.timeapplication.persistence.TimeActivityRepository;
import ch.example.app.timeapplication.persistence.TimeSheet;
import ch.example.app.timeapplication.persistence.TimeSheetRepository;
import ch.example.app.timeapplication.persistence.User;
import ch.example.app.timeapplication.persistence.UserRepository;
import ch.example.app.timeapplication.persistence.UserType;

@SpringBootApplication
@EnableJpaRepositories(basePackageClasses = UserRepository.class)
@EnableScheduling
public class Application {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private DepartmentRepository departmentRepository;

	@Autowired
	private RequestRepository requestRepository;

	@Autowired
	private TimeSheetRepository timeSheetRepository;

	@Autowired
	private TimeActivityRepository timeActivityRepository;

	public static void main(String[] args) {
		ServiceLocator serviceLocator = ServiceLocator.getServiceLocator();
		serviceLocator.setLogger(Logger.getLogger("Server Log"));
		serviceLocator.setUpServerLogFile();
		TimeZone.setDefault(TimeZone.getTimeZone("Switzerland"));
		SpringApplication.run(Application.class, args);
	}
	
	@PostConstruct
	public void createDepartments() {
		if (departmentRepository.findAll().size() < 5) {
			Department sales = new Department();
			Department finance = new Department();
			Department hr = new Department();
			Department operations = new Department();
			sales.setName("Sales");
			finance.setName("Finance");
			hr.setName("Human Ressources");
			operations.setName("Operations");
			departmentRepository.saveAndFlush(sales);
			departmentRepository.saveAndFlush(finance);
			departmentRepository.saveAndFlush(hr);
			departmentRepository.saveAndFlush(operations);
		}
	}

	// Creates IT Department and his system Admin
	@PostConstruct // get launched after Spring is set up
	public void createAdmin() {
		if (userRepository.findAll().size() < 3) {
			User u = new User();
			u.setUserName("admin");
			u.setUserPassword("password");
			u.setUserType(UserType.ROLE_ADMIN);
			userRepository.saveAndFlush(u);
		}
	}

	
	@PostConstruct // get launched after Spring is set up
	public void createTestUserSales() {
		if (userRepository.findAll().size() < 5) {
			Department d = new Department();
			d.setName("Sales");
			d.setCompany(null);
			List<User> users = new ArrayList<User>();
			d.setUsers(users);
			User u = new User();
			u.setUserName("userSales");
			u.setUserPassword("123");
			u.setUserType(UserType.ROLE_USER);
			u.setEmploymentType(EmploymentType.FULLTIME);
			TimeSheet timeSheet = new TimeSheet();
			u.setTimeSheet(timeSheet);
			u.getTimeSheet().setWorkTimeBalance(1000);
			u.getTimeSheet().setVacationTimeBalance(36000);

			Calendar cal = Calendar.getInstance();
			Calendar cal1 = Calendar.getInstance();
			cal.setTimeZone(TimeZone.getDefault());
			cal.set(2021, 6, 19, 8, 0);
			cal1.setTimeZone(TimeZone.getDefault());
			cal1.set(2021, 6, 21, 12, 0);

			TimeActivity tA1 = new TimeActivity();
			tA1.setActivityType(ActivityType.VACATION);
			tA1.setStart(cal);
			tA1.setEnd(cal1);
			tA1.setTimeSheet(timeSheet);
			tA1.setApproved(false);
			tA1.setBooked(false);

			Calendar cal2 = Calendar.getInstance();
			Calendar cal3 = Calendar.getInstance();
			cal2.setTimeZone(TimeZone.getDefault());
			cal2.set(2021, 6, 2, 8, 0, 32);
			cal3.setTimeZone(TimeZone.getDefault());
			cal3.set(2021, 6, 2, 10, 0, 15);

			TimeActivity tA2 = new TimeActivity();
			tA2.setActivityType(ActivityType.VACATION);
			tA2.setStart(cal2);
			tA2.setEnd(cal3);
			tA2.setTimeSheet(timeSheet);
			tA2.setApproved(false);
			tA2.setBooked(false);

			Calendar cal20 = Calendar.getInstance();
			Calendar cal21 = Calendar.getInstance();
			cal20.setTimeZone(TimeZone.getDefault());
			cal20.set(2021, 6, 2, 10, 30, 32);
			cal21.setTimeZone(TimeZone.getDefault());
			cal21.set(2021, 6, 2, 15, 30, 15);

			TimeActivity tA7 = new TimeActivity();
			tA7.setActivityType(ActivityType.VACATION);
			tA7.setStart(cal20);
			tA7.setEnd(cal21);
			tA7.setTimeSheet(timeSheet);
			tA7.setApproved(false);
			tA7.setBooked(false);

			Calendar cal4 = Calendar.getInstance();
			Calendar cal5 = Calendar.getInstance();
			cal4.setTimeZone(TimeZone.getDefault());
			cal4.set(2021, 8, 3, 8, 0, 16);
			cal5.setTimeZone(TimeZone.getDefault());
			cal5.set(2021, 8, 3, 17, 0, 12);

			TimeActivity tA3 = new TimeActivity();
			tA3.setActivityType(ActivityType.WORK);
			tA3.setStart(cal4);
			tA3.setEnd(cal5);
			tA3.setTimeSheet(timeSheet);

			Calendar cal6 = Calendar.getInstance();
			Calendar cal7 = Calendar.getInstance();
			cal6.setTimeZone(TimeZone.getDefault());
			cal6.set(2021, 4, 4, 8, 0, 1);
			cal7.setTimeZone(TimeZone.getDefault());
			cal7.set(2021, 4, 4, 17, 0, 2);

			TimeActivity tA4 = new TimeActivity();
			tA4.setActivityType(ActivityType.WORK);
			tA4.setStart(cal6);
			tA4.setEnd(cal7);
			tA4.setTimeSheet(timeSheet);

			Calendar cal8 = Calendar.getInstance();
			Calendar cal9 = Calendar.getInstance();
			cal8.setTimeZone(TimeZone.getDefault());
			cal8.set(2021, 4, 17, 8, 0, 3);
			cal9.setTimeZone(TimeZone.getDefault());
			cal9.set(2021, 4, 17, 17, 0, 0);

			TimeActivity tA5 = new TimeActivity();
			tA5.setActivityType(ActivityType.WORK);
			tA5.setStart(cal8);
			tA5.setEnd(cal9);
			tA5.setTimeSheet(timeSheet);

			Calendar cal10 = Calendar.getInstance();
			Calendar cal11 = Calendar.getInstance();
			cal10.setTimeZone(TimeZone.getDefault());
			cal10.set(2021, 4, 21, 8, 0, 3);
			cal11.setTimeZone(TimeZone.getDefault());
			cal11.set(2021, 4, 21, 17, 0, 0);

			TimeActivity tA6 = new TimeActivity();
			tA6.setActivityType(ActivityType.WORK);
			tA6.setStart(cal10);
			tA6.setEnd(cal11);
			tA6.setTimeSheet(timeSheet);

			u.getTimeSheet().setTimeActivities(new ArrayList<TimeActivity>());
			u.getTimeSheet().getTimeActivities().add(tA1);
			u.getTimeSheet().getTimeActivities().add(tA2);
			u.getTimeSheet().getTimeActivities().add(tA7);
			u.getTimeSheet().getTimeActivities().add(tA3);
			u.getTimeSheet().getTimeActivities().add(tA4);
			u.getTimeSheet().getTimeActivities().add(tA6);

			u.setDepartment(d);
			d.addUser(u);

			Request r1 = new Request();
			r1.setUser(u);
			r1.setTimeActivity(tA1);

			Request r2 = new Request();
			r2.setUser(u);
			r2.setTimeActivity(tA2);

			Request r3 = new Request();
			r3.setUser(u);
			r3.setTimeActivity(tA7);

			List<Request> requests = new ArrayList<>();
			requests.add(r1);
			requests.add(r2);
			requests.add(r3);
			u.setRequests(requests);

			departmentRepository.saveAndFlush(d);
			userRepository.saveAndFlush(u);
			timeSheetRepository.saveAndFlush(timeSheet);
			requestRepository.saveAndFlush(r1);
			requestRepository.saveAndFlush(r2);
			requestRepository.saveAndFlush(r3);

		}

	}

	@PostConstruct // get launched after Spring is set up
	public void createTestUserIT() {
		if (userRepository.findAll().size() < 5) {
			Department d = new Department();
			d.setName("IT");
			d.setCompany(null);
			List<User> users = new ArrayList<User>();
			d.setUsers(users);
			User u = new User();
			u.setUserName("userIT");
			u.setUserPassword("123");
			u.setUserType(UserType.ROLE_USER);
			u.setEmploymentType(EmploymentType.FULLTIME);
			TimeSheet timeSheet = new TimeSheet();
			u.setTimeSheet(timeSheet);
			u.getTimeSheet().setWorkTimeBalance(600);
			u.getTimeSheet().setVacationTimeBalance(36000);

			Calendar cal = Calendar.getInstance();
			Calendar cal1 = Calendar.getInstance();
			cal.setTimeZone(TimeZone.getDefault());
			cal.set(2021, 4, 19, 8, 0);
			cal1.setTimeZone(TimeZone.getDefault());
			cal1.set(2021, 4, 19, 12, 0);

			TimeActivity tA1 = new TimeActivity();
			tA1.setActivityType(ActivityType.VACATION);
			tA1.setStart(cal);
			tA1.setEnd(cal1);
			tA1.setTimeSheet(timeSheet);
			tA1.setApproved(false);
			tA1.setBooked(false);

			Calendar cal2 = Calendar.getInstance();
			Calendar cal3 = Calendar.getInstance();
			cal2.setTimeZone(TimeZone.getDefault());
			cal2.set(2021, 3, 2, 8, 0, 32);
			cal3.setTimeZone(TimeZone.getDefault());
			cal3.set(2021, 3, 2, 10, 0, 15);

			TimeActivity tA2 = new TimeActivity();
			tA2.setActivityType(ActivityType.VACATION);
			tA2.setStart(cal2);
			tA2.setEnd(cal3);
			tA2.setTimeSheet(timeSheet);
			tA2.setApproved(false);
			tA2.setBooked(false);

			Calendar cal20 = Calendar.getInstance();
			Calendar cal21 = Calendar.getInstance();
			cal20.setTimeZone(TimeZone.getDefault());
			cal20.set(2021, 6, 2, 10, 30, 32);
			cal21.setTimeZone(TimeZone.getDefault());
			cal21.set(2021, 6, 2, 15, 30, 15);

			TimeActivity tA7 = new TimeActivity();
			tA7.setActivityType(ActivityType.VACATION);
			tA7.setStart(cal20);
			tA7.setEnd(cal21);
			tA7.setTimeSheet(timeSheet);
			tA7.setApproved(false);
			tA7.setBooked(false);

			Calendar cal4 = Calendar.getInstance();
			Calendar cal5 = Calendar.getInstance();
			cal4.setTimeZone(TimeZone.getDefault());
			cal4.set(2021, 8, 3, 8, 0, 16);
			cal5.setTimeZone(TimeZone.getDefault());
			cal5.set(2021, 8, 3, 17, 0, 12);

			TimeActivity tA3 = new TimeActivity();
			tA3.setActivityType(ActivityType.WORK);
			tA3.setStart(cal4);
			tA3.setEnd(cal5);
			tA3.setTimeSheet(timeSheet);

			Calendar cal6 = Calendar.getInstance();
			Calendar cal7 = Calendar.getInstance();
			cal6.setTimeZone(TimeZone.getDefault());
			cal6.set(2021, 4, 4, 8, 0, 1);
			cal7.setTimeZone(TimeZone.getDefault());
			cal7.set(2021, 4, 4, 17, 0, 2);

			TimeActivity tA4 = new TimeActivity();
			tA4.setActivityType(ActivityType.WORK);
			tA4.setStart(cal6);
			tA4.setEnd(cal7);
			tA4.setTimeSheet(timeSheet);

			Calendar cal8 = Calendar.getInstance();
			Calendar cal9 = Calendar.getInstance();
			cal8.setTimeZone(TimeZone.getDefault());
			cal8.set(2021, 4, 17, 8, 0, 3);
			cal9.setTimeZone(TimeZone.getDefault());
			cal9.set(2021, 4, 17, 17, 0, 0);

			TimeActivity tA5 = new TimeActivity();
			tA5.setActivityType(ActivityType.WORK);
			tA5.setStart(cal8);
			tA5.setEnd(cal9);
			tA5.setTimeSheet(timeSheet);

			Calendar cal10 = Calendar.getInstance();
			Calendar cal11 = Calendar.getInstance();
			cal10.setTimeZone(TimeZone.getDefault());
			cal10.set(2021, 4, 21, 8, 0, 3);
			cal11.setTimeZone(TimeZone.getDefault());
			cal11.set(2021, 4, 21, 17, 0, 0);

			TimeActivity tA6 = new TimeActivity();
			tA6.setActivityType(ActivityType.WORK);
			tA6.setStart(cal10);
			tA6.setEnd(cal11);
			tA6.setTimeSheet(timeSheet);

			u.getTimeSheet().setTimeActivities(new ArrayList<TimeActivity>());
			u.getTimeSheet().getTimeActivities().add(tA1);
			u.getTimeSheet().getTimeActivities().add(tA2);
			u.getTimeSheet().getTimeActivities().add(tA7);
			u.getTimeSheet().getTimeActivities().add(tA3);
			u.getTimeSheet().getTimeActivities().add(tA4);
			u.getTimeSheet().getTimeActivities().add(tA6);

			u.setDepartment(d);
			d.addUser(u);

			Request r1 = new Request();
			r1.setUser(u);
			r1.setTimeActivity(tA1);

			Request r2 = new Request();
			r2.setUser(u);
			r2.setTimeActivity(tA2);

			Request r3 = new Request();
			r3.setUser(u);
			r3.setTimeActivity(tA7);

			List<Request> requests = new ArrayList<>();
			requests.add(r1);
			requests.add(r2);
			requests.add(r3);
			u.setRequests(requests);

			departmentRepository.saveAndFlush(d);
			userRepository.saveAndFlush(u);
			timeSheetRepository.saveAndFlush(timeSheet);
			requestRepository.saveAndFlush(r1);
			requestRepository.saveAndFlush(r2);
			requestRepository.saveAndFlush(r3);
		}

	}

	@PostConstruct
	public void createTestHeadSales() {
		if (userRepository.findAll().size() < 5) {

			Department d = new Department();
			d.setName("Sales");
			d.setCompany(null);
			List<User> users = new ArrayList<User>();
			d.setUsers(users);
			User u = new User();
			u.setUserName("headSales");
			u.setUserPassword("123");
			u.setUserType(UserType.ROLE_HEAD);
			u.setEmploymentType(EmploymentType.FULLTIME);
			TimeSheet timeSheet = new TimeSheet();
			u.setTimeSheet(timeSheet);
			u.getTimeSheet().setWorkTimeBalance(600);
			u.getTimeSheet().setVacationTimeBalance(36000);

			Calendar cal10 = Calendar.getInstance();
			Calendar cal11 = Calendar.getInstance();
			cal10.setTimeZone(TimeZone.getDefault());
			cal10.set(2021, 4, 21, 8, 0, 3);
			cal11.setTimeZone(TimeZone.getDefault());
			cal11.set(2021, 4, 21, 17, 0, 0);

			TimeActivity tA6 = new TimeActivity();
			tA6.setActivityType(ActivityType.WORK);
			tA6.setStart(cal10);
			tA6.setEnd(cal11);
			tA6.setTimeSheet(timeSheet);

			Calendar cal12 = Calendar.getInstance();
			Calendar cal13 = Calendar.getInstance();
			cal12.setTimeZone(TimeZone.getDefault());
			cal12.set(2021, 4, 22, 8, 0, 3);
			cal13.setTimeZone(TimeZone.getDefault());
			cal13.set(2021, 4, 22, 17, 0, 0);

			TimeActivity tA7 = new TimeActivity();
			tA7.setActivityType(ActivityType.WORK);
			tA7.setStart(cal12);
			tA7.setEnd(cal13);
			tA7.setTimeSheet(timeSheet);

			u.getTimeSheet().setTimeActivities(new ArrayList<TimeActivity>());
			u.getTimeSheet().getTimeActivities().add(tA6);
			u.getTimeSheet().getTimeActivities().add(tA7);

			u.setDepartment(d);
			d.addUser(u);

			departmentRepository.saveAndFlush(d);
			userRepository.saveAndFlush(u);
			timeSheetRepository.saveAndFlush(timeSheet);
		}
	}

	@PostConstruct
	public void createTestHeadIT() {
		if (userRepository.findAll().size() < 5) {
			Department d = new Department();
			d.setName("IT");
			d.setCompany(null);
			List<User> users = new ArrayList<User>();
			d.setUsers(users);
			User u = new User();
			u.setUserName("headIT");
			u.setUserPassword("123");
			u.setUserType(UserType.ROLE_HEAD);
			u.setEmploymentType(EmploymentType.FULLTIME);
			TimeSheet timeSheet = new TimeSheet();
			u.setTimeSheet(timeSheet);
			u.getTimeSheet().setWorkTimeBalance(800);
			u.getTimeSheet().setVacationTimeBalance(36000);

			Calendar cal10 = Calendar.getInstance();
			Calendar cal11 = Calendar.getInstance();
			cal10.setTimeZone(TimeZone.getDefault());
			cal10.set(2021, 4, 21, 8, 0, 3);
			cal11.setTimeZone(TimeZone.getDefault());
			cal11.set(2021, 4, 21, 17, 0, 0);

			TimeActivity tA6 = new TimeActivity();
			tA6.setActivityType(ActivityType.WORK);
			tA6.setStart(cal10);
			tA6.setEnd(cal11);
			tA6.setTimeSheet(timeSheet);

			Calendar cal12 = Calendar.getInstance();
			Calendar cal13 = Calendar.getInstance();
			cal12.setTimeZone(TimeZone.getDefault());
			cal12.set(2021, 4, 22, 8, 0, 3);
			cal13.setTimeZone(TimeZone.getDefault());
			cal13.set(2021, 4, 22, 17, 0, 0);

			TimeActivity tA7 = new TimeActivity();
			tA7.setActivityType(ActivityType.WORK);
			tA7.setStart(cal12);
			tA7.setEnd(cal13);
			tA7.setTimeSheet(timeSheet);

			u.getTimeSheet().setTimeActivities(new ArrayList<TimeActivity>());
			u.getTimeSheet().getTimeActivities().add(tA6);
			u.getTimeSheet().getTimeActivities().add(tA7);

			u.setDepartment(d);
			d.addUser(u);

			departmentRepository.saveAndFlush(d);
			userRepository.saveAndFlush(u);
			timeSheetRepository.saveAndFlush(timeSheet);
		}
	}
}
