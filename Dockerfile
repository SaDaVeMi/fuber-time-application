FROM openjdk:11
LABEL maintainer="Saverio Damiani"
EXPOSE 8080
ADD target/time-application.jar time-application.jar
ENTRYPOINT ["java", "-jar", "/time-application.jar"]