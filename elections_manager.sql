-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 18, 2023 at 11:38 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `elections_manager`
--

-- --------------------------------------------------------

--
-- Table structure for table `candidates`
--

CREATE TABLE `candidates` (
  `candidate_id` int(11) NOT NULL,
  `election_id` int(11) NOT NULL,
  `candidate_fullname` varchar(255) NOT NULL,
  `candidate_bio` text NOT NULL,
  `candidate_avatar` varchar(255) NOT NULL,
  `candidate_created_at` varchar(255) NOT NULL,
  `candidate_status` enum('Active','Inactive') NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `candidates`
--

INSERT INTO `candidates` (`candidate_id`, `election_id`, `candidate_fullname`, `candidate_bio`, `candidate_avatar`, `candidate_created_at`, `candidate_status`) VALUES
(1, 2, 'Spider Man', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vestibulum lorem sed risus ultricies tristique nulla aliquet enim. Facilisi etiam dignissim diam quis enim lobortis scelerisque. Dignissim diam quis enim lobortis scelerisque. Turpis egestas pretium aenean pharetra magna ac placerat vestibulum lectus. In nibh mauris cursus mattis molestie. Rutrum quisque non tellus orci ac auctor augue mauris augue. Id volutpat lacus laoreet non curabitur gravida arcu ac. Neque aliquam vestibulum morbi blandit cursus. Cursus sit amet dictum sit amet justo donec. Eu facilisis sed odio morbi quis commodo. Facilisi cras fermentum odio eu feugiat pretium. Non nisi est sit amet.  Faucibus pulvinar elementum integer enim neque volutpat. Tincidunt praesent semper feugiat nibh sed pulvinar proin. Ridiculus mus mauris vitae ultricies leo integer. Cursus risus at ultrices mi tempus imperdiet. Morbi tempus iaculis urna id volutpat lacus. Semper eget duis at tellus at. Malesuada fames ac turpis egestas. Integer quis auctor elit sed vulputate mi sit. Scelerisque viverra mauris in aliquam. Elit sed vulputate mi sit amet mauris. Risus nec feugiat in fermentum posuere. Dignissim enim sit amet venenatis urna cursus eget nunc. Eu turpis egestas pretium aenean. Egestas sed sed risus pretium quam vulputate dignissim.  Amet mauris commodo quis imperdiet massa tincidunt. Ut placerat orci nulla pellentesque dignissim enim sit amet venenatis. Est ultricies integer quis auctor elit sed. Elementum pulvinar etiam non quam lacus suspendisse. At tellus at urna condimentum mattis pellentesque id. Varius quam quisque id diam vel quam. Gravida quis blandit turpis cursus in hac habitasse. Sociis natoque penatibus et magnis. Fames ac turpis egestas integer eget aliquet nibh praesent tristique. Non enim praesent elementum facilisis leo vel fringilla est ullamcorper. Amet nulla facilisi morbi tempus iaculis. Est placerat in egestas erat imperdiet sed euismod. Magna fermentum iaculis eu non diam phasellus vestibulum lorem sed. Massa id neque aliquam vestibulum morbi blandit cursus. Quis viverra nibh cras pulvinar mattis nunc sed.  Posuere morbi leo urna molestie at elementum eu. Nisl condimentum id venenatis a condimentum vitae sapien pellentesque. Viverra accumsan in nisl nisi scelerisque. Facilisis sed odio morbi quis. Lectus sit amet est placerat in egestas. Risus pretium quam vulputate dignissim suspendisse in est. Quam viverra orci sagittis eu volutpat odio facilisis mauris sit. Quis eleifend quam adipiscing vitae proin sagittis nisl rhoncus mattis. Nullam ac tortor vitae purus faucibus ornare. Consequat ac felis donec et odio pellentesque diam. Aliquam ut porttitor leo a diam. Turpis massa tincidunt dui ut ornare lectus sit amet est. Pulvinar elementum integer enim neque volutpat ac. Risus ultricies tristique nulla aliquet enim tortor at auctor. Velit ut tortor pretium viverra suspendisse potenti nullam ac. Velit laoreet id donec ultrices tincidunt arcu non sodales. Interdum consectetur libero id faucibus nisl tincidunt. Nulla pharetra diam sit amet nisl. Enim sed faucibus turpis in.  Bibendum est ultricies integer quis auctor elit sed vulputate mi. Interdum velit euismod in pellentesque massa. Libero volutpat sed cras ornare arcu dui vivamus arcu felis. Euismod quis viverra nibh cras pulvinar mattis. Rhoncus aenean vel elit scelerisque mauris pellentesque. Pulvinar proin gravida hendrerit lectus a. Enim tortor at auctor urna nunc id cursus metus. Massa placerat duis ultricies lacus sed. Viverra vitae congue eu consequat ac. Purus viverra accumsan in nisl. Non enim praesent elementum facilisis.', 'a95c2e20-89a5-4cdb-a6b9-827b3412a25f.jpg', '1696252145', 'Active'),
(2, 2, 'Jonas Kemas', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vestibulum lorem sed risus ultricies tristique nulla aliquet enim. Facilisi etiam dignissim diam quis enim lobortis scelerisque. Dignissim diam quis enim lobortis scelerisque. Turpis egestas pretium aenean pharetra magna ac placerat vestibulum lectus. In nibh mauris cursus mattis molestie. Rutrum quisque non tellus orci ac auctor augue mauris augue. Id volutpat lacus laoreet non curabitur gravida arcu ac. Neque aliquam vestibulum morbi blandit cursus. Cursus sit amet dictum sit amet justo donec. Eu facilisis sed odio morbi quis commodo. Facilisi cras fermentum odio eu feugiat pretium. Non nisi est sit amet.  Faucibus pulvinar elementum integer enim neque volutpat. Tincidunt praesent semper feugiat nibh sed pulvinar proin. Ridiculus mus mauris vitae ultricies leo integer. Cursus risus at ultrices mi tempus imperdiet. Morbi tempus iaculis urna id volutpat lacus. Semper eget duis at tellus at. Malesuada fames ac turpis egestas. Integer quis auctor elit sed vulputate mi sit. Scelerisque viverra mauris in aliquam. Elit sed vulputate mi sit amet mauris. Risus nec feugiat in fermentum posuere. Dignissim enim sit amet venenatis urna cursus eget nunc. Eu turpis egestas pretium aenean. Egestas sed sed risus pretium quam vulputate dignissim.  Amet mauris commodo quis imperdiet massa tincidunt. Ut placerat orci nulla pellentesque dignissim enim sit amet venenatis. Est ultricies integer quis auctor elit sed. Elementum pulvinar etiam non quam lacus suspendisse. At tellus at urna condimentum mattis pellentesque id. Varius quam quisque id diam vel quam. Gravida quis blandit turpis cursus in hac habitasse. Sociis natoque penatibus et magnis. Fames ac turpis egestas integer eget aliquet nibh praesent tristique. Non enim praesent elementum facilisis leo vel fringilla est ullamcorper. Amet nulla facilisi morbi tempus iaculis. Est placerat in egestas erat imperdiet sed euismod. Magna fermentum iaculis eu non diam phasellus vestibulum lorem sed. Massa id neque aliquam vestibulum morbi blandit cursus. Quis viverra nibh cras pulvinar mattis nunc sed.  Posuere morbi leo urna molestie at elementum eu. Nisl condimentum id venenatis a condimentum vitae sapien pellentesque. Viverra accumsan in nisl nisi scelerisque. Facilisis sed odio morbi quis. Lectus sit amet est placerat in egestas. Risus pretium quam vulputate dignissim suspendisse in est. Quam viverra orci sagittis eu volutpat odio facilisis mauris sit. Quis eleifend quam adipiscing vitae proin sagittis nisl rhoncus mattis. Nullam ac tortor vitae purus faucibus ornare. Consequat ac felis donec et odio pellentesque diam. Aliquam ut porttitor leo a diam. Turpis massa tincidunt dui ut ornare lectus sit amet est. Pulvinar elementum integer enim neque volutpat ac. Risus ultricies tristique nulla aliquet enim tortor at auctor. Velit ut tortor pretium viverra suspendisse potenti nullam ac. Velit laoreet id donec ultrices tincidunt arcu non sodales. Interdum consectetur libero id faucibus nisl tincidunt. Nulla pharetra diam sit amet nisl. Enim sed faucibus turpis in.  Bibendum est ultricies integer quis auctor elit sed vulputate mi. Interdum velit euismod in pellentesque massa. Libero volutpat sed cras ornare arcu dui vivamus arcu felis. Euismod quis viverra nibh cras pulvinar mattis. Rhoncus aenean vel elit scelerisque mauris pellentesque. Pulvinar proin gravida hendrerit lectus a. Enim tortor at auctor urna nunc id cursus metus. Massa placerat duis ultricies lacus sed. Viverra vitae congue eu consequat ac. Purus viverra accumsan in nisl. Non enim praesent elementum facilisis.', '07691b86-6c1f-436e-b093-56def09aea10.jpg', '1696252190', 'Active'),
(3, 2, 'Alicia Keys', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vestibulum lorem sed risus ultricies tristique nulla aliquet enim. Facilisi etiam dignissim diam quis enim lobortis scelerisque. Dignissim diam quis enim lobortis scelerisque. Turpis egestas pretium aenean pharetra magna ac placerat vestibulum lectus. In nibh mauris cursus mattis molestie. Rutrum quisque non tellus orci ac auctor augue mauris augue. Id volutpat lacus laoreet non curabitur gravida arcu ac. Neque aliquam vestibulum morbi blandit cursus. Cursus sit amet dictum sit amet justo donec. Eu facilisis sed odio morbi quis commodo. Facilisi cras fermentum odio eu feugiat pretium. Non nisi est sit amet.  Faucibus pulvinar elementum integer enim neque volutpat. Tincidunt praesent semper feugiat nibh sed pulvinar proin. Ridiculus mus mauris vitae ultricies leo integer. Cursus risus at ultrices mi tempus imperdiet. Morbi tempus iaculis urna id volutpat lacus. Semper eget duis at tellus at. Malesuada fames ac turpis egestas. Integer quis auctor elit sed vulputate mi sit. Scelerisque viverra mauris in aliquam. Elit sed vulputate mi sit amet mauris. Risus nec feugiat in fermentum posuere. Dignissim enim sit amet venenatis urna cursus eget nunc. Eu turpis egestas pretium aenean. Egestas sed sed risus pretium quam vulputate dignissim.  Amet mauris commodo quis imperdiet massa tincidunt. Ut placerat orci nulla pellentesque dignissim enim sit amet venenatis. Est ultricies integer quis auctor elit sed. Elementum pulvinar etiam non quam lacus suspendisse. At tellus at urna condimentum mattis pellentesque id. Varius quam quisque id diam vel quam. Gravida quis blandit turpis cursus in hac habitasse. Sociis natoque penatibus et magnis. Fames ac turpis egestas integer eget aliquet nibh praesent tristique. Non enim praesent elementum facilisis leo vel fringilla est ullamcorper. Amet nulla facilisi morbi tempus iaculis. Est placerat in egestas erat imperdiet sed euismod. Magna fermentum iaculis eu non diam phasellus vestibulum lorem sed. Massa id neque aliquam vestibulum morbi blandit cursus. Quis viverra nibh cras pulvinar mattis nunc sed.  Posuere morbi leo urna molestie at elementum eu. Nisl condimentum id venenatis a condimentum vitae sapien pellentesque. Viverra accumsan in nisl nisi scelerisque. Facilisis sed odio morbi quis. Lectus sit amet est placerat in egestas. Risus pretium quam vulputate dignissim suspendisse in est. Quam viverra orci sagittis eu volutpat odio facilisis mauris sit. Quis eleifend quam adipiscing vitae proin sagittis nisl rhoncus mattis. Nullam ac tortor vitae purus faucibus ornare. Consequat ac felis donec et odio pellentesque diam. Aliquam ut porttitor leo a diam. Turpis massa tincidunt dui ut ornare lectus sit amet est. Pulvinar elementum integer enim neque volutpat ac. Risus ultricies tristique nulla aliquet enim tortor at auctor. Velit ut tortor pretium viverra suspendisse potenti nullam ac. Velit laoreet id donec ultrices tincidunt arcu non sodales. Interdum consectetur libero id faucibus nisl tincidunt. Nulla pharetra diam sit amet nisl. Enim sed faucibus turpis in.  Bibendum est ultricies integer quis auctor elit sed vulputate mi. Interdum velit euismod in pellentesque massa. Libero volutpat sed cras ornare arcu dui vivamus arcu felis. Euismod quis viverra nibh cras pulvinar mattis. Rhoncus aenean vel elit scelerisque mauris pellentesque. Pulvinar proin gravida hendrerit lectus a. Enim tortor at auctor urna nunc id cursus metus. Massa placerat duis ultricies lacus sed. Viverra vitae congue eu consequat ac. Purus viverra accumsan in nisl. Non enim praesent elementum facilisis.', '097c5c9f-4694-4038-9fd8-5e52aa05da24.jpg', '1696252248', 'Active'),
(4, 2, 'Jonas Kemas', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vestibulum lorem sed risus ultricies tristique nulla aliquet enim. Facilisi etiam dignissim diam quis enim lobortis scelerisque. Dignissim diam quis enim lobortis scelerisque. Turpis egestas pretium aenean pharetra magna ac placerat vestibulum lectus. In nibh mauris cursus mattis molestie. Rutrum quisque non tellus orci ac auctor augue mauris augue. Id volutpat lacus laoreet non curabitur gravida arcu ac. Neque aliquam vestibulum morbi blandit cursus. Cursus sit amet dictum sit amet justo donec. Eu facilisis sed odio morbi quis commodo. Facilisi cras fermentum odio eu feugiat pretium. Non nisi est sit amet.  Faucibus pulvinar elementum integer enim neque volutpat. Tincidunt praesent semper feugiat nibh sed pulvinar proin. Ridiculus mus mauris vitae ultricies leo integer. Cursus risus at ultrices mi tempus imperdiet. Morbi tempus iaculis urna id volutpat lacus. Semper eget duis at tellus at. Malesuada fames ac turpis egestas. Integer quis auctor elit sed vulputate mi sit. Scelerisque viverra mauris in aliquam. Elit sed vulputate mi sit amet mauris. Risus nec feugiat in fermentum posuere. Dignissim enim sit amet venenatis urna cursus eget nunc. Eu turpis egestas pretium aenean. Egestas sed sed risus pretium quam vulputate dignissim.  Amet mauris commodo quis imperdiet massa tincidunt. Ut placerat orci nulla pellentesque dignissim enim sit amet venenatis. Est ultricies integer quis auctor elit sed. Elementum pulvinar etiam non quam lacus suspendisse. At tellus at urna condimentum mattis pellentesque id. Varius quam quisque id diam vel quam. Gravida quis blandit turpis cursus in hac habitasse. Sociis natoque penatibus et magnis. Fames ac turpis egestas integer eget aliquet nibh praesent tristique. Non enim praesent elementum facilisis leo vel fringilla est ullamcorper. Amet nulla facilisi morbi tempus iaculis. Est placerat in egestas erat imperdiet sed euismod. Magna fermentum iaculis eu non diam phasellus vestibulum lorem sed. Massa id neque aliquam vestibulum morbi blandit cursus. Quis viverra nibh cras pulvinar mattis nunc sed.  Posuere morbi leo urna molestie at elementum eu. Nisl condimentum id venenatis a condimentum vitae sapien pellentesque. Viverra accumsan in nisl nisi scelerisque. Facilisis sed odio morbi quis. Lectus sit amet est placerat in egestas. Risus pretium quam vulputate dignissim suspendisse in est. Quam viverra orci sagittis eu volutpat odio facilisis mauris sit. Quis eleifend quam adipiscing vitae proin sagittis nisl rhoncus mattis. Nullam ac tortor vitae purus faucibus ornare. Consequat ac felis donec et odio pellentesque diam. Aliquam ut porttitor leo a diam. Turpis massa tincidunt dui ut ornare lectus sit amet est. Pulvinar elementum integer enim neque volutpat ac. Risus ultricies tristique nulla aliquet enim tortor at auctor. Velit ut tortor pretium viverra suspendisse potenti nullam ac. Velit laoreet id donec ultrices tincidunt arcu non sodales. Interdum consectetur libero id faucibus nisl tincidunt. Nulla pharetra diam sit amet nisl. Enim sed faucibus turpis in.  Bibendum est ultricies integer quis auctor elit sed vulputate mi. Interdum velit euismod in pellentesque massa. Libero volutpat sed cras ornare arcu dui vivamus arcu felis. Euismod quis viverra nibh cras pulvinar mattis. Rhoncus aenean vel elit scelerisque mauris pellentesque. Pulvinar proin gravida hendrerit lectus a. Enim tortor at auctor urna nunc id cursus metus. Massa placerat duis ultricies lacus sed. Viverra vitae congue eu consequat ac. Purus viverra accumsan in nisl. Non enim praesent elementum facilisis.', '395495be-0e88-476e-8834-744588cc75e4.jpg', '1696252333', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `elections`
--

CREATE TABLE `elections` (
  `election_id` int(11) NOT NULL,
  `election_title` varchar(255) NOT NULL,
  `election_slug` varchar(255) NOT NULL,
  `election_created_at` varchar(255) NOT NULL,
  `election_status` enum('Active','Inactive') NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `elections`
--

INSERT INTO `elections` (`election_id`, `election_title`, `election_slug`, `election_created_at`, `election_status`) VALUES
(2, 'SUG', 'sug', '1696251155', 'Active'),
(3, 'Staff Of The Month', 'staff-of-the-month', '1697622010', 'Active'),
(4, 'Staff Of The Year', 'staff-of-the-year', '1697622076', 'Active'),
(5, 'Lodge President', 'lodge-president', '1697628780', 'Active'),
(6, 'Best Dressed', 'best-dressed', '1697632439', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(1) NOT NULL,
  `user_firstname` varchar(255) NOT NULL,
  `user_lastname` varchar(255) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `user_ssn` varchar(255) NOT NULL,
  `enc_password` varchar(255) NOT NULL,
  `plain_password` varchar(255) NOT NULL,
  `user_role` enum('Voter','Admin') NOT NULL DEFAULT 'Voter',
  `user_created_at` varchar(255) NOT NULL,
  `last_logged_in` varchar(255) NOT NULL,
  `user_status` enum('Active','Inactive') NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_firstname`, `user_lastname`, `user_email`, `user_ssn`, `enc_password`, `plain_password`, `user_role`, `user_created_at`, `last_logged_in`, `user_status`) VALUES
(1, 'Jon', 'Snow', 'jonsnow@example.com', '27382-283748-74647', 'U2FsdGVkX1/wQVh80I4774cf5b69rVLRMJhgZ0qoiLY=', 'strongpass', 'Admin', '1696238351', '1697663704', 'Active'),
(2, 'Tony', 'Jaa', 'tonyjaa@example.com', '2732-288-74647', 'U2FsdGVkX1/PSD1rqW/+5mGP2joQUkuWwqBqJk2y9Eo=', 'strongpass', 'Voter', '1696261677', '1696261694', 'Active'),
(3, 'Beyonce', 'Knowles', 'beyounceknowles@example.com', '27382-283748-72647', 'U2FsdGVkX1+W1BYasgR3vqc04L0243EO2UEuobz27gk=', 'strongpass', 'Voter', '1696263884', '1696263902', 'Active'),
(4, 'Mel', 'Gibson', 'melgibson@example.com', '87892-897892-8980', 'U2FsdGVkX1/kKSSTojKQw5vgeC4llKY8lgRJ5R7gzt8=', 'strongpass', 'Voter', '1697663524', '', 'Active'),
(5, 'Arnorl', 'Swazneggar', 'arnold@example.com', '84748-2828224-24824', 'U2FsdGVkX19v0JlmiIoMfOChqXKi4GkNKQ0TE7DGJ5w=', 'strongpass', 'Voter', '1697663613', '', 'Active'),
(6, 'Michael', 'Carrick', 'michaelcarrick@example.com', '8989-2829-293', 'U2FsdGVkX1/yomujDdV8Gvtm1Qms9L7OAAm2F4BhfrY=', 'strongpass', 'Voter', '1697663699', '', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `votes`
--

CREATE TABLE `votes` (
  `vote_id` int(11) NOT NULL,
  `election_id` int(11) NOT NULL,
  `voter_id` int(11) NOT NULL,
  `candidate_id` int(11) NOT NULL,
  `ip_address` varchar(255) NOT NULL,
  `user_agent` varchar(255) NOT NULL,
  `vote_timestamp` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `votes`
--

INSERT INTO `votes` (`vote_id`, `election_id`, `voter_id`, `candidate_id`, `ip_address`, `user_agent`, `vote_timestamp`) VALUES
(1, 2, 1, 2, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 Edg/117.0.2045.43', '1696261597'),
(2, 2, 2, 2, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 Edg/117.0.2045.43', '1696261713'),
(3, 2, 3, 4, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 Edg/117.0.2045.43', '1696263951');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `candidates`
--
ALTER TABLE `candidates`
  ADD PRIMARY KEY (`candidate_id`),
  ADD KEY `election_id` (`election_id`);

--
-- Indexes for table `elections`
--
ALTER TABLE `elections`
  ADD PRIMARY KEY (`election_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `votes`
--
ALTER TABLE `votes`
  ADD PRIMARY KEY (`vote_id`),
  ADD KEY `voter_id` (`voter_id`),
  ADD KEY `candidate_id` (`candidate_id`),
  ADD KEY `election_id` (`election_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `candidates`
--
ALTER TABLE `candidates`
  MODIFY `candidate_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `elections`
--
ALTER TABLE `elections`
  MODIFY `election_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(1) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `votes`
--
ALTER TABLE `votes`
  MODIFY `vote_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `candidates`
--
ALTER TABLE `candidates`
  ADD CONSTRAINT `candidates_ibfk_1` FOREIGN KEY (`election_id`) REFERENCES `elections` (`election_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `votes`
--
ALTER TABLE `votes`
  ADD CONSTRAINT `votes_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`candidate_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `votes_ibfk_2` FOREIGN KEY (`election_id`) REFERENCES `elections` (`election_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `votes_ibfk_3` FOREIGN KEY (`voter_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
