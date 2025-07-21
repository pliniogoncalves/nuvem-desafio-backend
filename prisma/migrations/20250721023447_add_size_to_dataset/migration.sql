/*
  Warnings:

  - Added the required column `size` to the `datasets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "datasets" ADD COLUMN     "size" INTEGER NOT NULL;
