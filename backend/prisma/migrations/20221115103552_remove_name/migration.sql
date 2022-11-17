/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ALTER COLUMN "firstname" DROP DEFAULT,
ALTER COLUMN "lastname" DROP DEFAULT,
ALTER COLUMN "username" DROP DEFAULT;
