/*
  Warnings:

  - Added the required column `pollId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vote" ADD COLUMN     "pollId" UUID NOT NULL;
