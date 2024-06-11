/*
  Warnings:

  - The values [BUSINESS_INCOME,RENTAL_INCOME] on the enum `IncomeCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
ALTER TYPE "ExpenseCategory" ADD VALUE 'OTHER';

-- AlterEnum
BEGIN;
CREATE TYPE "IncomeCategory_new" AS ENUM ('SALARY', 'FREELANCE', 'INVESTMENTS', 'BUSINESS', 'RENTAL', 'GIFTS', 'OTHER');
ALTER TABLE "Income" ALTER COLUMN "category" TYPE "IncomeCategory_new" USING ("category"::text::"IncomeCategory_new");
ALTER TYPE "IncomeCategory" RENAME TO "IncomeCategory_old";
ALTER TYPE "IncomeCategory_new" RENAME TO "IncomeCategory";
DROP TYPE "IncomeCategory_old";
COMMIT;
