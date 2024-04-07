package ch.example.app.timeapplication.persistence;

import java.util.Calendar;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonIgnore;

//@author Saverio Damiani
@Entity
public class TimeActivity {

	@Id
	@GeneratedValue
	private int id;
	
	@Temporal(TemporalType.TIMESTAMP)
	private Calendar start;
	@Temporal(TemporalType.TIMESTAMP)
	@Column(nullable = true)
	private Calendar end;
	
	private ActivityType activityType;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "FK_TIME_SHEET")
	@JsonIgnore
	private TimeSheet timeSheet;
	
	//Default value = true
	private boolean approved = true;
	private boolean booked = true;
	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}
	
	public Calendar getStart() {
		return start;
	}
	
	public void setStart(Calendar start) {
		this.start = start;
	}
	
	public Calendar getEnd() {
		return end;
	}
	
	public void setEnd(Calendar end) {
		this.end = end;
	}
	
	public ActivityType getActivityType() {
		return activityType;
	}
	
	public void setActivityType(ActivityType activityType) {
		this.activityType = activityType;
	}
	
	public void setActivityType(String name) {
		this.activityType = ActivityType.valueOf(name);
	}
	
	public TimeSheet getTimeSheet() {
		return timeSheet;
	}

	public void setTimeSheet(TimeSheet timeSheet) {
		this.timeSheet = timeSheet;
	}
	
	public boolean isApproved() {
		return approved;
	}

	public void setApproved(boolean approved) {
		this.approved = approved;
	}
	
	public boolean isBooked() {
		return booked;
	}

	public void setBooked(boolean booked) {
		this.booked = booked;
	}

}
