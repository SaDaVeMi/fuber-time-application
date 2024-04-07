package ch.example.app.timeapplication.persistence;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

//@author Saverio Damiani
@Entity
public class Request {

	@Id
	@GeneratedValue
	private int id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "FK_USER_ID")
	@JsonIgnoreProperties(value = {
			"userPassword",
            "userType",
            "employmentType",
            "timeSheet",
            "department",
            "requests"
		})
	private User user;

	// If request is a vacation request then this column is not null
	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "TIME_ACTIVITY_ID", nullable = true)
	private TimeActivity timeActivity;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public TimeActivity getTimeActivity() {
		return timeActivity;
	}

	public void setTimeActivity(TimeActivity timeActivity) {
		this.timeActivity = timeActivity;
	}
}
