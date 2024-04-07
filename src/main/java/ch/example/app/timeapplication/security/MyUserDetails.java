package ch.example.app.timeapplication.security;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import ch.example.app.timeapplication.persistence.User;
import ch.example.app.timeapplication.persistence.UserType;

public class MyUserDetails implements UserDetails {

	private String username;
	private String password;
	private UserType authorities;

	public MyUserDetails(User user) {
		this.username = user.getUserName();
		this.password = user.getUserPassword();
		this.authorities = user.getUserType();
		// Split in case user has more than one role
//				this.authorities = Arrays.stream(user.getUserType().name().split(","))
//				.map(SimpleGrantedAuthority::new)
//				.collect(Collectors.toList());
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		SimpleGrantedAuthority authority =
                new SimpleGrantedAuthority(authorities.name());
        return Collections.singletonList(authority);
	}

	@Override
	public String getPassword() {
		return password;
	}

	@Override
	public String getUsername() {
		return username;
	}
	
	// We don't use these attributes therefore we hard coded the return values
	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

}
