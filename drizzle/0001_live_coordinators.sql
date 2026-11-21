ALTER TABLE `users`
  MODIFY COLUMN `role` enum('user','coordinator','admin') NOT NULL DEFAULT 'user',
  ADD COLUMN IF NOT EXISTS `partnerVerified` boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS `partnerRegions` varchar(255) NULL;

CREATE TABLE IF NOT EXISTS `liveEnquiries` (
  `id` int AUTO_INCREMENT NOT NULL,
  `requesterName` varchar(160) NOT NULL,
  `locality` varchar(160) NOT NULL,
  `phone` varchar(40) NOT NULL,
  `email` varchar(320) NOT NULL,
  `urgency` varchar(80) NOT NULL,
  `preferred` enum('Phone','Email','Either') NOT NULL DEFAULT 'Either',
  `context` text NOT NULL,
  `region` enum('Mumbai','Thane') NOT NULL,
  `status` enum('new','reviewing','referred','closed') NOT NULL DEFAULT 'new',
  `assignedTo` int NULL,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `liveEnquiries_id` PRIMARY KEY(`id`)
);
