-- MySQL dump 10.13  Distrib 8.3.0, for Win64 (x86_64)
--
-- Host: localhost    Database: CommuniCraft
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `skillId` int NOT NULL,
  `size` json NOT NULL,
  `color` json NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,20,'{\"l\": 40, \"m\": 30, \"s\": 20}','{\"Red\": 1, \"Green\": 2}','2024-02-26 19:59:27','2024-02-26 19:59:27');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `collaboration_requests`
--

DROP TABLE IF EXISTS `collaboration_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `collaboration_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `user_id` int NOT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `collaboration_requests_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE,
  CONSTRAINT `collaboration_requests_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `collaboration_requests`
--

LOCK TABLES `collaboration_requests` WRITE;
/*!40000 ALTER TABLE `collaboration_requests` DISABLE KEYS */;
INSERT INTO `collaboration_requests` VALUES (1,1,55,'pending','2024-03-01 11:43:51'),(2,1,55,'pending','2024-03-01 11:49:39'),(3,1,55,'accepted','2024-03-01 11:53:09'),(4,3,55,'pending','2024-03-01 11:57:47');
/*!40000 ALTER TABLE `collaboration_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projectcategories`
--

DROP TABLE IF EXISTS `projectcategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projectcategories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projectcategories`
--

LOCK TABLES `projectcategories` WRITE;
/*!40000 ALTER TABLE `projectcategories` DISABLE KEYS */;
/*!40000 ALTER TABLE `projectcategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projectcollaborators`
--

DROP TABLE IF EXISTS `projectcollaborators`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projectcollaborators` (
  `project_id` int NOT NULL,
  `user_id` int NOT NULL,
  `joined_at` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`project_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `projectcollaborators_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE,
  CONSTRAINT `projectcollaborators_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projectcollaborators`
--

LOCK TABLES `projectcollaborators` WRITE;
/*!40000 ALTER TABLE `projectcollaborators` DISABLE KEYS */;
INSERT INTO `projectcollaborators` VALUES (10,30,'2024-02-27 15:46:25','2024-02-27 15:46:25','2024-02-27 15:46:25'),(10,40,'2024-02-27 15:46:25','2024-02-27 15:46:25','2024-02-27 15:46:25'),(19,30,'2024-02-27 17:38:12','2024-02-27 17:38:12','2024-02-27 17:38:12'),(19,40,'2024-02-27 17:38:12','2024-02-27 17:38:12','2024-02-27 17:38:12'),(21,30,'2024-02-27 17:59:08','2024-02-27 17:59:08','2024-02-27 17:59:08'),(21,40,'2024-02-27 17:59:08','2024-02-27 17:59:08','2024-02-27 17:59:08'),(23,10,'2024-02-29 21:14:39','2024-02-29 21:14:39','2024-02-29 21:14:39'),(25,10,'2024-03-01 10:13:26','2024-03-01 10:13:26','2024-03-01 10:13:26'),(25,60,'2024-03-01 10:13:26','2024-03-01 10:13:26','2024-03-01 10:13:26'),(27,10,'2024-03-01 10:18:30','2024-03-01 10:18:30','2024-03-01 10:18:30'),(27,55,'2024-03-01 10:18:30','2024-03-01 10:18:30','2024-03-01 10:18:30'),(27,60,'2024-03-01 10:18:30','2024-03-01 10:18:30','2024-03-01 10:18:30');
/*!40000 ALTER TABLE `projectcollaborators` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `project_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `difficulty_level` enum('beginner','intermediate','advanced') NOT NULL,
  `estimated_time` int NOT NULL,
  `group_size` int NOT NULL,
  `created_at` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `materials` json DEFAULT NULL,
  PRIMARY KEY (`project_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,'My Awesome Project','This is a detailed description of my project.','intermediate',120,2,'2024-02-27 08:34:08','2024-02-27 08:34:08','2024-02-27 08:34:08',NULL),(2,'My second Project','This is a detailed description of my project.','advanced',300,5,'2024-02-27 08:37:38','2024-02-27 08:37:38','2024-02-27 08:37:38',NULL),(3,'My second Project','This is a detailed description of my project.','advanced',300,5,'2024-02-27 08:40:22','2024-02-27 08:40:22','2024-02-27 08:40:22','[\"Material 1\", \"Material 2\"]'),(4,'ruba','this for testing','beginner',100,2,'2024-02-27 15:25:40','2024-02-27 15:25:40','2024-02-27 15:25:40','[\"sewing machne\", \"colors\"]'),(5,'ruba','this for testing','beginner',100,2,'2024-02-27 15:26:26','2024-02-27 15:26:26','2024-02-27 15:26:26','[\"sewing machne\", \"colors\"]'),(6,'ruba','this for testing','beginner',100,2,'2024-02-27 15:37:54','2024-02-27 15:37:54','2024-02-27 15:37:54','[\"sewing machne\", \"colors\"]'),(7,'ruba','this for testing','beginner',100,2,'2024-02-27 15:40:19','2024-02-27 15:40:19','2024-02-27 15:40:19','[\"sewing machne\", \"colors\"]'),(8,'ruba','this for testing','beginner',100,2,'2024-02-27 15:41:39','2024-02-27 15:41:39','2024-02-27 15:41:39','[\"sewing machne\", \"colors\"]'),(9,'ruba','this for testing','beginner',100,2,'2024-02-27 15:42:37','2024-02-27 15:42:37','2024-02-27 15:42:37','[\"sewing machne\", \"colors\"]'),(10,'ruba','this for testing','beginner',100,2,'2024-02-27 15:43:14','2024-02-27 15:43:14','2024-02-27 15:43:14','[\"sewing machne\", \"colors\"]'),(11,'ruba','this for testing','beginner',100,2,'2024-02-27 15:43:47','2024-02-27 15:43:47','2024-02-27 15:43:47','[\"sewing machne\", \"colors\"]'),(12,'ruba','this for testing','beginner',100,2,'2024-02-27 15:44:19','2024-02-27 15:44:19','2024-02-27 15:44:19','[\"sewing machne\", \"colors\"]'),(13,'ruba','this for testing','beginner',100,2,'2024-02-27 15:44:30','2024-02-27 15:44:30','2024-02-27 15:44:30','[\"sewing machne\", \"colors\"]'),(14,'ruba','this for testing','beginner',100,2,'2024-02-27 15:44:42','2024-02-27 15:44:42','2024-02-27 15:44:42','[\"sewing machne\", \"colors\"]'),(15,'ruba','this for testing','beginner',100,2,'2024-02-27 15:45:16','2024-02-27 15:45:16','2024-02-27 15:45:16','[\"sewing machne\", \"colors\"]'),(16,'ruba','this for testing','beginner',100,2,'2024-02-27 15:46:08','2024-02-27 15:46:08','2024-02-27 15:46:08','[\"sewing machne\", \"colors\"]'),(17,'ruba','this for testing','beginner',100,2,'2024-02-27 15:46:25','2024-02-27 15:46:25','2024-02-27 15:46:25','[\"sewing machne\", \"colors\"]'),(18,'ruba','this for testing','beginner',100,2,'2024-02-27 17:37:11','2024-02-27 17:37:11','2024-02-27 17:37:11','[\"sewing machne\", \"colors\"]'),(19,'ruba','this for testing','beginner',100,2,'2024-02-27 17:38:12','2024-02-27 17:38:12','2024-02-27 17:38:12','[\"sewing machne\", \"colors\"]'),(20,'ruba','this for testing','beginner',100,2,'2024-02-27 17:56:42','2024-02-27 17:56:42','2024-02-27 17:56:42','[\"sewing machne\", \"colors\"]'),(21,'tsttt','this for testing','beginner',100,2,'2024-02-27 17:59:08','2024-02-27 17:59:08','2024-02-27 17:59:08','[\"sewing machne\", \"colors\"]'),(22,'New Project','This is a detailed description of my project.','beginner',120,4,'2024-02-29 21:12:33','2024-02-29 21:12:33','2024-02-29 21:12:33','[\"Material 1\", \"Material 2\"]'),(23,'New Project','This is a detailed description of my project.','beginner',120,4,'2024-02-29 21:14:39','2024-02-29 21:14:39','2024-02-29 21:14:39','[\"Material 1\", \"Material 2\"]'),(24,'Hello','This is a detailed description of my project.','beginner',60,4,'2024-03-01 10:09:50','2024-03-01 10:09:50','2024-03-01 10:09:50','[\"Material 1\", \"Material 2\"]'),(25,'Hello','This is a detailed description of my project.','beginner',60,4,'2024-03-01 10:13:26','2024-03-01 10:13:26','2024-03-01 10:13:26','[\"Material 1\", \"Material 2\"]'),(26,'Test num4','This is a detailed description of my project.','beginner',60,4,'2024-03-01 10:16:56','2024-03-01 10:16:56','2024-03-01 10:16:56','[\"Material 1\", \"Material 2\"]'),(27,'Test num4','This is a detailed description of my project.','beginner',60,4,'2024-03-01 10:18:30','2024-03-01 10:18:30','2024-03-01 10:18:30','[\"Material 1\", \"Material 2\"]');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skills`
--

DROP TABLE IF EXISTS `skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skills` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skills`
--

LOCK TABLES `skills` WRITE;
/*!40000 ALTER TABLE `skills` DISABLE KEYS */;
INSERT INTO `skills` VALUES (10,'embroidering','testttt','2024-02-26 18:14:51','2024-02-26 18:14:51'),(12,'swimming','hello world!','2024-02-28 19:52:37','2024-02-28 19:52:37'),(20,'embroidering','testttt','2024-02-26 18:21:12','2024-02-26 18:21:12'),(30,'design','2345676543','2024-03-01 16:32:41','2024-03-01 16:32:41'),(50,'CNC','sdfghgfdsasdfggg','2024-02-27 13:35:05','2024-02-27 13:35:05'),(60,'tryghjk','sdfghgfdsasdfggg','2024-02-27 13:42:53','2024-02-27 13:42:53'),(70,'CNC','sdfghgfdsasdfggg','2024-02-27 13:44:30','2024-02-27 13:44:30'),(80,'draw','draw face','2024-02-27 14:28:34','2024-02-27 14:28:34'),(90,'cloth','hello','2024-02-27 15:07:53','2024-02-27 15:07:53');
/*!40000 ALTER TABLE `skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (10,'Ali','Ahmad','ahmad@gmail.com','2132456578','023245667','Nablus','2024-02-26 16:04:22','2024-02-26 16:04:22'),(30,'Qawa','Ruba','ruba@gmail.com','2132456578','023245667','Nablus','2024-02-26 16:03:19','2024-02-26 16:03:19'),(40,'Salah','Ali','salah@gmail.com','$2b$10$h.5yYYAqysy/DjEIKVRCM.l3QTTKfsgn2.dJX1zaCYDtp/9o4rl3e','023245667','Nablus','2024-02-27 09:36:10','2024-02-27 09:36:10'),(55,'Ola','Awad','ola@gmail.com','$2b$10$x8bsy2sASLzHVGRH4QJCNuxpZYa3FT6pwWs60siopGrduCiRutUcu','0569745454','Ramallah','2024-02-28 19:31:05','2024-02-28 19:31:05'),(60,'Leen','Ibraheem','leen@gmail.com','$2b$10$sZt9zJOtd4dfFoUfgUjRieDeYi7VI4dPeqfA0ywuLDnd4Kan2UVVe','12345678','Awarta','2024-02-27 18:06:04','2024-02-27 18:06:04');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userskills`
--

DROP TABLE IF EXISTS `userskills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userskills` (
  `userId` int NOT NULL,
  `skillId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`userId`,`skillId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userskills`
--

LOCK TABLES `userskills` WRITE;
/*!40000 ALTER TABLE `userskills` DISABLE KEYS */;
INSERT INTO `userskills` VALUES (0,0,'2024-02-27 14:28:34','2024-02-27 14:28:34'),(0,60,'2024-02-27 13:42:53','2024-02-27 13:42:53'),(10,20,'2024-02-26 18:21:12','2024-02-26 18:21:12'),(40,0,'2024-02-27 14:47:54','2024-02-27 14:47:54'),(40,10,'2024-02-27 14:48:48','2024-02-27 14:48:48'),(40,12,'2024-02-28 20:20:01','2024-02-28 20:20:01'),(40,30,'2024-02-27 15:05:13','2024-02-27 15:05:13'),(40,50,'2024-02-27 15:06:09','2024-02-27 15:06:09'),(40,70,'2024-02-27 13:44:30','2024-02-27 13:44:30'),(55,12,'2024-02-28 19:52:37','2024-02-28 19:52:37'),(55,30,'2024-03-01 16:32:41','2024-03-01 16:32:41');
/*!40000 ALTER TABLE `userskills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workshop_applications`
--

DROP TABLE IF EXISTS `workshop_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workshop_applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `workshop_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contact_info` varchar(255) NOT NULL,
  `additional_info` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `workshop_id` (`workshop_id`),
  CONSTRAINT `workshop_applications_ibfk_1` FOREIGN KEY (`workshop_id`) REFERENCES `workshops` (`eventId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workshop_applications`
--

LOCK TABLES `workshop_applications` WRITE;
/*!40000 ALTER TABLE `workshop_applications` DISABLE KEYS */;
INSERT INTO `workshop_applications` VALUES (1,2,'Ola','ola@gmail.com','0569745454',NULL,'2024-03-01 09:21:08');
/*!40000 ALTER TABLE `workshop_applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workshop_trainers`
--

DROP TABLE IF EXISTS `workshop_trainers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workshop_trainers` (
  `workshop_id` int NOT NULL,
  `trainer_id` int NOT NULL,
  PRIMARY KEY (`workshop_id`,`trainer_id`),
  KEY `trainer_id` (`trainer_id`),
  CONSTRAINT `workshop_trainers_ibfk_1` FOREIGN KEY (`workshop_id`) REFERENCES `workshops` (`eventId`),
  CONSTRAINT `workshop_trainers_ibfk_2` FOREIGN KEY (`trainer_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workshop_trainers`
--

LOCK TABLES `workshop_trainers` WRITE;
/*!40000 ALTER TABLE `workshop_trainers` DISABLE KEYS */;
INSERT INTO `workshop_trainers` VALUES (10,10),(1,40),(2,40),(2,60),(10,60);
/*!40000 ALTER TABLE `workshop_trainers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workshops`
--

DROP TABLE IF EXISTS `workshops`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workshops` (
  `eventId` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `date_time` datetime NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `duration` time DEFAULT NULL,
  `organizer` varchar(255) DEFAULT NULL,
  `capacity` int DEFAULT NULL,
  `registrationDeadline` datetime DEFAULT NULL,
  `registrationFee` decimal(10,2) DEFAULT NULL,
  `status` enum('upcoming','ongoing','completed') DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `available_seats` int DEFAULT '0',
  `required_tool` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`eventId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workshops`
--

LOCK TABLES `workshops` WRITE;
/*!40000 ALTER TABLE `workshops` DISABLE KEYS */;
INSERT INTO `workshops` VALUES (1,'Workshop Title','Description of the workshop','2024-03-01 10:00:00','Nablus','02:00:00','Ruba Qawareeq',50,'2024-02-28 23:59:59',50.00,'upcoming','2024-02-29 16:13:21','2024-02-29 16:13:21',0,NULL),(2,'Clothing design','Description of the workshop','2024-02-29 10:00:00','Workshop Location','02:00:00','Organizer Name',50,'2024-02-28 23:59:59',50.00,'upcoming','2024-02-29 16:23:13','2024-03-01 16:37:46',0,NULL),(3,'Drawing','Hello  World!','2024-03-10 10:00:00','Nablus','02:00:00','Organizer Name',30,'2024-02-28 23:59:59',0.00,'upcoming','2024-02-29 17:18:15','2024-02-29 17:18:15',0,NULL),(4,'Drawing','Hello  World!','2024-03-10 10:00:00','Nablus','02:00:00','Organizer Name',30,'2024-02-28 23:59:59',0.00,'upcoming','2024-02-29 17:18:37','2024-02-29 17:18:37',0,NULL),(5,'Drawing','Hello  World!','2024-03-10 10:00:00','Nablus','02:00:00','Organizer Name',30,'2024-02-28 23:59:59',0.00,'upcoming','2024-02-29 17:18:53','2024-02-29 17:18:53',0,NULL),(6,'Drawing','Hello  World!','2024-03-10 10:00:00','Nablus','02:00:00','Organizer Name',30,'2024-02-28 23:59:59',0.00,'upcoming','2024-02-29 17:19:11','2024-02-29 17:19:11',0,NULL),(7,'Drawing','Hello  World!','2024-03-10 10:00:00','Nablus','02:00:00','Organizer Name',30,'2024-02-28 23:59:59',0.00,'upcoming','2024-02-29 17:29:46','2024-02-29 17:29:46',0,NULL),(8,'Drawing','Hello  World!','2024-03-10 10:00:00','Nablus','02:00:00','Organizer Name',30,'2024-02-28 23:59:59',0.00,'upcoming','2024-02-29 17:33:41','2024-02-29 17:33:41',0,NULL),(9,'Drawing','Hello  World!','2024-03-10 10:00:00','Nablus','02:00:00','Organizer Name',30,'2024-02-28 23:59:59',0.00,'upcoming','2024-02-29 17:38:41','2024-02-29 17:38:41',0,NULL),(10,'Testtt','Hello  World!','2024-03-10 10:00:00','Nablus','02:00:00','Organizer Name',30,'2024-02-28 23:59:59',0.00,'upcoming','2024-02-29 18:15:37','2024-02-29 18:15:37',0,NULL);
/*!40000 ALTER TABLE `workshops` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-03-01 21:08:06
