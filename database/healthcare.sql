SET NAMES utf8mb4;
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 18, 2025 at 02:47 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `healthcare`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `hn_number` varchar(50) DEFAULT NULL,
  `rights` varchar(255) DEFAULT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `reason` text DEFAULT NULL,
  `appointed_by` varchar(255) DEFAULT NULL,
  `contact_location` text DEFAULT NULL,
  `other_details` text DEFAULT NULL,
  `diagnosis` text DEFAULT NULL,
  `status` enum('มาตามนัด','ไม่มาตามนัด','ส่งต่อรักษา','รอนัด') DEFAULT 'รอนัด',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `patient_id`, `hn_number`, `rights`, `appointment_date`, `appointment_time`, `reason`, `appointed_by`, `contact_location`, `other_details`, `diagnosis`, `status`, `created_at`) VALUES
(3, 2, '2', 'บัตรทอง', '2025-06-16', '06:00:00', 'ตรวจวินิจฉัย', 'นพ.คีน', 'โรงพยาบาลศูนย์', '-', 'ป่วย', 'รอนัด', '2025-06-15 14:56:49'),
(4, 2, '3', 'บัตรทอง', '2025-06-17', '07:00:00', 'ตรวจวินิจฉัย', 'นพ.คีน', 'โรงพยาบาลศูนย์', '-', 'ป่วย', 'มาตามนัด', '2025-06-15 15:11:48');

-- --------------------------------------------------------

--
-- Table structure for table `daily_tracking`
--

CREATE TABLE `daily_tracking` (
  `id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `temperature` decimal(4,2) DEFAULT NULL,
  `blood_pressure_systolic` int(11) DEFAULT NULL,
  `blood_pressure_diastolic` int(11) DEFAULT NULL,
  `pulse_rate` int(11) DEFAULT NULL,
  `respiratory_rate` int(11) DEFAULT NULL,
  `blood_sugar` decimal(5,2) DEFAULT NULL,
  `recorded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `daily_tracking`
--

INSERT INTO `daily_tracking` (`id`, `patient_id`, `temperature`, `blood_pressure_systolic`, `blood_pressure_diastolic`, `pulse_rate`, `respiratory_rate`, `blood_sugar`, `recorded_at`) VALUES
(2, 2, 35.00, 123, 321, 2131, 123, 321.00, '2025-06-15 05:53:00'),
(6, 2, 36.70, 119, 78, 73, 18, 94.00, '2025-06-10 01:00:00'),
(7, 2, 36.90, 122, 79, 75, 18, 97.00, '2025-06-11 01:00:00'),
(8, 2, 37.10, 124, 82, 76, 19, 100.00, '2025-06-12 01:00:00'),
(11, 2, 35.00, 120, 120, 120, 120, 123.00, '2025-06-17 19:36:00'),
(12, 2, 35.00, 123, 123, 321, 321, 321.00, '2025-06-17 19:44:00'),
(13, 2, 40.00, 123, 312, 123, 213, 213.00, '2025-06-17 19:45:00');

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `age` int(11) NOT NULL,
  `gender` enum('ชาย','หญิง','อื่นๆ') NOT NULL,
  `race` varchar(100) NOT NULL,
  `nationality` varchar(100) NOT NULL,
  `occupation` varchar(100) NOT NULL,
  `illness_info` text DEFAULT NULL,
  `province` varchar(100) NOT NULL,
  `district` varchar(100) NOT NULL,
  `subdistrict` varchar(100) DEFAULT NULL,
  `address_detail` text DEFAULT NULL,
  `latitude` decimal(10,6) NOT NULL,
  `longitude` decimal(10,6) NOT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `community_health_worker` varchar(255) DEFAULT NULL COMMENT 'ชื่ออสม.ที่รับผิดชอบผู้ป่วย'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`id`, `name`, `age`, `gender`, `race`, `nationality`, `occupation`, `illness_info`, `province`, `district`, `subdistrict`, `address_detail`, `latitude`, `longitude`, `image_path`, `created_at`, `community_health_worker`) VALUES
(1, 'พันธกานต์ พุทธนัน', 21, 'ชาย', 'ไทย', 'ไทย', 'Fullstack Developer', 'เป็นคนหล่อในหัวใจเธอ', 'เชียงราย', 'เมืองเชียงราย', 'ท่าสุด  ', 'มหาวิทยาลัยแม่ฟ้าหลวง', 20.044643, 99.892154, 'uploads\\patients\\patient-1750213757335-125331830.jpg', '2025-06-15 08:57:59', ''),
(2, 'Phanthakan Phutthanan', 20, 'ชาย', 'England', 'England', 'Dev', 'Sick', 'เชียงราย', 'แม่สาย', 'เกาะช้าง', '', 20.415396, 99.990453, 'uploads\\patients\\patient-1750209077850-844279211.jpg', '2025-06-15 09:46:01', '');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `citizen_id` varchar(13) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `address` varchar(255) NOT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `citizen_id`, `first_name`, `last_name`, `phone`, `email`, `password`, `created_at`, `address`, `latitude`, `longitude`, `role`) VALUES
(6, '1579901083773', 'พิมลภัส', 'พุทธนัน', '0646630695', 'keenxiix@gmail.com', '$2b$10$jN1lzeQLwAKIn.Tu5gWvE.NzmwSA2vu9G7Rt1HavW3DNqmIMKh/cu', '2025-06-14 07:41:18', '652(หอพักพนิดา2) หมู่1 บ้านห้วยพลู ท่าสุด อำเภอเมือง เชียงราย', 13.7367170, 100.5231860, 'user'),
(7, '1579901083774', 'พันธกานต์', 'พุทธนัน', '0646630695', 'phanthakanzzz123@gmail.com', '$2b$10$U81P3ctMyeVIdkslgGU/n.ktjlWYF5zmtDZ5zvNmC9A9PWA4tqfzi', '2025-06-15 04:59:46', '652(หอพักพนิดา2) หมู่1 บ้านห้วยพลู ท่าสุด อำเภอเมือง เชียงราย', 20.0480570, 99.8747520, 'user'),
(8, '1579901083775', 'Sasikarn', 'Pansawanad', '0646630695', '6531501160@gmail.com', '$2b$10$OOofqj215L59hB26npxLDumu6wX5aPa8yDisWdhHrSLoP2B0EN9hC', '2025-06-15 05:02:06', '652(หอพักพนิดา2) หมู่1 บ้านห้วยพลู ท่าสุด อำเภอเมือง เชียงราย', 20.0512350, 99.8714520, 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`);

--
-- Indexes for table `daily_tracking`
--
ALTER TABLE `daily_tracking`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `citizen_id` (`citizen_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `daily_tracking`
--
ALTER TABLE `daily_tracking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `patients`
--
ALTER TABLE `patients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `daily_tracking`
--
ALTER TABLE `daily_tracking`
  ADD CONSTRAINT `daily_tracking_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */; 