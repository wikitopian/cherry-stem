import 'dotenv/config';

import express from "express";

export default class CherryStem {
  constructor() {
    const { CS_PORT } = process.env;

    if (!CS_PORT) {
      console.error("CS_PORT undefined. Did you make your .env environment?");
      process.exitCode = 1;
      return;
    }

    this.doServe(CS_PORT);
  }

  doServe(CS_PORT) {
    const app = express();
    app.set("view engine", "ejs");

    const wd = import.meta.dirname.replace(/\/classes$/, "");
    app.use("/scripts", express.static(`${wd}/scripts/`));
    app.use("/styles", express.static(`${wd}/styles/`));
    app.use("/media", express.static(`${wd}/media/`));

    const dist = `${wd}/node_modules/cherry-markdown/dist/`;

    app.use(
      "/modules/fonts",
      express.static(`${dist}/fonts`),
    );

    app.use(
      "/modules/cherry-markdown.min.css",
      express.static(`${dist}/cherry-markdown.min.css`),
    );

    app.use(
      "/modules/cherry-markdown.esm.js",
      express.static(`${dist}/cherry-markdown.esm.js`),
    );

    // serve everything without a period, including index, as an editable page
    app.get(/^[^.]*$/, (req, res) => res.render("cs", this.doRender(req.path)));

    app.all("*", (req, res) => res.status(404).send());

    app.listen(CS_PORT, () => console.info(`CherryStem running on ${CS_PORT}`));
  }

  doRender(path) {

    return { title: path };
  }
}
