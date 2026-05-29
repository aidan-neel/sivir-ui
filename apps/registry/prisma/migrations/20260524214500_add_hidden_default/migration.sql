-- CreateTable
CREATE TABLE "HiddenDefault" (
    "slug" TEXT NOT NULL,
    "hiddenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HiddenDefault_pkey" PRIMARY KEY ("slug")
);
