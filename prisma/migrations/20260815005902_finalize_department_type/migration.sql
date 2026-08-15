-- DropForeignKey
ALTER TABLE "Department" DROP CONSTRAINT "Department_departmentTypeId_fkey";

-- DropIndex
DROP INDEX "Department_companyId_name_key";

-- AlterTable
ALTER TABLE "Department" DROP COLUMN "name",
ALTER COLUMN "departmentTypeId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Department_companyId_departmentTypeId_key" ON "Department"("companyId", "departmentTypeId");

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_departmentTypeId_fkey" FOREIGN KEY ("departmentTypeId") REFERENCES "DepartmentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

