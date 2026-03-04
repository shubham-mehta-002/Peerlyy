-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "score" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Post_score_idx" ON "Post"("score");
