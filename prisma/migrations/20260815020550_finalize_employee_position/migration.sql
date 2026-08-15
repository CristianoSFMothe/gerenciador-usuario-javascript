-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_positionId_fkey";

-- DropForeignKey
ALTER TABLE "Position" DROP CONSTRAINT "Position_companyId_fkey";

-- DropIndex
DROP INDEX "Employee_positionId_idx";

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "positionId";

-- Preserve backfilled data: rename instead of drop+add
ALTER TABLE "Employee" RENAME COLUMN "positionTitle" TO "position";
ALTER TABLE "Employee" ALTER COLUMN "position" SET NOT NULL;

-- DropTable
DROP TABLE "Position";
