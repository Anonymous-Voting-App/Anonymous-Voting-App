-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "maxValue" DOUBLE PRECISION,
ADD COLUMN     "minValue" DOUBLE PRECISION,
ADD COLUMN     "parentId" UUID,
ADD COLUMN     "step" DOUBLE PRECISION,
ADD COLUMN     "typeName" TEXT NOT NULL DEFAULT 'free';

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;
