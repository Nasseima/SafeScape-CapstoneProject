# --- Stage 1: Build the Spring Boot app ---
FROM maven:3.9.9-eclipse-temurin-22 AS build
WORKDIR /app

# Copy pom.xml and download dependencies first (better caching)
COPY pom.xml .
RUN mvn -q -DskipTests dependency:go-offline

# Copy source and build
COPY src ./src
RUN mvn -q -DskipTests clean package

# --- Stage 2: Run the app ---
FROM eclipse-temurin:22-jre
WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

# Simple entrypoint - Spring Boot will read environment variables
ENTRYPOINT ["java", "-jar", "app.jar"]
