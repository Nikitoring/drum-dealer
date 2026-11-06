CREATE TABLE "Category" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

INSERT INTO "Category" ("id", "name", "slug", "updatedAt")
SELECT gen_random_uuid(), "category", md5("category"), CURRENT_TIMESTAMP
FROM "Product"
GROUP BY "category";

ALTER TABLE "Product" ADD COLUMN "categoryId" UUID;

UPDATE "Product" AS product
SET "categoryId" = category."id"
FROM "Category" AS category
WHERE category."name" = product."category";

ALTER TABLE "Product" ALTER COLUMN "categoryId" SET NOT NULL;
DROP INDEX "Product_category_brand_condition_idx";
ALTER TABLE "Product" DROP COLUMN "category";

CREATE INDEX "Product_categoryId_brand_condition_idx" ON "Product"("categoryId", "brand", "condition");
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
