-- AlterTable
ALTER TABLE `mentor_profiles` ADD COLUMN `picture_url` TEXT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `token` VARCHAR(255) NULL;
