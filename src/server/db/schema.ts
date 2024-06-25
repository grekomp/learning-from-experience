import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  created_at: timestamp("created_at").defaultNow(),
  title: text("title"),
  subtitle: text("subtitle"),
  summary: text("summary"),
  content: text("content"),
});

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name"),
});

export const post_tags = pgTable("post_tags", {
  post_id: serial("post_id")
    .primaryKey()
    .references(() => posts.id),
  tag_id: serial("tag_id")
    .primaryKey()
    .references(() => tags.id),
});
