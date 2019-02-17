#!/usr/bin/env node

const fs = require("fs");
const http = require("http");
const path = require("path");
const url = require("url");

// ----------------------------------
// Generate map of all known mimetypes
// ----------------------------------

const mime = Object.entries(require("./types.json")).reduce(
  (all, [type, exts]) =>
    Object.assign(all, ...exts.map(ext => ({ [ext]: type }))),
  {}
);

// ----------------------------------
// Parse arguments from the command line
// ----------------------------------

const args = process.argv;
const cwd = process.cwd();
const fallback = process.argv[3] || "index.html";
const port = process.argv[4] || 8080;
const root = process.argv[2] || ".";

let autoopen;
let verbose;

args.forEach(argument => {
  switch(true) {
    case argument === "--open":
      autoopen = true;
      break;

    case argument === "--verbose":
      verbose = true;
      break;

    default:
      break;
  }
});

// ----------------------------------
// Server utility functions
// ----------------------------------

const isRouteRequest = uri =>
  uri
    .split("/")
    .pop()
    .indexOf(".") === -1 ?
    true :
    false;

const sendError = (res, resource, status) => {
  res.writeHead(status);
  res.end();

  if (verbose)
    console.log(" \x1b[41m", status, "\x1b[0m", `${resource}`); // eslint-disable-line no-console
};

const sendFile = (res, resource, status, file, ext) => {
  res.writeHead(status, {
    "Content-Type": mime[ext] || "application/octet-stream",
    "Access-Control-Allow-Origin": "*"
  });
  res.write(file, "binary");
  res.end();

  if (verbose)
    console.log(" \x1b[42m", status, "\x1b[0m", `${resource}`); // eslint-disable-line no-console
};

// ----------------------------------
// Start static file server
// ----------------------------------

http
  .createServer((req, res) => {
    const pathname = url.parse(req.url).pathname;
    const isRoute = isRouteRequest(pathname);
    const status = isRoute && pathname !== "/" ? 301 : 200;
    const resource = isRoute ? `/${fallback}` : decodeURI(pathname);
    const uri = path.join(cwd, root, resource);
    const ext = uri.replace(/^.*[./\\]/, "").toLowerCase();

    // Check if files exists at the location
    fs.stat(uri, (err, stat) => { // eslint-disable-line no-unused-vars
      if (err)
        return sendError(res, resource, 404);

      // Respond with the contents of the file
      fs.readFile(uri, "binary", (err, file) => {
        if (err)
          return sendError(res, resource, 500);

        sendFile(res, resource, status, file, ext);
      });
    });
  })
  .listen(parseInt(port, 10));

// ----------------------------------
// Log startup details to terminal
// ----------------------------------

console.log(`\n 🗂  Serving files from ./${root} on http://localhost:${port}`); // eslint-disable-line no-console
console.log(` 🖥  Using ${fallback} as the fallback for route requests\n`); // eslint-disable-line no-console

// ----------------------------------
// Open the page in the default browser
// ----------------------------------

if (autoopen) {
  const page = `http://localhost:${port}`;
  const open =
    process.platform == "darwin" ?
      "open" :
      process.platform == "win32" ?
        "start" :
        "xdg-open";

  require("child_process").exec(open + " " + page);
}
