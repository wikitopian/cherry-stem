import "dotenv/config";

import { dirname } from "path";

import express from "express";
import { WebSocketServer } from "ws";

export default class {
  constructor() {
    const { CS_PORT } = process.env;

    if (!CS_PORT) {
      console.error("CS_PORT undefined. Did you make your .env environment?");
      process.exitCode = 1;
      return;
    }

    const server = this.doServe(CS_PORT);
    this.doSocket(server);
  }

  doServe(CS_PORT) {
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
    app.get(/^[^.]*$/, (req, res) => res.render("cs", this.doRender(req.path)));

    app.all("*", (req, res) => res.status(404).send());

    return app.listen(CS_PORT, console.info(`CherryStem (${CS_PORT})`));
  }

  doSocket(server) {
    const wss = new WebSocketServer({ noServer: true });

    server.on("upgrade", (req, socket, head) =>
      wss.handleUpgrade(req, socket, head, (ws) =>
        wss.emit("connection", ws, req),
      ),
    );

    wss.on("connection", (ws, req) => this.doNewPage(ws, req));
  }

  doRender(path) {
    return { title: path };
  }

  doNewPage(ws, req) {
    ws.send("TODO: Retrieve from database");

    ws.onmessage = (event) =>
      this.doUpdate(req.url.replace(".ws", ""), event.data);
  }

  doUpdate(page, text) {
    console.log("TODO: Update database. ", page, "::", text);
  }
}
