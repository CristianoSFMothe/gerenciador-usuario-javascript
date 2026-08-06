/*
  Warnings:

  - Made the column `foundedAt` on table `Company` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `Company` required. This step will fail if there are existing NULL values in that column.
  - Made the column `landlinePhone` on table `Company` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "foundedAt" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "landlinePhone" SET NOT NULL;
