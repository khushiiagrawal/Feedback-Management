/*
  Warnings:

  - You are about to drop the column `department` on the `Faculty` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Faculty` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Faculty` table. All the data in the column will be lost.
  - You are about to drop the column `clarity` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `communication` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `interaction` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `methodology` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `overallRating` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `punctuality` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `subjectKnowledge` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `teachingQuality` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `usn` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the `HOD` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sentiment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `subject` to the `Faculty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `Feedback` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Faculty` DROP FOREIGN KEY `Faculty_userId_fkey`;

-- DropForeignKey
ALTER TABLE `HOD` DROP FOREIGN KEY `HOD_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Sentiment` DROP FOREIGN KEY `Sentiment_feedbackId_fkey`;

-- DropForeignKey
ALTER TABLE `Student` DROP FOREIGN KEY `Student_userId_fkey`;

-- DropIndex
DROP INDEX `Faculty_email_key` ON `Faculty`;

-- DropIndex
DROP INDEX `Faculty_userId_key` ON `Faculty`;

-- DropIndex
DROP INDEX `Student_userId_key` ON `Student`;

-- DropIndex
DROP INDEX `Student_usn_key` ON `Student`;

-- AlterTable
ALTER TABLE `Faculty` DROP COLUMN `department`,
    DROP COLUMN `email`,
    DROP COLUMN `userId`,
    ADD COLUMN `subject` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Feedback` DROP COLUMN `clarity`,
    DROP COLUMN `communication`,
    DROP COLUMN `interaction`,
    DROP COLUMN `methodology`,
    DROP COLUMN `overallRating`,
    DROP COLUMN `punctuality`,
    DROP COLUMN `subjectKnowledge`,
    DROP COLUMN `teachingQuality`,
    ADD COLUMN `rating` TINYINT NOT NULL;

-- AlterTable
ALTER TABLE `Student` DROP COLUMN `userId`,
    DROP COLUMN `usn`;

-- DropTable
DROP TABLE `HOD`;

-- DropTable
DROP TABLE `Sentiment`;

-- DropTable
DROP TABLE `User`;
