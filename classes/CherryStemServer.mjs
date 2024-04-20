import { dirname } from "path";
import express from "express";

export default class CherryStemServer {
  constructor(port, refreshRate) {
    const app = express();
    app.set("view engine", "ejs");

    const wd = dirname(".").replace(/\/classes$/, "");
    app.use("/scripts", express.static(`${wd}/scripts/`));
    app.use("/styles", express.static(`${wd}/styles/`));
    app.use("/media", express.static(`${wd}/media/`));

    const dist = `${wd}/node_modules/cherry-markdown/dist/`;

    app.use("/modules/fonts", express.static(`${dist}/fonts`));

    app.use(
      "/modules/cherry-markdown.min.css",
      express.static(`${dist}/cherry-markdown.min.css`),
    );

    app.use(
      "/modules/cherry-markdown.esm.js",
      express.static(`${dist}/cherry-markdown.esm.js`),
    );

    // serve everything without a period, including index, as an editable page
    app.get(/^[^.]*$/, (req, res) =>
      res.render("cs", this.doRender(req.path, refreshRate)));

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
