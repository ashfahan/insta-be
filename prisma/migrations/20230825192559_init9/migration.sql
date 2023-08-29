/*
  Warnings:

  - You are about to drop the `Messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SharedPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Messages` DROP FOREIGN KEY `Messages_conversationId_fkey`;

-- DropForeignKey
ALTER TABLE `Messages` DROP FOREIGN KEY `Messages_senderId_fkey`;

-- DropForeignKey
ALTER TABLE `SharedPost` DROP FOREIGN KEY `SharedPost_conversationId_fkey`;

-- DropForeignKey
ALTER TABLE `SharedPost` DROP FOREIGN KEY `SharedPost_messageid_fkey`;

-- DropForeignKey
ALTER TABLE `SharedPost` DROP FOREIGN KEY `SharedPost_postId_fkey`;

-- DropTable
DROP TABLE `Messages`;

-- DropTable
DROP TABLE `SharedPost`;

-- CreateTable
CREATE TABLE `Message` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `conversationId` INTEGER NOT NULL,
    `senderId` INTEGER NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `messageType` VARCHAR(191) NULL,
    `mediaUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `Conversation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
