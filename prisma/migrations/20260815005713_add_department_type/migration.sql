-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "departmentTypeId" TEXT,
ALTER COLUMN "name" DROP NOT NULL;

-- CreateTable
CREATE TABLE "DepartmentType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DepartmentType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DepartmentType_name_key" ON "DepartmentType"("name");

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_departmentTypeId_fkey" FOREIGN KEY ("departmentTypeId") REFERENCES "DepartmentType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
