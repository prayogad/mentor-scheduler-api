-- DropForeignKey
ALTER TABLE `mentor_sessions` DROP FOREIGN KEY `mentor_sessions_mentor_id_fkey`;

-- AddForeignKey
ALTER TABLE `mentor_sessions` ADD CONSTRAINT `mentor_sessions_mentor_id_fkey` FOREIGN KEY (`mentor_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
