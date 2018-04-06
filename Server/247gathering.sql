-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 06, 2018 at 02:34 AM
-- Server version: 5.7.19
-- PHP Version: 5.6.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `247gathering`
--

-- --------------------------------------------------------

--
-- Table structure for table `greek`
--

DROP TABLE IF EXISTS `greek`;
CREATE TABLE IF NOT EXISTS `greek` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `greek`
--

INSERT INTO `greek` (`id`, `name`) VALUES
(-1, 'Other'),
(1, 'ZBT'),
(2, 'Alpha Theta'),
(3, 'SD');

-- --------------------------------------------------------

--
-- Table structure for table `howhear`
--

DROP TABLE IF EXISTS `howhear`;
CREATE TABLE IF NOT EXISTS `howhear` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `howhear`
--

INSERT INTO `howhear` (`id`, `name`) VALUES
(-1, 'Other'),
(1, 'Friend'),
(2, 'Just walked in'),
(3, 'God');

-- --------------------------------------------------------

--
-- Table structure for table `ministry`
--

DROP TABLE IF EXISTS `ministry`;
CREATE TABLE IF NOT EXISTS `ministry` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ministry`
--

INSERT INTO `ministry` (`id`, `name`) VALUES
(-1, 'Other'),
(1, 'CCF'),
(2, 'CRU');

-- --------------------------------------------------------

--
-- Table structure for table `songs`
--

DROP TABLE IF EXISTS `songs`;
CREATE TABLE IF NOT EXISTS `songs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(512) NOT NULL,
  `data` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(128) NOT NULL,
  `lastName` varchar(128) NOT NULL,
  `email` varchar(512) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `howhear` int(11) NOT NULL,
  `howhearOther` varchar(512) NOT NULL,
  `ministry` int(11) NOT NULL,
  `ministryOther` varchar(512) NOT NULL,
  `greek` int(11) NOT NULL,
  `greekOther` varchar(512) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ministry` (`ministry`),
  KEY `greek` (`greek`),
  KEY `howhear` (`howhear`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `fk_greek` FOREIGN KEY (`greek`) REFERENCES `greek` (`id`),
  ADD CONSTRAINT `fk_howhear` FOREIGN KEY (`howhear`) REFERENCES `howhear` (`id`),
  ADD CONSTRAINT `fk_ministry` FOREIGN KEY (`ministry`) REFERENCES `ministry` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
