package ch.example.app.timeapplication.persistence;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

//@author Saverio Damiani
@Repository
public interface TimeActivityRepository extends JpaRepository<TimeActivity, Integer> {

	//Returns last TimeActivity (where the End column is null)
	public TimeActivity findByEndIsNull();
	
	//Returns list of user's TimeActivites from the past (not today) and not booked
	@Query
	(value = "SELECT * FROM TIME_ACTIVITY t WHERE t.FK_TIME_SHEET = ?#{[0]} AND t.BOOKED = FALSE "
			+ "AND FORMATDATETIME(t.START,'yyyy-MM-dd') < CURRENT_DATE()", nativeQuery = true)
	public  List<TimeActivity> findAllByTimeSheetAndStartBeforeTodayAndBookedFalse(int id);

}
