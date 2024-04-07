package ch.example.app.timeapplication.persistence;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

//@author Saverio Damiani
@Repository
public interface RequestRepository extends JpaRepository<Request, Integer>{

	public List<Request> findAll();

	public List<Request> findAllByUserIdIn(List<Integer> users);
}
