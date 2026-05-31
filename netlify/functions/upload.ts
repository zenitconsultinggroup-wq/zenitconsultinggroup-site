import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

function isAdmin(req: Request): boolean {
  const adminKey = process.env.ADMIN_PASSWORD;
  if (!adminKey) return false;
  return req.headers.get("X-Admin-Key") === adminKey;
}

export default async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  if (!isAdmin(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return new Response("No file provided", { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml", "video/mp4", "application/pdf"];
  if (!allowedTypes.includes(file.type)) {
    return new Response("File type not allowed", { status: 400 });
  }

  const ext = file.name.split(".").pop() ?? "bin";
  const key = `projects/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const store = getStore({ name: "project-media", consistency: "strong" });
  const arrayBuffer = await file.arrayBuffer();
  await store.set(key, arrayBuffer, { metadata: { contentType: file.type, originalName: file.name } });

  return Response.json({ key, name: file.name, type: file.type });
};

export const config: Config = {
  path: "/api/upload",
};
