package ch.example.app.timeapplication.persistence;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

//@author Saverio Damiani
@Repository
public interface DepartmentRepository  extends JpaRepository<Department, String>{
	
	public Optional<Department> findByName(String name);

}
