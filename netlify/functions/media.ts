import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

export default async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  const url = new URL(req.url);
  // key comes as query param: /api/media?key=projects/xxx.jpg
  const key = url.searchParams.get("key");

  if (!key || !key.startsWith("projects/")) {
    return new Response("Invalid key", { status: 400 });
  }

  const store = getStore("project-media");
  const result = await store.getWithMetadata(key, { type: "blob" });

  if (!result) {
    return new Response("Not found", { status: 404 });
  }

  const contentType = (result.metadata as Record<string, string>)?.contentType ?? "application/octet-stream";
  const data = result.data as Blob;

  return new Response(data, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};

export const config: Config = {
  path: "/api/media",
};
