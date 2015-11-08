-- MySQL dump 10.13  Distrib 5.5.41, for debian-linux-gnu (x86_64)
--
-- Host: 0.0.0.0    Database: partydarling
-- ------------------------------------------------------
-- Server version	5.5.41-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `api_animation`
--

DROP TABLE IF EXISTS `api_animation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_animation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_animation`
--

LOCK TABLES `api_animation` WRITE;
/*!40000 ALTER TABLE `api_animation` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_animation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_behaviour`
--

DROP TABLE IF EXISTS `api_behaviour`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_behaviour` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_behaviour`
--

LOCK TABLES `api_behaviour` WRITE;
/*!40000 ALTER TABLE `api_behaviour` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_behaviour` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_character`
--

DROP TABLE IF EXISTS `api_character`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_character` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` longtext NOT NULL,
  `scenario_id` int(11),
  PRIMARY KEY (`id`),
  KEY `api_character_adc0676c` (`scenario_id`),
  CONSTRAINT `api_character_scenario_id_1452e4d02d0182cd_fk_api_scenario_id` FOREIGN KEY (`scenario_id`) REFERENCES `api_scenario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_character`
--

LOCK TABLES `api_character` WRITE;
/*!40000 ALTER TABLE `api_character` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_character` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_charactercomponent`
--

DROP TABLE IF EXISTS `api_charactercomponent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_charactercomponent` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `texture_id` int(11),
  PRIMARY KEY (`id`),
  UNIQUE KEY `texture_id` (`texture_id`),
  CONSTRAINT `api_charactercompo_texture_id_3fb76f8a0cc6bc3d_fk_api_texture_id` FOREIGN KEY (`texture_id`) REFERENCES `api_texture` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_charactercomponent`
--

LOCK TABLES `api_charactercomponent` WRITE;
/*!40000 ALTER TABLE `api_charactercomponent` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_charactercomponent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_check`
--

DROP TABLE IF EXISTS `api_check`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_check` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dialogue_id` int(11),
  PRIMARY KEY (`id`),
  KEY `api_check_fc53f29f` (`dialogue_id`),
  CONSTRAINT `api_check_dialogue_id_69120539b62faae4_fk_api_dialogue_id` FOREIGN KEY (`dialogue_id`) REFERENCES `api_dialogue` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_check`
--

LOCK TABLES `api_check` WRITE;
/*!40000 ALTER TABLE `api_check` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_check` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_component`
--

DROP TABLE IF EXISTS `api_component`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_component` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created` datetime NOT NULL,
  `name` varchar(100) NOT NULL,
  `image` varchar(100) NOT NULL,
  `description` longtext NOT NULL,
  `rating` double NOT NULL,
  `owner_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `api_component_5e7b1936` (`owner_id`),
  CONSTRAINT `api_component_owner_id_6fa1fe410ea4d9a3_fk_auth_user_id` FOREIGN KEY (`owner_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_component`
--

LOCK TABLES `api_component` WRITE;
/*!40000 ALTER TABLE `api_component` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_component` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_condition`
--

DROP TABLE IF EXISTS `api_condition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_condition` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `numArgs` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_condition`
--

LOCK TABLES `api_condition` WRITE;
/*!40000 ALTER TABLE `api_condition` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_condition` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_conditionalarguments`
--

DROP TABLE IF EXISTS `api_conditionalarguments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_conditionalarguments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `value` longtext NOT NULL,
  `dataType` int(11) NOT NULL,
  `index` int(11) NOT NULL,
  `conditionCheck_id` int(11),
  PRIMARY KEY (`id`),
  KEY `api_conditionalarguments_54e3520f` (`conditionCheck_id`),
  CONSTRAINT `api_condition_conditionCheck_id_1d533b9e593f426a_fk_api_check_id` FOREIGN KEY (`conditionCheck_id`) REFERENCES `api_check` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_conditionalarguments`
--

LOCK TABLES `api_conditionalarguments` WRITE;
/*!40000 ALTER TABLE `api_conditionalarguments` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_conditionalarguments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_connection`
--

DROP TABLE IF EXISTS `api_connection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_connection` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_connection`
--

LOCK TABLES `api_connection` WRITE;
/*!40000 ALTER TABLE `api_connection` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_connection` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_conversation`
--

DROP TABLE IF EXISTS `api_conversation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_conversation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `scenario_id` int(11),
  PRIMARY KEY (`id`),
  KEY `api_conversation_adc0676c` (`scenario_id`),
  CONSTRAINT `api_conversation_scenario_id_b7de576fc3a0696_fk_api_scenario_id` FOREIGN KEY (`scenario_id`) REFERENCES `api_scenario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_conversation`
--

LOCK TABLES `api_conversation` WRITE;
/*!40000 ALTER TABLE `api_conversation` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_conversation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_dialogue`
--

DROP TABLE IF EXISTS `api_dialogue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_dialogue` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `conversation_id` int(11),
  `speaker_id` int(11),
  PRIMARY KEY (`id`),
  KEY `api_dialogue_d52ac232` (`conversation_id`),
  KEY `api_dialogue_c5267933` (`speaker_id`),
  CONSTRAINT `api_dialogue_speaker_id_4dd6c1509be401fd_fk_api_character_id` FOREIGN KEY (`speaker_id`) REFERENCES `api_character` (`id`),
  CONSTRAINT `api_dial_conversation_id_359c1f9d9e13bdb2_fk_api_conversation_id` FOREIGN KEY (`conversation_id`) REFERENCES `api_conversation` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_dialogue`
--

LOCK TABLES `api_dialogue` WRITE;
/*!40000 ALTER TABLE `api_dialogue` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_dialogue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_furniturecomponent`
--

DROP TABLE IF EXISTS `api_furniturecomponent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_furniturecomponent` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `meshUrl` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_furniturecomponent`
--

LOCK TABLES `api_furniturecomponent` WRITE;
/*!40000 ALTER TABLE `api_furniturecomponent` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_furniturecomponent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_furnituretype`
--

DROP TABLE IF EXISTS `api_furnituretype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_furnituretype` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `furnitureComponent_id` int(11),
  `room_id` int(11),
  PRIMARY KEY (`id`),
  KEY `api_furnituretype_9ab7515e` (`furnitureComponent_id`),
  KEY `api_furnituretype_8273f993` (`room_id`),
  CONSTRAINT `api_furnituretype_room_id_35ddacf4e920dcff_fk_api_room_id` FOREIGN KEY (`room_id`) REFERENCES `api_room` (`id`),
  CONSTRAINT `e13a068270868dd51f2156171ae5618d` FOREIGN KEY (`furnitureComponent_id`) REFERENCES `api_furniturecomponent` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_furnituretype`
--

LOCK TABLES `api_furnituretype` WRITE;
/*!40000 ALTER TABLE `api_furnituretype` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_furnituretype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_item`
--

DROP TABLE IF EXISTS `api_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `scenario_id` int(11),
  `character_id` int(11),
  `itemDef_id` int(11),
  `room_id` int(11),
  PRIMARY KEY (`id`),
  UNIQUE KEY `itemDef_id` (`itemDef_id`),
  KEY `api_item_adc0676c` (`scenario_id`),
  KEY `api_item_bf21153f` (`character_id`),
  KEY `api_item_8273f993` (`room_id`),
  CONSTRAINT `api_item_room_id_2be8707798b09ab3_fk_api_room_id` FOREIGN KEY (`room_id`) REFERENCES `api_room` (`id`),
  CONSTRAINT `api_item_character_id_5a568a06c2d1bc34_fk_api_character_id` FOREIGN KEY (`character_id`) REFERENCES `api_character` (`id`),
  CONSTRAINT `api_item_itemDef_id_15acb20723d92011_fk_api_itemdefinition_id` FOREIGN KEY (`itemDef_id`) REFERENCES `api_itemdefinition` (`id`),
  CONSTRAINT `api_item_scenario_id_5122a37a73ec3632_fk_api_scenario_id` FOREIGN KEY (`scenario_id`) REFERENCES `api_scenario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_item`
--

LOCK TABLES `api_item` WRITE;
/*!40000 ALTER TABLE `api_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_itemdefinition`
--

DROP TABLE IF EXISTS `api_itemdefinition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_itemdefinition` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` longtext NOT NULL,
  `interactable` tinyint(1) NOT NULL,
  `texture_id` int(11),
  PRIMARY KEY (`id`),
  UNIQUE KEY `texture_id` (`texture_id`),
  CONSTRAINT `api_itemdefinition_texture_id_5aad8e8e0c29d1b1_fk_api_texture_id` FOREIGN KEY (`texture_id`) REFERENCES `api_texture` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_itemdefinition`
--

LOCK TABLES `api_itemdefinition` WRITE;
/*!40000 ALTER TABLE `api_itemdefinition` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_itemdefinition` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_joint`
--

DROP TABLE IF EXISTS `api_joint`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_joint` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `xPercentage` double NOT NULL,
  `yPercentage` double NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_joint`
--

LOCK TABLES `api_joint` WRITE;
/*!40000 ALTER TABLE `api_joint` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_joint` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_line`
--

DROP TABLE IF EXISTS `api_line`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_line` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text` varchar(100) NOT NULL,
  `dialogue_id` int(11),
  PRIMARY KEY (`id`),
  KEY `api_line_fc53f29f` (`dialogue_id`),
  CONSTRAINT `api_line_dialogue_id_644c688c2d85dd61_fk_api_dialogue_id` FOREIGN KEY (`dialogue_id`) REFERENCES `api_dialogue` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_line`
--

LOCK TABLES `api_line` WRITE;
/*!40000 ALTER TABLE `api_line` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_line` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_option`
--

DROP TABLE IF EXISTS `api_option`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_option` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text` longtext NOT NULL,
  `conversation_id` int(11),
  PRIMARY KEY (`id`),
  KEY `api_option_d52ac232` (`conversation_id`),
  CONSTRAINT `api_optio_conversation_id_8e25cdefd42b94d_fk_api_conversation_id` FOREIGN KEY (`conversation_id`) REFERENCES `api_conversation` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_option`
--

LOCK TABLES `api_option` WRITE;
/*!40000 ALTER TABLE `api_option` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_option` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_pduser`
--

DROP TABLE IF EXISTS `api_pduser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_pduser` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `avatar` varchar(100) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `api_pduser_user_id_73407aa633b937d1_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_pduser`
--

LOCK TABLES `api_pduser` WRITE;
/*!40000 ALTER TABLE `api_pduser` DISABLE KEYS */;
INSERT INTO `api_pduser` VALUES (1,'',2);
/*!40000 ALTER TABLE `api_pduser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_room`
--

DROP TABLE IF EXISTS `api_room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_room` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `size` int(11) NOT NULL,
  `scenario_id` int(11),
  PRIMARY KEY (`id`),
  KEY `api_room_adc0676c` (`scenario_id`),
  CONSTRAINT `api_room_scenario_id_4298dbdf0de93b8e_fk_api_scenario_id` FOREIGN KEY (`scenario_id`) REFERENCES `api_scenario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_room`
--

LOCK TABLES `api_room` WRITE;
/*!40000 ALTER TABLE `api_room` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_scenario`
--

DROP TABLE IF EXISTS `api_scenario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_scenario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created` datetime NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` longtext NOT NULL,
  `script` longtext NOT NULL,
  `rating` double NOT NULL,
  `owner_id` int(11) NOT NULL,
  `rating_count` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_scenario_5e7b1936` (`owner_id`),
  CONSTRAINT `api_scenario_owner_id_24680a874476a361_fk_auth_user_id` FOREIGN KEY (`owner_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_scenario`
--

LOCK TABLES `api_scenario` WRITE;
/*!40000 ALTER TABLE `api_scenario` DISABLE KEYS */;
INSERT INTO `api_scenario` VALUES (1,'2015-10-10 02:33:25','eeee','','{\"characters\":[{\"id\":1,\"name\":\"adasdds\",\"states\":[]},{\"id\":3,\"name\":\"asdas\",\"states\":[]}],\"conversations\":[{\"id\":1,\"name\":\"Conversation 1\"},{\"id\":2,\"name\":\"Conversation 2\"}]}',0,1,0);
/*!40000 ALTER TABLE `api_scenario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_skeletalconnection`
--

DROP TABLE IF EXISTS `api_skeletalconnection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_skeletalconnection` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `component_id` int(11),
  PRIMARY KEY (`id`),
  KEY `api_skeletalconnection_ef5a1f55` (`component_id`),
  CONSTRAINT `api_s_component_id_7e2cdf6407c67ba6_fk_api_charactercomponent_id` FOREIGN KEY (`component_id`) REFERENCES `api_charactercomponent` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_skeletalconnection`
--

LOCK TABLES `api_skeletalconnection` WRITE;
/*!40000 ALTER TABLE `api_skeletalconnection` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_skeletalconnection` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_skeletalconnection_outComponents`
--

DROP TABLE IF EXISTS `api_skeletalconnection_outComponents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_skeletalconnection_outComponents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `from_skeletalconnection_id` int(11) NOT NULL,
  `to_skeletalconnection_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `from_skeletalconnection_id` (`from_skeletalconnection_id`,`to_skeletalconnection_id`),
  KEY `api_skeletalconnection_outComponents_781e5d13` (`from_skeletalconnection_id`),
  KEY `api_skeletalconnection_outComponents_b8ba443a` (`to_skeletalconnection_id`),
  CONSTRAINT `a1345a7145af1b92019bbd6b641f4459` FOREIGN KEY (`to_skeletalconnection_id`) REFERENCES `api_skeletalconnection` (`id`),
  CONSTRAINT `D9b7ced6e9ba49a77430e742d96fdfdb` FOREIGN KEY (`from_skeletalconnection_id`) REFERENCES `api_skeletalconnection` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_skeletalconnection_outComponents`
--

LOCK TABLES `api_skeletalconnection_outComponents` WRITE;
/*!40000 ALTER TABLE `api_skeletalconnection_outComponents` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_skeletalconnection_outComponents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_state`
--

DROP TABLE IF EXISTS `api_state`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_state` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `behaviour_id` int(11),
  `character_id` int(11),
  `conversation_id` int(11),
  `idleAnimationOverride_id` int(11),
  PRIMARY KEY (`id`),
  KEY `api_state_7c8d0fdc` (`behaviour_id`),
  KEY `api_state_bf21153f` (`character_id`),
  KEY `api_state_d52ac232` (`conversation_id`),
  KEY `api_state_e993a34e` (`idleAnimationOverride_id`),
  CONSTRAINT `ap_idleAnimationOverride_id_59a2d43a3f2e1368_fk_api_animation_id` FOREIGN KEY (`idleAnimationOverride_id`) REFERENCES `api_animation` (`id`),
  CONSTRAINT `api_state_behaviour_id_252bcffc8a77ec79_fk_api_behaviour_id` FOREIGN KEY (`behaviour_id`) REFERENCES `api_behaviour` (`id`),
  CONSTRAINT `api_state_character_id_2ec4b889470011f5_fk_api_character_id` FOREIGN KEY (`character_id`) REFERENCES `api_character` (`id`),
  CONSTRAINT `api_state_conversation_id_cfa75fa65998030_fk_api_conversation_id` FOREIGN KEY (`conversation_id`) REFERENCES `api_conversation` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_state`
--

LOCK TABLES `api_state` WRITE;
/*!40000 ALTER TABLE `api_state` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_state` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_tag`
--

DROP TABLE IF EXISTS `api_tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_tag` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` longtext NOT NULL,
  `characterComponent_id` int(11),
  `furnitureComponent_id` int(11),
  `furnitureType_id` int(11),
  `itemDefinition_id` int(11),
  `room_id` int(11),
  PRIMARY KEY (`id`),
  KEY `api_tag_46aebaf3` (`characterComponent_id`),
  KEY `api_tag_9ab7515e` (`furnitureComponent_id`),
  KEY `api_tag_d6b1e88c` (`furnitureType_id`),
  KEY `api_tag_0a08ae44` (`itemDefinition_id`),
  KEY `api_tag_8273f993` (`room_id`),
  CONSTRAINT `api_tag_room_id_14e5baf5ecb9fb89_fk_api_room_id` FOREIGN KEY (`room_id`) REFERENCES `api_room` (`id`),
  CONSTRAINT `api_ta_furnitureType_id_480e6820727261c9_fk_api_furnituretype_id` FOREIGN KEY (`furnitureType_id`) REFERENCES `api_furnituretype` (`id`),
  CONSTRAINT `api__itemDefinition_id_348f51fa5a7efb74_fk_api_itemdefinition_id` FOREIGN KEY (`itemDefinition_id`) REFERENCES `api_itemdefinition` (`id`),
  CONSTRAINT `D0aa85e044682a922072b64d676c0024` FOREIGN KEY (`furnitureComponent_id`) REFERENCES `api_furniturecomponent` (`id`),
  CONSTRAINT `D9420200f745f12416e73d9a6268b1c6` FOREIGN KEY (`characterComponent_id`) REFERENCES `api_charactercomponent` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_tag`
--

LOCK TABLES `api_tag` WRITE;
/*!40000 ALTER TABLE `api_tag` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_texture`
--

DROP TABLE IF EXISTS `api_texture`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_texture` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `imageUrl` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_texture`
--

LOCK TABLES `api_texture` WRITE;
/*!40000 ALTER TABLE `api_texture` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_texture` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_trigger`
--

DROP TABLE IF EXISTS `api_trigger`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_trigger` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` longtext NOT NULL,
  `numArgs` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_trigger`
--

LOCK TABLES `api_trigger` WRITE;
/*!40000 ALTER TABLE `api_trigger` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_trigger` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_triggerarguments`
--

DROP TABLE IF EXISTS `api_triggerarguments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_triggerarguments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `value` longtext NOT NULL,
  `dataType` int(11) NOT NULL,
  `index` int(11) NOT NULL,
  `triggerCall_id` int(11),
  PRIMARY KEY (`id`),
  KEY `api_triggerarguments_f8522e5d` (`triggerCall_id`),
  CONSTRAINT `api_trigge_triggerCall_id_5efbb8e23de7b6b2_fk_api_triggercall_id` FOREIGN KEY (`triggerCall_id`) REFERENCES `api_triggercall` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_triggerarguments`
--

LOCK TABLES `api_triggerarguments` WRITE;
/*!40000 ALTER TABLE `api_triggerarguments` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_triggerarguments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_triggercall`
--

DROP TABLE IF EXISTS `api_triggercall`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_triggercall` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dialogue_id` int(11),
  `itemDef_id` int(11),
  `trigger_id` int(11),
  PRIMARY KEY (`id`),
  KEY `api_triggercall_fc53f29f` (`dialogue_id`),
  KEY `api_triggercall_9be75f21` (`itemDef_id`),
  KEY `api_triggercall_b10b1f9f` (`trigger_id`),
  CONSTRAINT `api_triggercall_trigger_id_185b6b5ceb61aac1_fk_api_trigger_id` FOREIGN KEY (`trigger_id`) REFERENCES `api_trigger` (`id`),
  CONSTRAINT `api_triggercall_dialogue_id_30abbdbfd45d4b7a_fk_api_dialogue_id` FOREIGN KEY (`dialogue_id`) REFERENCES `api_dialogue` (`id`),
  CONSTRAINT `api_trigger_itemDef_id_4456558cd35e4b93_fk_api_itemdefinition_id` FOREIGN KEY (`itemDef_id`) REFERENCES `api_itemdefinition` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_triggercall`
--

LOCK TABLES `api_triggercall` WRITE;
/*!40000 ALTER TABLE `api_triggercall` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_triggercall` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(80) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_group_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `group_id` (`group_id`,`permission_id`),
  KEY `auth_group_permissions_0e939a4f` (`group_id`),
  KEY `auth_group_permissions_8373b171` (`permission_id`),
  CONSTRAINT `auth_group_permission_group_id_689710a9a73b7457_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_group__permission_id_1f49ccbbdc69d2fc_fk_auth_permission_id` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `content_type_id` (`content_type_id`,`codename`),
  KEY `auth_permission_417f1b1c` (`content_type_id`),
  CONSTRAINT `auth__content_type_id_508cf46651277a81_fk_django_content_type_id` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can add permission',2,'add_permission'),(5,'Can change permission',2,'change_permission'),(6,'Can delete permission',2,'delete_permission'),(7,'Can add group',3,'add_group'),(8,'Can change group',3,'change_group'),(9,'Can delete group',3,'delete_group'),(10,'Can add user',4,'add_user'),(11,'Can change user',4,'change_user'),(12,'Can delete user',4,'delete_user'),(13,'Can add content type',5,'add_contenttype'),(14,'Can change content type',5,'change_contenttype'),(15,'Can delete content type',5,'delete_contenttype'),(16,'Can add session',6,'add_session'),(17,'Can change session',6,'change_session'),(18,'Can delete session',6,'delete_session'),(19,'Can add pd user',7,'add_pduser'),(20,'Can change pd user',7,'change_pduser'),(21,'Can delete pd user',7,'delete_pduser'),(22,'Can add scenario',8,'add_scenario'),(23,'Can change scenario',8,'change_scenario'),(24,'Can delete scenario',8,'delete_scenario'),(25,'Can add component',9,'add_component'),(26,'Can change component',9,'change_component'),(27,'Can delete component',9,'delete_component'),(28,'Can add item',10,'add_item'),(29,'Can change item',10,'change_item'),(30,'Can delete item',10,'delete_item'),(31,'Can add room',11,'add_room'),(32,'Can change room',11,'change_room'),(33,'Can delete room',11,'delete_room'),(34,'Can add behaviour',12,'add_behaviour'),(35,'Can change behaviour',12,'change_behaviour'),(36,'Can delete behaviour',12,'delete_behaviour'),(37,'Can add character',13,'add_character'),(38,'Can change character',13,'change_character'),(39,'Can delete character',13,'delete_character'),(40,'Can add conversation',14,'add_conversation'),(41,'Can change conversation',14,'change_conversation'),(42,'Can delete conversation',14,'delete_conversation'),(43,'Can add line',15,'add_line'),(44,'Can change line',15,'change_line'),(45,'Can delete line',15,'delete_line'),(46,'Can add condition',16,'add_condition'),(47,'Can change condition',16,'change_condition'),(48,'Can delete condition',16,'delete_condition'),(49,'Can add state',17,'add_state'),(50,'Can change state',17,'change_state'),(51,'Can delete state',17,'delete_state'),(52,'Can add skeletal connection',18,'add_skeletalconnection'),(53,'Can change skeletal connection',18,'change_skeletalconnection'),(54,'Can delete skeletal connection',18,'delete_skeletalconnection'),(55,'Can add item definition',19,'add_itemdefinition'),(56,'Can change item definition',19,'change_itemdefinition'),(57,'Can delete item definition',19,'delete_itemdefinition'),(58,'Can add dialogue',20,'add_dialogue'),(59,'Can change dialogue',20,'change_dialogue'),(60,'Can delete dialogue',20,'delete_dialogue'),(61,'Can add option',21,'add_option'),(62,'Can change option',21,'change_option'),(63,'Can delete option',21,'delete_option'),(64,'Can add character component',22,'add_charactercomponent'),(65,'Can change character component',22,'change_charactercomponent'),(66,'Can delete character component',22,'delete_charactercomponent'),(67,'Can add animation',23,'add_animation'),(68,'Can change animation',23,'change_animation'),(69,'Can delete animation',23,'delete_animation'),(70,'Can add tag',24,'add_tag'),(71,'Can change tag',24,'change_tag'),(72,'Can delete tag',24,'delete_tag'),(73,'Can add trigger',25,'add_trigger'),(74,'Can change trigger',25,'change_trigger'),(75,'Can delete trigger',25,'delete_trigger'),(76,'Can add texture',26,'add_texture'),(77,'Can change texture',26,'change_texture'),(78,'Can delete texture',26,'delete_texture'),(79,'Can add check',27,'add_check'),(80,'Can change check',27,'change_check'),(81,'Can delete check',27,'delete_check'),(82,'Can add furniture type',28,'add_furnituretype'),(83,'Can change furniture type',28,'change_furnituretype'),(84,'Can delete furniture type',28,'delete_furnituretype'),(88,'Can add trigger call',30,'add_triggercall'),(89,'Can change trigger call',30,'change_triggercall'),(90,'Can delete trigger call',30,'delete_triggercall'),(91,'Can add trigger arguments',31,'add_triggerarguments'),(92,'Can change trigger arguments',31,'change_triggerarguments'),(93,'Can delete trigger arguments',31,'delete_triggerarguments'),(94,'Can add conditional arguments',32,'add_conditionalarguments'),(95,'Can change conditional arguments',32,'change_conditionalarguments'),(96,'Can delete conditional arguments',32,'delete_conditionalarguments'),(97,'Can add joint',33,'add_joint'),(98,'Can change joint',33,'change_joint'),(99,'Can delete joint',33,'delete_joint'),(100,'Can add connection',34,'add_connection'),(101,'Can change connection',34,'change_connection'),(102,'Can delete connection',34,'delete_connection'),(103,'Can add furniture component',35,'add_furniturecomponent'),(104,'Can change furniture component',35,'change_furniturecomponent'),(105,'Can delete furniture component',35,'delete_furniturecomponent');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime NOT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(30) NOT NULL,
  `first_name` varchar(30) NOT NULL,
  `last_name` varchar(30) NOT NULL,
  `email` varchar(75) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
INSERT INTO `auth_user` VALUES (1,'pbkdf2_sha256$12000$yGQZX9aCJasx$kGgnNXMy4LVgF4qSQIwCFTX0NSbsxJaUOlQHzkrkw1s=','2015-10-08 16:38:45',1,'ryanbluth','','','',1,1,'2015-10-08 16:38:45'),(2,'pbkdf2_sha256$12000$OckHreQp7bgd$bOfs5qMXbXP/8WjViTeJr/GVyoGZUB8nj0stJ04lNcA=','2015-11-03 19:39:55',0,'ee','','','',0,1,'2015-10-10 02:33:13');
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_user_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`group_id`),
  KEY `auth_user_groups_e8701ad4` (`user_id`),
  KEY `auth_user_groups_0e939a4f` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_33ac548dcf5f8e37_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_4b5ed4ffdb8fd9b0_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`permission_id`),
  KEY `auth_user_user_permissions_e8701ad4` (`user_id`),
  KEY `auth_user_user_permissions_8373b171` (`permission_id`),
  CONSTRAINT `auth_user_user_permissi_user_id_7f0938558328534a_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `auth_user_u_permission_id_384b62483d7071f0_fk_auth_permission_id` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action_time` datetime NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_417f1b1c` (`content_type_id`),
  KEY `django_admin_log_e8701ad4` (`user_id`),
  CONSTRAINT `django_admin_log_user_id_52fdd58701c5f563_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `djang_content_type_id_697914295151027a_fk_django_content_type_id` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_45f3b1d93ec8c61c_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'log entry','admin','logentry'),(2,'permission','auth','permission'),(3,'group','auth','group'),(4,'user','auth','user'),(5,'content type','contenttypes','contenttype'),(6,'session','sessions','session'),(7,'pd user','api','pduser'),(8,'scenario','api','scenario'),(9,'component','api','component'),(10,'item','api','item'),(11,'room','api','room'),(12,'behaviour','api','behaviour'),(13,'character','api','character'),(14,'conversation','api','conversation'),(15,'line','api','line'),(16,'condition','api','condition'),(17,'state','api','state'),(18,'skeletal connection','api','skeletalconnection'),(19,'item definition','api','itemdefinition'),(20,'dialogue','api','dialogue'),(21,'option','api','option'),(22,'character component','api','charactercomponent'),(23,'animation','api','animation'),(24,'tag','api','tag'),(25,'trigger','api','trigger'),(26,'texture','api','texture'),(27,'check','api','check'),(28,'furniture type','api','furnituretype'),(30,'trigger call','api','triggercall'),(31,'trigger arguments','api','triggerarguments'),(32,'conditional arguments','api','conditionalarguments'),(33,'joint','api','joint'),(34,'connection','api','connection'),(35,'furniture component','api','furniturecomponent');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_migrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2015-10-08 16:38:28'),(2,'auth','0001_initial','2015-10-08 16:38:28'),(3,'admin','0001_initial','2015-10-08 16:38:28'),(4,'api','0001_initial','2015-10-08 16:38:29'),(5,'api','0002_auto_20150815_1655','2015-10-08 16:38:29'),(6,'api','0003_scenario_rating_count','2015-10-08 16:38:29'),(7,'api','0004_auto_20150822_1136','2015-10-08 16:38:29'),(8,'api','0005_auto_20150822_1137','2015-10-08 16:38:29'),(9,'sessions','0001_initial','2015-10-08 16:38:29'),(10,'api','0006_animation_behaviour_character_charactercomponent_check_condition_conditionalarguments_connection_con','2015-11-03 20:09:54'),(11,'api','0007_auto_20151103_2032','2015-11-03 20:32:16'),(12,'api','0008_auto_20151107_1840','2015-11-07 18:40:48');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_de54fa62` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('heq7fx94a878h00ipalt6itqg0lv9r8d','MjRmMmI3YzllMmEyMGZkMGNiNzQxZDVlMjMwM2I2NDcxMzNjZDMzYzp7Il9hdXRoX3VzZXJfaGFzaCI6IjE1MGVhYjUwNDZjYmE2MTg4YmUzODNjZjRlYzUzNTZjMGMxMmJhYTAiLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOjJ9','2015-10-27 00:10:52'),('ihainn8i047lkbnefp0ul2pzjmujkabf','MjRmMmI3YzllMmEyMGZkMGNiNzQxZDVlMjMwM2I2NDcxMzNjZDMzYzp7Il9hdXRoX3VzZXJfaGFzaCI6IjE1MGVhYjUwNDZjYmE2MTg4YmUzODNjZjRlYzUzNTZjMGMxMmJhYTAiLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOjJ9','2015-10-24 02:33:13'),('utb4ublbgy2knq2f2f4qz1ew93s38jfr','MjRmMmI3YzllMmEyMGZkMGNiNzQxZDVlMjMwM2I2NDcxMzNjZDMzYzp7Il9hdXRoX3VzZXJfaGFzaCI6IjE1MGVhYjUwNDZjYmE2MTg4YmUzODNjZjRlYzUzNTZjMGMxMmJhYTAiLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOjJ9','2015-11-03 15:55:35'),('z5eegkvi6wxfdyy49adqu3017ksb5ta5','MjRmMmI3YzllMmEyMGZkMGNiNzQxZDVlMjMwM2I2NDcxMzNjZDMzYzp7Il9hdXRoX3VzZXJfaGFzaCI6IjE1MGVhYjUwNDZjYmE2MTg4YmUzODNjZjRlYzUzNTZjMGMxMmJhYTAiLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOjJ9','2015-11-17 19:39:55');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-11-07 18:54:16
