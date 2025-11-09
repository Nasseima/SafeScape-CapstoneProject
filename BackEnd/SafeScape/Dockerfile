# --- Stage 1: Build the Spring Boot app ---
FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copy pom.xml and download dependencies first (better caching)
COPY pom.xml .
RUN mvn -q -DskipTests dependency:go-offline

# Copy source and build
COPY src ./src
RUN mvn -q -DskipTests clean package

# --- Stage 2: Run the app ---
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Render will inject PORT and env vars
EXPOSE 8080

# Use env vars from Render to configure DB & port
ENTRYPOINT ["sh", "-c", "java \
  -Dserver.port=${PORT:-8080} \
  -Dspring.datasource.url=jdbc:mysql://${MYSQL_HOST}:3306/${MYSQL_DATABASE}?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC \
  -Dspring.datasource.username=${MYSQL_USER} \
  -Dspring.datasource.password=${MYSQL_PASSWORD} \
  -jar app.jar"]
