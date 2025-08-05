import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/* Tabela de usuários */

export const userTable = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
});

/* Tabela de categorias */

export const categoryTable = pgTable("category", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text().notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* relations dizendo que uma categoria pode ter muitos produtos */

export const categoryRelations = relations(categoryTable, ({ many }) => ({
  products: many(productTable),
}));

/* Tabela de produtos */

export const productTable = pgTable("product", {
  id: uuid("id").primaryKey().defaultRandom(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categoryTable.id),
  name: text("name").notNull(),
  slug: text()
    .notNull()
    .unique() /* slug is a unique identifier for the product. EX: tênis preto top. Slug: tenis-preto-top*/,
  description: text("description").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* relations dizendo que um produto pertence a uma categoria */

export const productRelations = relations(productTable, ({ one, many }) => ({
  category: one(categoryTable, {
    fields: [productTable.categoryId],
    references: [categoryTable.id],
  }),

  variants: many(productVariantTable),
}));

/* Tabela de variantes de produtos */

export const productVariantTable = pgTable("product_variant", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => productTable.id),
  name: text("name").notNull(),
  slug: text().notNull().unique(),
  color: text().notNull(),
  priceInCents: integer("price_in_cents").notNull(),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const productVariantRelations = relations(
  productVariantTable,
  ({ one }) => ({
    product: one(productTable, {
      fields: [productVariantTable.productId],
      references: [productTable.id],
    }),
  }),
);
