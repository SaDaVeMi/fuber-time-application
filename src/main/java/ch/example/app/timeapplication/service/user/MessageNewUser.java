
package ch.example.app.timeapplication.service.user;

import ch.example.app.timeapplication.persistence.EmploymentType;
import ch.example.app.timeapplication.persistence.UserType;

//@author Alexander Ruckstuhl

public class MessageNewUser {

	private String userName;
	private String userPassword;
	private String department;
	private UserType userType;
	private EmploymentType employmentType;

	public EmploymentType getEmploymentType() {
		return employmentType;
	}

	public void setEmploymentType(EmploymentType employmentType) {
		this.employmentType = employmentType;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getUserPassword() {
		return userPassword;
	}

	public void setUserPassword(String userPassword) {
		this.userPassword = userPassword;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	public UserType getUserType() {
		return userType;
	}

	public void setUserType(UserType userType) {
		this.userType = userType;
	}

}
