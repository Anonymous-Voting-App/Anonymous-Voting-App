/*
  Warnings:

  - You are about to drop the column `typeId` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the `Type` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_typeId_fkey";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "typeId";

-- DropTable
DROP TABLE "Type";
