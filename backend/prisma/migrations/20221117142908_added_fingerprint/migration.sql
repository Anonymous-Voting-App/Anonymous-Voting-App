-- CreateTable
CREATE TABLE "Fingerprint" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ip" TEXT NOT NULL DEFAULT '',
    "idCookie" TEXT NOT NULL DEFAULT '',
    "fingerprintJsId" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Fingerprint_pkey" PRIMARY KEY ("id")
);
