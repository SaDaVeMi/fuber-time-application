package ch.example.app.timeapplication.common;

import java.io.IOException;
import java.util.logging.FileHandler;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;

/**
 * Copyright 2015, FHNW, Prof. Dr. Brad Richards. All rights reserved. This code
 * is licensed under the terms of the BSD 3-clause license
 * 
 * The singleton instance of this class provide central storage for resources
 * used by the program. It also defines application-global constants, such as
 * the application name.
 * 
 * @author Brad Richards
 */
public class ServiceLocator {
	private static ServiceLocator serviceLocator; // singleton

	private Logger logger;

	/**
	 * Factory method for returning the singleton
	 * 
	 * @param mainClass The main class of this program
	 * @return The singleton resource locator
	 */
	public static ServiceLocator getServiceLocator() {
		if (serviceLocator == null) {
			serviceLocator = new ServiceLocator();
		}

		return serviceLocator;
	}

	/**
	 * Private constructor, because this class is a singleton
	 * 
	 * @param appName Name of the main class of this program
	 */
	private ServiceLocator() {

	}

	public Logger getLogger() {
		return logger;
	}

	public void setLogger(Logger logger) {
		this.logger = logger;
	}

	// With this method we log info
	public void logInfo(String logging) {
		serviceLocator.getLogger().info(logging);
	}

	// With this method we log warning
	public void logWarning(String logging) {
		serviceLocator.getLogger().warning(logging);
	}

	public void setUpServerLogFile() {
		FileHandler fh;
		try {
			// here we configure the logger with handler and formatter
			fh = new FileHandler("server_activity.log");
			serviceLocator.getLogger().addHandler(fh);
			SimpleFormatter formatter = new SimpleFormatter();
			fh.setFormatter(formatter);

		} catch (SecurityException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

	}

}
