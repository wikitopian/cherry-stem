import fs from "fs";
import { dirname } from "path";
import express from "express";

export default class CherryStemServer {
  constructor(port, refreshRate) {
    const app = express();
    app.set("view engine", "ejs");

    const wd = dirname(".").replace(/\/classes$/, "");

    let options = `${wd}/cherry.options.json`;
    if (!fs.existsSync(options)) options = `${wd}/cherry.options.default.json`;

    app.use("/cherry.options.json", express.static(options));

    app.use("/scripts", express.static(`${wd}/scripts/`));
    app.use("/styles", express.static(`${wd}/styles/`));
    app.use("/media", express.static(`${wd}/media/`));

    const cherry = `${wd}/node_modules/cherry-markdown/dist/`;

    app.use("/modules/fonts", express.static(`${cherry}/fonts`));

    app.use(
      "/modules/cherry-markdown.min.css",
      express.static(`${cherry}/cherry-markdown.min.css`),
    );

    app.use(
      "/modules/cherry-markdown.esm.js",
      express.static(`${cherry}/cherry-markdown.esm.js`),
    );

    app.use(
      "/modules/cherry-markdown.esm.js",
      express.static(`${cherry}/cherry-markdown.esm.js`),
    );

    app.use(
      "/modules/bit-sync.mjs",
      express.static(
        `${wd}/node_modules/@matthewparrott/bit-sync/bit-sync.mjs`,
      ),
    );

    // serve everything without a period, including index, as an editable page
    app.get(/^[^.]*$/, (req, res) =>
      res.render("cs", this.doRender(req.path, refreshRate)),
    );

    app.all("*", (req, res) => res.status(404).send());

    this.server = app.listen(port, console.info(`CherryStem (${port})`));
  }

  doRender(title, refreshRate) {
    return { title, refreshRate };
  }

  getServer() {
    return this.server;
  }
}
