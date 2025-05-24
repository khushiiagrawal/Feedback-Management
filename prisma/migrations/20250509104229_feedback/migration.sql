/*
  Warnings:

  - You are about to drop the column `subject` on the `Faculty` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Feedback` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Faculty` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Faculty` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[usn]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `department` to the `Faculty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Faculty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Faculty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clarity` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `communication` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interaction` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `methodology` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `overallRating` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `punctuality` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectKnowledge` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teachingQuality` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usn` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Faculty` DROP COLUMN `subject`,
    ADD COLUMN `department` VARCHAR(191) NOT NULL,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Feedback` DROP COLUMN `rating`,
    ADD COLUMN `clarity` ENUM('POOR', 'FAIR', 'GOOD', 'VERY_GOOD', 'EXCELLENT') NOT NULL,
    ADD COLUMN `communication` ENUM('POOR', 'FAIR', 'GOOD', 'VERY_GOOD', 'EXCELLENT') NOT NULL,
    ADD COLUMN `interaction` ENUM('POOR', 'FAIR', 'GOOD', 'VERY_GOOD', 'EXCELLENT') NOT NULL,
    ADD COLUMN `methodology` ENUM('POOR', 'FAIR', 'GOOD', 'VERY_GOOD', 'EXCELLENT') NOT NULL,
    ADD COLUMN `overallRating` ENUM('POOR', 'FAIR', 'GOOD', 'VERY_GOOD', 'EXCELLENT') NOT NULL,
    ADD COLUMN `punctuality` ENUM('POOR', 'FAIR', 'GOOD', 'VERY_GOOD', 'EXCELLENT') NOT NULL,
    ADD COLUMN `subjectKnowledge` ENUM('POOR', 'FAIR', 'GOOD', 'VERY_GOOD', 'EXCELLENT') NOT NULL,
    ADD COLUMN `teachingQuality` ENUM('POOR', 'FAIR', 'GOOD', 'VERY_GOOD', 'EXCELLENT') NOT NULL;

-- AlterTable
ALTER TABLE `Student` ADD COLUMN `userId` INTEGER NOT NULL,
    ADD COLUMN `usn` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('STUDENT', 'FACULTY', 'HOD') NOT NULL DEFAULT 'STUDENT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HOD` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `HOD_email_key`(`email`),
    UNIQUE INDEX `HOD_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sentiment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `feedbackId` INTEGER NOT NULL,
    `score` DOUBLE NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Sentiment_feedbackId_key`(`feedbackId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Faculty_email_key` ON `Faculty`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `Faculty_userId_key` ON `Faculty`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `Student_usn_key` ON `Student`(`usn`);

-- CreateIndex
CREATE UNIQUE INDEX `Student_userId_key` ON `Student`(`userId`);

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Faculty` ADD CONSTRAINT `Faculty_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HOD` ADD CONSTRAINT `HOD_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sentiment` ADD CONSTRAINT `Sentiment_feedbackId_fkey` FOREIGN KEY (`feedbackId`) REFERENCES `Feedback`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `Feedback` RENAME INDEX `Feedback_facultyId_fkey` TO `Feedback_facultyId_idx`;

-- RenameIndex
ALTER TABLE `Feedback` RENAME INDEX `Feedback_studentId_fkey` TO `Feedback_studentId_idx`;
