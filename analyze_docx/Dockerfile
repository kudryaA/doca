FROM maven:3.6.2-jdk-8
COPY src /home/src
COPY pom.xml /home
WORKDIR /home
RUN mvn clean package
WORKDIR /home/target
CMD java -jar analyze_docx-1.0-SNAPSHOT.jar