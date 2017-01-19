/* db-structure.sql:
 * This is the structure of the database we used, which is compatible with the current code.
 * You may make modifications, but you will need to update the code used for the tasks accordingly.
 */

-- phpMyAdmin SQL Dump
-- version 4.0.10.10
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jan 10, 2017 at 09:07 PM
-- Server version: 5.5.46
-- PHP Version: 5.6.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `jove`
--

-- --------------------------------------------------------

--
-- Table structure for table `calibration`
--

CREATE TABLE IF NOT EXISTS `calibration` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `sid` varchar(30) NOT NULL,
  `attempt` int(10) unsigned NOT NULL,
  `time` datetime NOT NULL,
  `loctime` datetime DEFAULT NULL,
  `task` varchar(30) NOT NULL,
  `monitorsize` double NOT NULL,
  `pxwidth` int(11) NOT NULL,
  `pxheight` int(11) NOT NULL,
  `pxperdeg` double NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `mot`
--

CREATE TABLE IF NOT EXISTS `mot` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sid` varchar(30) CHARACTER SET latin1 DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  `loctime` datetime DEFAULT NULL,
  `trial` int(11) DEFAULT NULL,
  `trialStart` double DEFAULT NULL,
  `numAttendDots` int(11) DEFAULT NULL,
  `probeTracked` int(11) DEFAULT NULL,
  `response` int(11) DEFAULT NULL,
  `correct` int(11) DEFAULT NULL,
  `rt` double DEFAULT NULL,
  `targetSeed` varchar(25) CHARACTER SET latin1 DEFAULT NULL,
  `trialSeed` varchar(25) CHARACTER SET latin1 DEFAULT NULL,
  `numDrawCalls` int(10) DEFAULT NULL,
  `canvasWidth` int(10) DEFAULT NULL,
  `canvasHeight` int(10) DEFAULT NULL,
  `pxperdeg` double NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `motpractice`
--

CREATE TABLE IF NOT EXISTS `motpractice` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sid` varchar(30) CHARACTER SET latin1 DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  `loctime` datetime DEFAULT NULL,
  `trial` int(11) DEFAULT NULL,
  `trialStart` double DEFAULT NULL,
  `numAttendDots` int(11) DEFAULT NULL,
  `probeTracked` int(11) DEFAULT NULL,
  `response` int(11) DEFAULT NULL,
  `correct` int(11) DEFAULT NULL,
  `rt` double DEFAULT NULL,
  `pxperdeg` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE IF NOT EXISTS `subjects` (
  `sid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `creationTime` datetime DEFAULT NULL,
  `locTime` datetime DEFAULT NULL,
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `ufov`
--

CREATE TABLE IF NOT EXISTS `ufov` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sid` varchar(30) CHARACTER SET latin1 DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  `loctime` datetime DEFAULT NULL,
  `trial` int(11) DEFAULT NULL,
  `trialStart` double DEFAULT NULL,
  `frames` tinyint(4) DEFAULT NULL,
  `duration` double DEFAULT NULL,
  `actualDuration` double DEFAULT NULL,
  `cStim` int(11) DEFAULT NULL,
  `cResp` int(11) DEFAULT NULL,
  `cRT` double DEFAULT NULL,
  `cCorrect` int(11) DEFAULT NULL,
  `pPos` int(11) DEFAULT NULL,
  `pTargetX` int(11) DEFAULT NULL,
  `pTargetY` int(11) DEFAULT NULL,
  `pResp` int(11) DEFAULT NULL,
  `pX` int(11) DEFAULT NULL,
  `pY` int(11) DEFAULT NULL,
  `pRT` double DEFAULT NULL,
  `pCorrect` int(11) DEFAULT NULL,
  `reversals` int(11) DEFAULT NULL,
  `pxperdeg` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `ufovpractice`
--

CREATE TABLE IF NOT EXISTS `ufovpractice` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sid` varchar(30) CHARACTER SET latin1 DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  `loctime` datetime DEFAULT NULL,
  `trial` int(11) DEFAULT NULL,
  `trialStart` double DEFAULT NULL,
  `trialType` int(11) DEFAULT NULL,
  `duration` double DEFAULT NULL,
  `actualDuration` double DEFAULT NULL,
  `cStim` int(11) DEFAULT NULL,
  `cResp` int(11) DEFAULT NULL,
  `cRT` double DEFAULT NULL,
  `cCorrect` int(11) DEFAULT NULL,
  `pPos` int(11) DEFAULT NULL,
  `pTargetX` int(11) DEFAULT NULL,
  `pTargetY` int(11) DEFAULT NULL,
  `pResp` int(11) DEFAULT NULL,
  `pX` int(11) DEFAULT NULL,
  `pY` int(11) DEFAULT NULL,
  `pRT` double DEFAULT NULL,
  `pCorrect` int(11) DEFAULT NULL,
  `pxperdeg` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
