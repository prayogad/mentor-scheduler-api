-- DropForeignKey
ALTER TABLE `booked_sessions` DROP FOREIGN KEY `booked_sessions_session_id_fkey`;

-- DropForeignKey
ALTER TABLE `booked_sessions` DROP FOREIGN KEY `booked_sessions_student_id_fkey`;

-- DropForeignKey
ALTER TABLE `mentor_sessions` DROP FOREIGN KEY `mentor_sessions_mentor_id_fkey`;

-- AddForeignKey
ALTER TABLE `mentor_sessions` ADD CONSTRAINT `mentor_sessions_mentor_id_fkey` FOREIGN KEY (`mentor_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booked_sessions` ADD CONSTRAINT `booked_sessions_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booked_sessions` ADD CONSTRAINT `booked_sessions_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `mentor_sessions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;