package ch.example.app.timeapplication.business;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ch.example.app.timeapplication.persistence.User;
import ch.example.app.timeapplication.persistence.UserRepository;

@Service
public class UserVerification {

	@Autowired
	UserRepository userRepository;

	// Checks if a new User is already in Database
	public boolean validateUser(User u) {

		if (userRepository.findByUserName(u.getUserName()).isPresent()) {
			return false;
		} else if (!validateUserPassword(u.getUserPassword())) {
			return false;
		} else {
			return true;
		}

	}

	// Checks if the user used a strong password
	public boolean validateUserPassword(String pw) {

		if (pw.length() < 3) {
			return false;
		} else {
			return true;
		}

	}

	// Checks if Login name and password are correct
	public boolean validateUserLogin(User databaseUser, User loginUser) {

		if (databaseUser.getUserName().equals(loginUser.getUserName())
				&& databaseUser.getUserPassword().equals(loginUser.getUserPassword())) {

			return true;
		} else {
			return false;
		}
	}

}
