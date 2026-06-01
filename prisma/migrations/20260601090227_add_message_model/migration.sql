/*
  Warnings:

  - You are about to drop the column `isCompleted` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `isTask` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `username` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_userId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "isCompleted",
DROP COLUMN "isTask",
DROP COLUMN "userId",
ADD COLUMN     "username" TEXT NOT NULL;

-- DropTable
DROP TABLE "User";
