CREATE TABLE "projects" (
	"id" serial PRIMARY KEY,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"category" text DEFAULT '' NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"project_date" text DEFAULT '' NOT NULL,
	"media_keys" text DEFAULT '[]' NOT NULL,
	"cover_key" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
