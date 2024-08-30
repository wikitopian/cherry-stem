import fs from "fs";
import { dirname } from "path";
import express from "express";

export default class CherryStemServer {
  constructor(port) {
    const app = express();
    const wd = dirname(".").replace(/\/classes$/, "");

    const tpl = fs.readFileSync(`${wd}/template/template.html`, "utf8");

    let options = `${wd}/cherry.options.json`;
    if (!fs.existsSync(options)) options = `${wd}/cherry.options.default.json`;

    app.use("/cherry.options.json", express.static(options));

    app.use("/scripts", express.static(`${wd}/scripts/`));
    app.use("/styles", express.static(`${wd}/styles/`));
    app.use("/", express.static(`${wd}/public/`));

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

    app.use("/modules/addons", express.static(`${cherry}/addons`));

    app.use(
      "/modules/bit-sync.mjs",
      express.static(
        `${wd}/node_modules/@matthewparrott/bit-sync/bit-sync.mjs`,
      ),
    );

    // serve everything without a period, including index, as an editable page
    app.get(/^[^.]*$/, (req, res) => res.send(tpl.replace("$TITLE", req.path)));

    app.all("*", (req, res) => res.status(404).send());

    this.server = app.listen(port, console.info(`CherryStem (${port})`));
  }

  getServer() {
    return this.server;
  }
}
