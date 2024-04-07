package ch.example.app.timeapplication.persistence;

//@author Saverio Damiani
public enum EmploymentType {

	//Unit in Minutes
	FULLTIME(-480, 9600), 
	PARTTIME(-240, 4800);

	private final int WORKTIME;
	private final int VACATIONTIME;
	
	private EmploymentType(int WORKTIME, int VACATIONTIME) {
		this.WORKTIME = WORKTIME;
		this.VACATIONTIME = VACATIONTIME;
	}
	
	public int getWorkTime() {
		return this.WORKTIME;
	}
	
	public int getVacationTime() {
		return this.VACATIONTIME;
	}
}
