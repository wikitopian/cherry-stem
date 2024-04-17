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

    app.get(/^[^.]*$/, (req, res) => res.render("cs", this.doRender(req.path)));

    app.all("*", (req, res) => res.status(404).send());

    app.listen(CS_PORT, () => console.info(`CherryStem running on ${CS_PORT}`));
  }

  doRender(path) {

    return { title: path };
  }
}