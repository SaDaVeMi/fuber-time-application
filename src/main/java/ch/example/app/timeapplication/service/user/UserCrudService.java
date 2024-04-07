package ch.example.app.timeapplication.service.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import ch.example.app.timeapplication.business.UserVerification;
import ch.example.app.timeapplication.common.ServiceLocator;
import ch.example.app.timeapplication.persistence.DepartmentRepository;
import ch.example.app.timeapplication.persistence.TimeActivityRepository;
import ch.example.app.timeapplication.persistence.TimeSheet;
import ch.example.app.timeapplication.persistence.User;
import ch.example.app.timeapplication.persistence.UserRepository;


//@author Alexander Ruckstuhl

@RestController
public class UserCrudService {

	private ServiceLocator serviceLocator = ServiceLocator.getServiceLocator();

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private TimeActivityRepository timeActivityRepository;

	@Autowired
	private UserVerification userVerification;

	@Autowired
	private DepartmentRepository departmentRepository;

	// Gets an User by id
	@GetMapping(path = "/api/user/id/{id}", produces = "application/json")
	public User getUser(@PathVariable int id) {
		if (userRepository.findById(id).isPresent()) {
			serviceLocator.logInfo("Client requestet User: "  + userRepository.findById(id).get().getUserName());
			return userRepository.findById(id).get();
		} else {
			serviceLocator.logWarning("User not found");
			return null;
		}

	}

	// Gets an User by name
	@GetMapping(path = "/api/user/name/{name}", produces = "application/json")
	public User getUser(@PathVariable String name) {
		if (userRepository.findByUserName(name).isPresent()) {
			serviceLocator.logInfo("Client requestet User: "  + userRepository.findByUserName(name).get().getUserName());
			return userRepository.findByUserName(name).get();
		} else {
			serviceLocator.logWarning("User not found");
			return null;
		}

	}

	// Returns a list of all users
	@GetMapping(path = "/api/user/users", produces = "application/json")
	public List<User> getAllUsers() {
		serviceLocator.logInfo("Client requested all User List");
		return userRepository.findAll();

	}

	// Delete an user by ID
	@DeleteMapping(path = "/api/user/{id}", produces = "application/json")
	public boolean deleteUser(@PathVariable int id) {
		User u = userRepository.getOne(id);
		if (u == null) {
			serviceLocator.logWarning("User not found");
			return false;
		} else {
			userRepository.delete(u);
			serviceLocator.logInfo("User: " + u.getUserName() + " updated");
			return true;
		}

	}

	// Updates an user
	@PutMapping(path = "/api/user/update/name/{id}", produces = "application/json")
	public boolean updateUser(@PathVariable int id, @RequestBody MessageUpdateUser muu) {
		User u = userRepository.getOne(id);
		if (u == null) {
			serviceLocator.logWarning("User not found");
			return false;

		} else {
			u.setUserName(muu.getUserName());

			if (userVerification.validateUser(u)) {
				userRepository.save(u);
				serviceLocator.logInfo("User: " + u.getUserName() + " deleted");
				return true;
			} else {
				return false;
			}

		}

	}

	// Updates an user password
	@PutMapping(path = "/api/user/update/password/{id}", produces = "application/json")
	public boolean updateUserPassword(@PathVariable int id, @RequestBody MessageUpdateUser muu) {
		User u = userRepository.getOne(id);
		if (u == null) {
			serviceLocator.logWarning("User not found");
			return false;

		} else if (!u.getUserName().equals(muu.getUserName())) {
			serviceLocator.logWarning("Usernames do not macth");
			return false;
		} else {

			u.setUserPassword(muu.getUserPassword());
		}

		if (userVerification.validateUserPassword(u.getUserPassword())) {
			userRepository.save(u);
			serviceLocator.logInfo("Password changed, for: "+ u.getUserName());
			return true;
		} else {
			serviceLocator.logWarning("New password is not valid, for: "+ u.getUserName());
			return false;
		}

	}

	// Resets an user password
	@PutMapping(path = "/api/user/reset/password/{id}", produces = "application/json")
	public boolean resetUserPassword(@PathVariable int id) {
		User u = userRepository.getOne(id);
		if (u == null) {
			serviceLocator.logWarning("User not found");
			return false;
		}

		u.setUserPassword("password");
		userRepository.save(u);
		serviceLocator.logInfo("Password reseted, for: "+ u.getUserName());
		return true;
	}

	// Creates an new user with name and password
	@PostMapping(path = "/api/user/createUser/", produces = "application/json")
	public boolean createUser(@RequestBody MessageNewUser mu) {
		User u = new User();
		u.setUserName(mu.getUserName());
		u.setUserPassword(mu.getUserPassword());
		u.setUserType(mu.getUserType());
			u.setDepartment(departmentRepository.findByName(mu.getDepartment()).get());
		u.setEmploymentType(mu.getEmploymentType());
		u.setTimeSheet(new TimeSheet());
		if (userVerification.validateUser(u)) {
			userRepository.save(u);
			serviceLocator.logInfo("A new User was Created: " + mu.getUserName());
			return true;
		} else {
			serviceLocator.logWarning("User create failed: " + mu.getUserName());
			serviceLocator.logWarning("User creation failed");
			return false;
		}
	}

	// Test method for http postman testing
	@GetMapping(path = "/api/info")
	public String info() {
		serviceLocator.logInfo("Connection check successful");
		return "Application is running";
	}

}
