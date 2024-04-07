package ch.example.app.timeapplication.persistence;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonIgnore;

//@author Saverio Damiani
@Entity
public class Department {

	@Id
	private String name;

	@OneToMany(mappedBy = "department", orphanRemoval = false)
	@JsonIgnore
	private List<User> users;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "FK_COMPANY")
	private Company company;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Company getCompany() {
		return company;
	}

	public void setCompany(Company company) {
		this.company = company;
	}

	public List<User> getUsers() {
		return users;
	}

	public void setUsers(List<User> users) {
		this.users = users;
	}

	public void addUser(User user) {
		users.add(user);
	}
}
