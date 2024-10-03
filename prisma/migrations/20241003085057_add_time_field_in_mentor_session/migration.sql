/*
  Warnings:

  - Added the required column `time` to the `mentor_sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `mentor_sessions` ADD COLUMN `time` TIME(0) NOT NULL,
    MODIFY `date` DATE NOT NULL;
