-- AlterTable
ALTER TABLE "Vote" ADD COLUMN     "parentId" UUID;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Vote"("id") ON DELETE SET NULL ON UPDATE CASCADE;
