# ─── Estágio 1: Build com Maven ───────────────────────────────────────────────
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Copia apenas os descritores de dependência primeiro (cache de camadas)
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .

RUN chmod +x mvnw && ./mvnw dependency:go-offline -q

# Copia o código-fonte e compila
COPY src ./src

RUN ./mvnw clean package -DskipTests -q

# ─── Estágio 2: Runtime mínimo com JRE ────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine AS runtime

WORKDIR /app

# Copia apenas o JAR gerado
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
