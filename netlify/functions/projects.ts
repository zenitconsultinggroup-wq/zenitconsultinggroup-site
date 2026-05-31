import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { projects } from "../../db/schema.js";
import { eq, desc } from "drizzle-orm";

function isAdmin(req: Request): boolean {
  const adminKey = process.env.ADMIN_PASSWORD;
  if (!adminKey) return false;
  return req.headers.get("X-Admin-Key") === adminKey;
}

export default async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  const url = new URL(req.url);
  const pathParts = url.pathname.split("/").filter(Boolean);
  // pathParts: ["api", "projects"] or ["api", "projects", ":id"]
  const projectId = pathParts[2] ? parseInt(pathParts[2]) : null;

  // GET /api/projects — public list
  if (req.method === "GET" && !projectId) {
    const all = await db
      .select()
      .from(projects)
      .orderBy(desc(projects.createdAt));

    return Response.json(
      all.map((p) => ({
        ...p,
        mediaKeys: JSON.parse(p.mediaKeys || "[]"),
      }))
    );
  }

  // POST /api/projects — create (admin only)
  if (req.method === "POST" && !projectId) {
    if (!isAdmin(req)) {
      return new Response("Unauthorized", { status: 401 });
    }
    const body = await req.json();
    const { title, description, category, location, projectDate, mediaKeys, coverKey } = body;

    if (!title) {
      return new Response("Title is required", { status: 400 });
    }

    const [project] = await db
      .insert(projects)
      .values({
        title,
        description: description ?? "",
        category: category ?? "",
        location: location ?? "",
        projectDate: projectDate ?? "",
        mediaKeys: JSON.stringify(mediaKeys ?? []),
        coverKey: coverKey ?? "",
      })
      .returning();

    return Response.json({ ...project, mediaKeys: JSON.parse(project.mediaKeys || "[]") }, { status: 201 });
  }

  // DELETE /api/projects/:id — delete (admin only)
  if (req.method === "DELETE" && projectId) {
    if (!isAdmin(req)) {
      return new Response("Unauthorized", { status: 401 });
    }

    await db.delete(projects).where(eq(projects.id, projectId));
    return new Response(null, { status: 204 });
  }

  return new Response("Not found", { status: 404 });
};

export const config: Config = {
  path: ["/api/projects", "/api/projects/:id"],
};
