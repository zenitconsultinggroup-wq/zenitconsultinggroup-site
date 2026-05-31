import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: serial().primaryKey(),
  title: text().notNull(),
  description: text().notNull().default(""),
  category: text().notNull().default(""),
  location: text().notNull().default(""),
  projectDate: text("project_date").notNull().default(""),
  mediaKeys: text("media_keys").notNull().default("[]"),
  coverKey: text("cover_key").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow(),
});
