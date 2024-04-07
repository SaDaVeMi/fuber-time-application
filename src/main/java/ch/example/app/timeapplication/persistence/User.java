package ch.example.app.timeapplication.persistence;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

//@author Saverio Damiani
@Entity
@Table(name = "User")
public class User {

	@Id
	@GeneratedValue
	private int id;
	
	@Column(name = "userName")
	private String userName;
	@Column(name = "userPassword")
	private String userPassword;
	private UserType userType;
	private EmploymentType employmentType;
	
	@OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)//fetch = FetchType.LAZY, 
	@JoinColumn(name = "TIME_SHEET_ID")
	private TimeSheet timeSheet;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "FK_DEPARTMENT")
	private Department department;
	
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Request> requests;
	
	
	public List<Request> getRequests() {
		return requests;
	}

	public void setRequests(List<Request> requests) {
		this.requests = requests;
	}
	
	public boolean deleteRequest(Request request) {
		for (int i = 0; i < requests.size(); i++) {
			if (requests.get(i).getId() == request.getId()) {
				requests.remove(i);
				return true;
			}
		}
		return false;
	}

	public EmploymentType getEmploymentType() {
		return employmentType;
	}

	public void setEmploymentType(EmploymentType employmentType) {
		this.employmentType = employmentType;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
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

	public UserType getUserType() {
		return userType;
	}
	
	public void setUserType(UserType userType) {
		this.userType = userType;
	}

	public TimeSheet getTimeSheet() {
		return timeSheet;
	}

	public void setTimeSheet(TimeSheet timeSheet) {
		this.timeSheet = timeSheet;
	}
	
	public Department getDepartment() {
		return department;
	}

	public void setDepartment(Department department) {
		this.department = department;
	}
}
