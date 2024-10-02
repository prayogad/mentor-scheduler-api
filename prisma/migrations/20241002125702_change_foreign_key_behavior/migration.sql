-- DropForeignKey
ALTER TABLE `mentor_profiles` DROP FOREIGN KEY `mentor_profiles_mentor_id_fkey`;

-- DropForeignKey
ALTER TABLE `mentor_sessions` DROP FOREIGN KEY `mentor_sessions_mentor_id_fkey`;

-- AddForeignKey
ALTER TABLE `mentor_profiles` ADD CONSTRAINT `mentor_profiles_mentor_id_fkey` FOREIGN KEY (`mentor_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mentor_sessions` ADD CONSTRAINT `mentor_sessions_mentor_id_fkey` FOREIGN KEY (`mentor_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
