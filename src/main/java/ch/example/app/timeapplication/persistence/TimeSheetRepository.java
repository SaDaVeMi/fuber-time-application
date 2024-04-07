package ch.example.app.timeapplication.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

//@author Saverio Damiani
@Repository
public interface TimeSheetRepository extends JpaRepository<TimeSheet, Integer>{
		
}
