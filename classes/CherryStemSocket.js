import { WebSocketServer } from "ws";

export default class CherryStemSocket {
  constructor(sql, server) {
    this.sql = sql;
    const wss = new WebSocketServer({ noServer: true });

    server.on("upgrade", (req, socket, head) =>
      wss.handleUpgrade(req, socket, head, (ws) =>
        wss.emit("connection", ws, req),
      ),
    );

    wss.on("connection", (ws, req) => this.doGetPage(ws, req));
  }

  doGetPage(ws, req) {
    const page = req.url.replace(".ws", "");
    const body = this.sql.getPage.pluck().get({ page });
    ws.send(body);

    ws.onmessage = (event) =>
      this.doUpdate(req.url.replace(".ws", ""), event.data);
  }

  doUpdate(page, body) {
    this.sql.setPage.run({ page, body });
  }
}
