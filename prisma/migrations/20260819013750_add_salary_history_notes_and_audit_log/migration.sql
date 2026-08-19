-- CreateEnum
CREATE TYPE "SalaryChangeReason" AS ENUM ('INITIAL', 'ANNUAL_ADJUSTMENT', 'PROMOTION', 'MARKET_ADJUSTMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "EmployeeNoteType" AS ENUM ('FEEDBACK', 'PUNCTUALITY', 'COMPLAINT', 'PRAISE');

-- CreateEnum
CREATE TYPE "AuditLogField" AS ENUM ('POSITION', 'DEPARTMENT', 'SALARY');

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "salary" DECIMAL(12,2);

-- AlterTable
ALTER TABLE "EmploymentHistory" ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "SalaryHistory" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "reason" "SalaryChangeReason" NOT NULL DEFAULT 'OTHER',
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SalaryHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeNote" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "type" "EmployeeNoteType" NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmployeeNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeAuditLog" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "field" "AuditLogField" NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "changedById" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmployeeAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SalaryHistory_employeeId_idx" ON "SalaryHistory"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeeNote_employeeId_idx" ON "EmployeeNote"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeeAuditLog_employeeId_idx" ON "EmployeeAuditLog"("employeeId");

-- AddForeignKey
ALTER TABLE "SalaryHistory" ADD CONSTRAINT "SalaryHistory_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeNote" ADD CONSTRAINT "EmployeeNote_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeNote" ADD CONSTRAINT "EmployeeNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeAuditLog" ADD CONSTRAINT "EmployeeAuditLog_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeAuditLog" ADD CONSTRAINT "EmployeeAuditLog_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
