package ch.example.app.timeapplication.persistence;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

//@author Saverio Damiani
@Repository
public interface UserRepository extends JpaRepository<User, Integer>{
	
	//Spring handles this method for us
	//All Methods with "findBy" are handled automatic by spring 
	//public User findByUserName(String userName);

	
	public Optional<User> findByUserName(String userName);
	public Optional<User> findByUserNameAndUserPassword(String userName, String userPassword);
	
	@Query(value = "SELECT id FROM USER u WHERE u.FK_DEPARTMENT = ?#{[0]}", nativeQuery = true) 
	public List<Integer> findAllByDepartment(String department);
	
	@Query(value = "SELECT * FROM USER u WHERE u.USER_TYPE  = 0 OR u.USER_TYPE = 2", nativeQuery = true) 
	public List<User> findAllByUserType();
}
