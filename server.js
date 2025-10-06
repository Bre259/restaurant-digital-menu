const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const hostname = "0.0.0.0"; // Changed to bind to all network interfaces
const port = 3000;

// Function to get the local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      if (interface.family === "IPv4" && !interface.internal) {
        return interface.address;
      }
    }
  }
  return "127.0.0.1";
}

// MIME types
const mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

const server = http.createServer((req, res) => {
  console.log(`Request: ${req.url}`);

  // Handle the root path
  let filePath = req.url === "/" ? "/index.html" : req.url;
  filePath = path.join("./src", filePath);

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || "application/octet-stream";

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        // File not found
        fs.readFile("./src/index.html", (err, content) => {
          if (err) {
            res.writeHead(404, { "Content-Type": "text/html" });
            res.end("404 Not Found", "utf-8");
          } else {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(content, "utf-8");
          }
        });
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      // Success
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

server.listen(port, hostname, () => {
  const localIP = getLocalIP();
  console.log(`Server running at http://${localIP}:${port}/`);
  console.log(`Local access: http://localhost:${port}/`);
  console.log("Press Ctrl+C to stop the server");
});
