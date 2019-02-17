# @inc/here

> A dependency-free server for single page apps

**Here** is a zero dependency static file server with history api fallback defaults to support rapid single page app development.

_[Forked](https://github.com/lukejacksonn/servor) from Luke Jacksonn's Servør because I just wanted a nice file server (and, quiet). No watching, no reloads._

---

## Features

* 🗂 Serve static content like scripts, styles, and images from a directory
* 🖥 Reroute all non-file requests like `/` or `/admin` to a single file
* ⏱ Install using `npx` and be running in the browser in ~1 second
* 📚 Readable source code that encourages learning and contribution

## Usage

Add `@inc/here` as a dev dependency using `npm i @inc/here -D` or run directly from the Terminal:

```bash
npx @inc/here <directory> <fallback> <port> <open flag> <verbose flag>
```

* `<directory>` path to serve static files from (defaults to current directory `.`)
* `<fallback>` the file served for all non-file requests (defaults to `index.html`)
* `<port>` what port you want to serve the files from (defaults to `8080`)
* `<open flag>` if you want **here** to launch site in your default browser (defaults to `false`)
* `<verbose flag>` if you want logging, pass `--verbose` (defaults to `false`)

Example usage with npm scripts in a projects `package.json` file:

```json
{
  scripts: {
    start: 'npx @inc/here www index.html 8080 --verbose'
  }
}
```
