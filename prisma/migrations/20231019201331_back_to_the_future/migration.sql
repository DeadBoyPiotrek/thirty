/*
  Warnings:

  - You are about to drop the `_Friends` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_postId_fkey";

-- DropForeignKey
ALTER TABLE "_Friends" DROP CONSTRAINT "_Friends_A_fkey";

-- DropForeignKey
ALTER TABLE "_Friends" DROP CONSTRAINT "_Friends_B_fkey";

-- AlterTable
ALTER TABLE "Like" ALTER COLUMN "postId" DROP NOT NULL;

-- DropTable
DROP TABLE "_Friends";

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
