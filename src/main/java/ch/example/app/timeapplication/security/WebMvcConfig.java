package ch.example.app.timeapplication.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

	//URL mapping for static HTML
	@Override
	public void addViewControllers(ViewControllerRegistry registry) {
		registry.addViewController("/homepage").setViewName("index");
		registry.addViewController("/login").setViewName("login");
		registry.addViewController("/user").setViewName("userMainView");
		registry.addViewController("/admin").setViewName("adminMainView");
		registry.addViewController("/head").setViewName("headMainView");
	}

}
