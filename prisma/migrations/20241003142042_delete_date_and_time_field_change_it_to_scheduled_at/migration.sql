/*
  Warnings:

  - You are about to drop the column `date` on the `mentor_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `mentor_sessions` table. All the data in the column will be lost.
  - Added the required column `scheduledAt` to the `mentor_sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `mentor_sessions` DROP COLUMN `date`,
    DROP COLUMN `time`,
    ADD COLUMN `scheduledAt` DATETIME(0) NOT NULL;
