# Estágio 1: Compilação
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Estágio 2: Execução
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app

# Corrigido: Pegamos qualquer jar da pasta target e copiamos como app.jar
# O uso do curinga * garante que não importa a versão (0.0.1-SNAPSHOT), ele vai copiar.
COPY --from=build /app/target/*.jar ./app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]