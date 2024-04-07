package ch.example.app.timeapplication.persistence;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;

//@author Saverio Damiani
@Entity
public class Company {

	@Id
	private String name;
	
	@OneToMany(mappedBy = "company", orphanRemoval = true, cascade = CascadeType.ALL)
	private List<Department> departments;

	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public List<Department> getAllDepartments() {
		return departments;
	}
	
	/* Maybe not necessary (Repository)*/
//	public void addDepartment(Department department) {
//		departments.add(department);
//		department.setCompany(this);
//	}
//	
//	public void deleteDepartment(Department department) {
//		departments.add(department);
//		department.setCompany(this);
//	}
	
	
}
