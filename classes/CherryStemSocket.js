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

    wss.on("connection", (ws, req) => this.onConnection(ws, req));
  }

  onConnection(ws, req) {
    const $pageId = this.getPageId(req.url.replace(".ws", ""));
    ws.session = { id: this.doNewSession($pageId) };
    const setDoc = JSON.stringify({ command: "setDoc", data: new ArrayBuffer(42) });
    ws.send(setDoc);

    ws.onmessage = (event) => this.onMessage($pageId, event.data);
  }

  getPageId($uri) {
    return this.sql.getPageId.get({ $uri }).pageId;
  }

  doNewSession($pageId) {
    // const proc = this.sql.doNewSession.run({ $pageId });
    // console.log(proc);
  }

  onMessage(page, data) {
    // console.log(page, data);
  }

  addPatch(uri, $sessionId, $patch) {
    const $docId = this.sql.getDocId.get({ $uri });
    // console.log("docId", docId);
    this.sql.setPage.run({ $docId, $sessionId, $patch });
  }
}
