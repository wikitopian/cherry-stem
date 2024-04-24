// eslint-disable-next-line
import Cherry from "../modules/cherry-markdown.esm.js";
// eslint-disable-next-line
import BSync from "../modules/bit-sync.mjs";

class CherryStem {
  constructor() {
    this.changed = false;

    this.doSocket();

    fetch("./cherry.options.json")
      .then((response) => response.json())
      .then((options) => this.doEditor(options));
  }

  doSocket() {
    const { protocol, host, pathname } = window.location;
    const wsProtocol = protocol === "https:" ? "wss:" : "ws:";
    this.ws = new WebSocket(`${wsProtocol}//${host}${pathname}.ws`);

    this.ws.onmessage = (e) => {
      document.cherryStem.cherry.setValue(e.data);
    };
  }

  doEditor(options) {
    options.callback = {};
    options.callback.afterChange = (text) => {
      document.cherryStem.text = text;
      document.cherryStem.changed = true;
    };

    this.cherry = new Cherry(options);

    setInterval(CherryStem.doRefresh, document.cherryStemRefreshRate);
  }

  static doRefresh() {
    if (!document.cherryStem.changed) return;
    document.cherryStem.changed = false;

    console.info(BSync.createChecksumDocument(1000, document.cherryStem.text));

    document.cherryStem.ws.send(document.cherryStem.text);
  }
}

document.cherryStem = new CherryStem();
