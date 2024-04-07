package ch.example.app.timeapplication.persistence;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;

//@author Saverio Damiani
@Entity
public class TimeSheet {

	@Id
	@GeneratedValue
	public int id;

	// TimeBalance in Minutes
	private float vacationTimeBalance;
	private float workTimeBalance;

	private boolean clockedIn;

	@OneToMany(mappedBy = "timeSheet", orphanRemoval = true, cascade = CascadeType.ALL)
	private List<TimeActivity> timeActivities;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public float getVacationTimeBalance() {
		return vacationTimeBalance;
	}

	public void setVacationTimeBalance(float vacationTimeBalance) {
		this.vacationTimeBalance = vacationTimeBalance;
	}

	public void addVacationTimeBalance(float vacationTimeBalance) {
		this.vacationTimeBalance += vacationTimeBalance;
	}

	public float getWorkTimeBalance() {
		return workTimeBalance;
	}

	public void setWorkTimeBalance(float workTimeBalance) {
		this.workTimeBalance = workTimeBalance;
	}

	public void addWorkTime(float workTimeBalance) {
		this.workTimeBalance += workTimeBalance;
	}

	public boolean isClockedIn() {
		return clockedIn;
	}

	public void setClockedIn(boolean clockedIn) {
		this.clockedIn = clockedIn;
	}

	public List<TimeActivity> getTimeActivities() {
		return timeActivities;
	}

	public void setTimeActivities(List<TimeActivity> timeActivities) {
		this.timeActivities = timeActivities;
	}

	public boolean deleteTimeActivity(TimeActivity timeActivity) {
		for (int i = 0; i < timeActivities.size(); i++) {
			if (timeActivities.get(i).getId() == timeActivity.getId()) {
				timeActivities.remove(i);
				return true;
			}
		}
		return false;
	}
}
