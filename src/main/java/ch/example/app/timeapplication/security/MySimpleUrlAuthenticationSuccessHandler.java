package ch.example.app.timeapplication.security;

import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

/* 
 * https://github.com/eugenp/tutorials/blob/master/spring-security-modules/
 * spring-security-web-mvc-custom/src/main/java/com/baeldung/security/MySimpleUrlAuthenticationSuccessHandler.java
 * 
 */

public class MySimpleUrlAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
	protected final Log logger = LogFactory.getLog(this.getClass());

	private RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();

	public MySimpleUrlAuthenticationSuccessHandler() {
		super();
	}

	// API

	@Override
	public void onAuthenticationSuccess(final HttpServletRequest request, final HttpServletResponse response,
			final Authentication authentication) throws IOException {
		handle(request, response, authentication);
		clearAuthenticationAttributes(request);
		saveUsername(request, authentication);
	}


	// IMPL

	protected void handle(final HttpServletRequest request, final HttpServletResponse response,
			final Authentication authentication) throws IOException {
		final String targetUrl = determineTargetUrl(authentication);

		if (response.isCommitted()) {
			logger.debug("Response has already been committed. Unable to redirect to " + targetUrl);
			return;
		}

		redirectStrategy.sendRedirect(request, response, targetUrl);
	}

	protected String determineTargetUrl(final Authentication authentication) {

		Map<String, String> roleTargetUrlMap = new HashMap<>();
		roleTargetUrlMap.put("ROLE_USER", "/user");
		roleTargetUrlMap.put("ROLE_ADMIN", "/admin");
		roleTargetUrlMap.put("ROLE_HEAD", "/head");

		final Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
		for (final GrantedAuthority grantedAuthority : authorities) {

			String authorityName = grantedAuthority.getAuthority();
			if (roleTargetUrlMap.containsKey(authorityName)) {
				return roleTargetUrlMap.get(authorityName);
			}
		}

		throw new IllegalStateException();
	}

	/**
	 * Removes temporary authentication-related data which may have been stored in
	 * the session during the authentication process.
	 */
	protected final void clearAuthenticationAttributes(final HttpServletRequest request) {
		final HttpSession session = request.getSession(false);

		if (session == null) {
			return;
		}

		session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
		session.removeAttribute("username");
	}

	// Saves temporary username 
	private void saveUsername(HttpServletRequest request, Authentication authentication) {
		final HttpSession session = request.getSession(false);
		session.setAttribute("username", authentication.getName());
	}
}