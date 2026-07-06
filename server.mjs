import { createServer } from "node:http";
import { readFile } from "node:fs";
import { extname, join, resolve } from "node:path";

const root = resolve(".");
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
};

createServer((request, response) => {
  const urlPath = decodeURIComponent(request.url.split("?")[0]);
  const pathname = urlPath === "/" ? "/index.html" : urlPath;
  const filePath = resolve(join(root, pathname));

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": types[extname(filePath)] || "application/octet-stream",
    });
    response.end(data);
  });
}).listen(4173, "127.0.0.1");
