-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: cybersecurity_incidents_normalized
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `affected_systems`
--

DROP TABLE IF EXISTS `affected_systems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `affected_systems` (
  `system_id` int NOT NULL AUTO_INCREMENT,
  `system_name` varchar(100) NOT NULL,
  `system_type` varchar(50) DEFAULT NULL,
  `criticality` enum('LOW','MEDIUM','HIGH','CRITICAL') NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`system_id`),
  UNIQUE KEY `system_name` (`system_name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `department_id` int NOT NULL AUTO_INCREMENT,
  `department_name` varchar(100) NOT NULL,
  `department_head` varchar(100) DEFAULT NULL,
  `contact_email` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`department_id`),
  UNIQUE KEY `department_name` (`department_name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `incident_logs`
--

DROP TABLE IF EXISTS `incident_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incident_logs` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `incident_id` int NOT NULL,
  `member_id` int DEFAULT NULL,
  `log_message` text NOT NULL,
  `log_type` enum('INFO','WARNING','ERROR','CRITICAL') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`),
  KEY `incident_id` (`incident_id`),
  KEY `member_id` (`member_id`),
  CONSTRAINT `incident_logs_ibfk_1` FOREIGN KEY (`incident_id`) REFERENCES `incidents` (`incident_id`),
  CONSTRAINT `incident_logs_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `security_team` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `incident_reports`
--

DROP TABLE IF EXISTS `incident_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incident_reports` (
  `report_id` int NOT NULL AUTO_INCREMENT,
  `incident_id` int NOT NULL,
  `summary` text NOT NULL,
  `detailed_analysis` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`report_id`),
  KEY `incident_id` (`incident_id`),
  CONSTRAINT `incident_reports_ibfk_1` FOREIGN KEY (`incident_id`) REFERENCES `incidents` (`incident_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `incident_responses`
--

DROP TABLE IF EXISTS `incident_responses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incident_responses` (
  `response_id` int NOT NULL AUTO_INCREMENT,
  `incident_id` int NOT NULL,
  `member_id` int NOT NULL,
  `action_taken` text NOT NULL,
  `response_time` int DEFAULT NULL,
  `started_at` timestamp NOT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `status` enum('PENDING','IN_PROGRESS','COMPLETED') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`response_id`),
  KEY `incident_id` (`incident_id`),
  KEY `member_id` (`member_id`),
  KEY `idx_incident_responses_time` (`started_at`,`completed_at`),
  CONSTRAINT `incident_responses_ibfk_1` FOREIGN KEY (`incident_id`) REFERENCES `incidents` (`incident_id`),
  CONSTRAINT `incident_responses_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `security_team` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `incident_statuses`
--

DROP TABLE IF EXISTS `incident_statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incident_statuses` (
  `status_id` int NOT NULL AUTO_INCREMENT,
  `status_name` varchar(50) NOT NULL,
  `description` text,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`status_id`),
  UNIQUE KEY `status_name` (`status_name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `incident_types`
--

DROP TABLE IF EXISTS `incident_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incident_types` (
  `type_id` int NOT NULL AUTO_INCREMENT,
  `type_name` varchar(50) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`type_id`),
  UNIQUE KEY `type_name` (`type_name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `incidents`
--

DROP TABLE IF EXISTS `incidents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incidents` (
  `incident_id` int NOT NULL AUTO_INCREMENT,
  `incident_title` varchar(200) NOT NULL,
  `type_id` int NOT NULL,
  `severity_id` int NOT NULL,
  `system_id` int NOT NULL,
  `reporter_id` int NOT NULL,
  `status_id` int NOT NULL,
  `discovered_at` timestamp NOT NULL,
  `reported_at` timestamp NOT NULL,
  `financial_impact` decimal(15,2) DEFAULT NULL,
  `root_cause` text,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`incident_id`),
  KEY `severity_id` (`severity_id`),
  KEY `system_id` (`system_id`),
  KEY `reporter_id` (`reporter_id`),
  KEY `status_id` (`status_id`),
  KEY `idx_incidents_discovered_at` (`discovered_at`),
  KEY `idx_incidents_type_severity` (`type_id`,`severity_id`),
  CONSTRAINT `incidents_ibfk_1` FOREIGN KEY (`type_id`) REFERENCES `incident_types` (`type_id`),
  CONSTRAINT `incidents_ibfk_2` FOREIGN KEY (`severity_id`) REFERENCES `severity_levels` (`severity_id`),
  CONSTRAINT `incidents_ibfk_3` FOREIGN KEY (`system_id`) REFERENCES `affected_systems` (`system_id`),
  CONSTRAINT `incidents_ibfk_4` FOREIGN KEY (`reporter_id`) REFERENCES `reporters` (`reporter_id`),
  CONSTRAINT `incidents_ibfk_5` FOREIGN KEY (`status_id`) REFERENCES `incident_statuses` (`status_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reporters`
--

DROP TABLE IF EXISTS `reporters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reporters` (
  `reporter_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `department_id` int DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`reporter_id`),
  UNIQUE KEY `email` (`email`),
  KEY `department_id` (`department_id`),
  CONSTRAINT `reporters_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `security_team`
--

DROP TABLE IF EXISTS `security_team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `security_team` (
  `member_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` varchar(50) DEFAULT NULL,
  `expertise` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`member_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `severity_levels`
--

DROP TABLE IF EXISTS `severity_levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `severity_levels` (
  `severity_id` int NOT NULL AUTO_INCREMENT,
  `severity_name` varchar(20) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`severity_id`),
  UNIQUE KEY `severity_name` (`severity_name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `threat_guidelines`
--

DROP TABLE IF EXISTS `threat_guidelines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `threat_guidelines` (
  `id` int NOT NULL AUTO_INCREMENT,
  `threat_type` varchar(100) NOT NULL,
  `do_dont` enum('DO','DONT') NOT NULL,
  `guideline` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-28 17:11:23
