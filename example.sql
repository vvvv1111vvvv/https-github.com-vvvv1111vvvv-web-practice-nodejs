CREATE DATABASE IF NOT EXISTS main_service_db default character set utf8 collate utf8_general_ci;;

USE main_service_db;

CREATE TABLE IF NOT EXISTS `author` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `profile` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

--
-- Dumping data for table `author`
--
--INSERT INTO `author` VALUES (1,'egoing','developer');
--INSERT INTO `author` VALUES (2,'duru','database administrator');
--INSERT INTO `author` VALUES (3,'taeho','data scientist, developer');
--
-- Table structure for table `topic`
--
CREATE TABLE IF NOT EXISTS `topic` (
  `id` VARCHAR(55) NOT NULL,
  `title` varchar(30) NOT NULL,
  `description` text,
  `created` datetime NOT NULL,
  `last_updated` datetime,
  `user_id` VARCHAR(55) NOT NULL,
  PRIMARY KEY (`id`)
);

--
-- Dumping data for table `topic`
--
--INSERT INTO `topic` VALUES (1,'MySQL','MySQL is...','2018-01-01 12:10:11',1);
--INSERT INTO `topic` VALUES (2,'Oracle','Oracle is ...','2018-01-03 13:01:10',1);
--INSERT INTO `topic` VALUES (3,'SQL Server','SQL Server is ...','2018-01-20 11:01:10',2);
--INSERT INTO `topic` VALUES (4,'PostgreSQL','PostgreSQL is ...','2018-01-23 01:03:03',3);
--INSERT INTO `topic` VALUES (5,'MongoDB','MongoDB is ...','2018-01-30 12:31:03',1);
--CREATE TABLE `topic` (
--  `id` int(11) NOT NULL AUTO_INCREMENT,
--  `title` varchar(30) NOT NULL,
--  `description` text,
--  `created` datetime NOT NULL,
-- `author_id` int(11) DEFAULT NULL,
--  PRIMARY KEY (`id`)
--);INSERT INTO Users (id, email, password, userName, registered_date) VALUES('BaGQ4PGpw', 'egoin777@gmail.com', '111111', 'egoing', NOW())
CREATE TABLE IF NOT EXISTS Users (
  id VARCHAR(45) NOT NULL,
  email VARCHAR(55) NOT NULL,
  password VARCHAR(140),
  userName VARCHAR(20) NOT NULL,
  userNameCode VARCHAR(20) NOT NULL,
  googleId VARCHAR(45),
  registered_date datetime,

  gender VARCHAR(10),

  date_of_birth datetime,

  nationality VARCHAR(35),

  state_of_residance VARCHAR(35),
  country_of_residance VARCHAR(35),

  major VARCHAR(50),
  field_of_study VARCHAR(50),
  persnoal_interest VARCHAR(40),

  attending_university BOOLEAN,
  attending_bachelor_degree BOOLEAN,
  attending_master_degree BOOLEAN,
  attending_doctoral_degree BOOLEAN,
  attending_postdoc_researcher BOOLEAN,

  PRIMARY KEY (id)
);

--INSERT INTO Users (id, password) VALUES ('ungmo2', '1234');
--SELECT password FROM Users WHERE id='ungmo2';
CREATE TABLE IF NOT EXISTS Users_Specific (
  id VARCHAR(55) NOT NULL,
  highschool VARCHAR(60),
  attending_highschool BOOLEAN,
  university VARCHAR(60),
  university_major VARCHAR(60),
  attending_university BOOLEAN,
  attending_graduate_school BOOLEAN,
  bachelor_degree BOOLEAN,
  bachelor_degree_major VARCHAR(60),
  attending_bachelor_degree BOOLEAN,
  bachelor_school VARCHAR(60),
  bachelor_school_major VARCHAR(60),
  master_degree BOOLEAN,
  master_degree_major VARCHAR(60),
  attending_master_degree BOOLEAN,
  master_graduate_school VARCHAR(60),
  mater_graduate_school_major VARCHAR(60),
  doctoral_degree BOOLEAN,
  doctoral_degree_major VARCHAR(60),
  attending_doctoral_degree BOOLEAN,
  doctoral_graduate_school VARCHAR(60),
  doctoral_school_major VARCHAR(60),
  postdoc_researcher BOOLEAN,
  postdoc_researcher_major VARCHAR(60),
  attending_postdoc_researcher BOOLEAN,
  postdoc_graduate_school VARCHAR(60),
  postdoc_graduate_school_major VARCHAR(60),
  PRIMARY KEY (id)
);