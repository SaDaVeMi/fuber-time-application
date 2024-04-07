package ch.example.app.timeapplication.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class SecurityConfigurer extends WebSecurityConfigurerAdapter {

	public SecurityConfigurer() {
		super();
	}

	@Bean("authenticationManager")
	@Override
	public AuthenticationManager authenticationManagerBean() throws Exception {
		return super.authenticationManagerBean();
	}

	@Override
	protected void configure(HttpSecurity httpSecurity) throws Exception {
		// Enable H2 Database Console in Spring Security
		httpSecurity.authorizeRequests().antMatchers("/console/**").permitAll();
		httpSecurity.csrf().disable();
		httpSecurity.headers().frameOptions().disable();

		// Authentication Settings
		httpSecurity.sessionManagement().maximumSessions(1);
		httpSecurity.authorizeRequests()
		.antMatchers("/api/user/update/password/**").permitAll()
		.antMatchers("/api/user/name/**").permitAll()
		.antMatchers("/api/request/create/**").hasAnyRole("USER", "HEAD")
		.antMatchers("/api/user/users/**").hasRole("ADMIN")
		.antMatchers(HttpMethod.PUT, "/api/user/**").hasRole("ADMIN")
		.antMatchers(HttpMethod.DELETE, "/api/user/**").hasRole("ADMIN")
		.antMatchers(HttpMethod.POST, "/api/user/**").hasRole("ADMIN")
		.antMatchers("/api/user/**").permitAll()
		.antMatchers("/api/request/**").hasRole("HEAD")
		.antMatchers("/api/time/**").hasAnyRole("USER", "HEAD")
		.antMatchers("/admin/**").hasRole("ADMIN")
		.antMatchers("/user/**").hasRole("USER")
		.antMatchers("/head/**").hasRole("HEAD")
		.antMatchers("/homepage").permitAll()
	    .antMatchers("/").permitAll()
		.anyRequest().authenticated();
		
		// Custom Login
		httpSecurity
		.formLogin()
		.loginPage("/login").permitAll()
		.usernameParameter("username").passwordParameter("userpassword")
		.successHandler(successHandler())
		.and()
		.logout().permitAll()
		.invalidateHttpSession(true)
		.logoutUrl("/logout");

	}

	@Override
	public void configure(WebSecurity webSecurity) throws Exception {
		webSecurity.ignoring().antMatchers("/resources/**", "/static/**", "/css/**", "/js/**", "/img/**", "/views/**");
	}

	@Bean
	public MySimpleUrlAuthenticationSuccessHandler successHandler() {
		return new MySimpleUrlAuthenticationSuccessHandler();
	}

	@Bean
    public PasswordEncoder getPasswordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }

}
