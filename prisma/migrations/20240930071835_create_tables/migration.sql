-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `token` VARCHAR(100) NULL,
    `role` ENUM('STUDENT', 'MENTOR') NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mentor_profiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mentor_id` INTEGER NOT NULL,
    `bio` TEXT NOT NULL,
    `field` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `mentor_profiles_mentor_id_key`(`mentor_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mentor_sessions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(0) NOT NULL,
    `quota` INTEGER NOT NULL,
    `mentor_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `booked_sessions` (
    `session_id` INTEGER NOT NULL,
    `student_id` INTEGER NOT NULL,
    `booked_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`session_id`, `student_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `mentor_profiles` ADD CONSTRAINT `mentor_profiles_mentor_id_fkey` FOREIGN KEY (`mentor_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mentor_sessions` ADD CONSTRAINT `mentor_sessions_mentor_id_fkey` FOREIGN KEY (`mentor_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booked_sessions` ADD CONSTRAINT `booked_sessions_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booked_sessions` ADD CONSTRAINT `booked_sessions_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `mentor_sessions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
