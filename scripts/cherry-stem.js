// eslint-disable-next-line
import Cherry from "../modules/cherry-markdown.esm.js";

class CherryStem {
  constructor() {
    this.changed = false;

    const afterChange = (text) => {
      document.cherryStem.text = text;
      document.cherryStem.changed = true;
    };

    this.cherry = new Cherry({
      id: "markdown",
      locale: "en_US",
      callback: { afterChange },
      theme: "dark",

      toolbars: {
        toolbar: ["bold", "italic", "color", "|", "list", "panel", "detail"],
      },
    });

    const { protocol, host, pathname } = window.location;
    const wsProtocol = protocol === "https:" ? "wss:" : "ws:";
    this.ws = new WebSocket(`${wsProtocol}//${host}${pathname}.ws`);

    this.ws.onmessage = (e) => {
      document.cherryStem.cherry.setValue(e.data);
    };

    setInterval(CherryStem.doRefresh, document.cherryStemRefreshRate);
  }

  static doRefresh() {
    if (!document.cherryStem.changed) return;
    document.cherryStem.changed = false;

    document.cherryStem.ws.send(document.cherryStem.text);
  }
}

document.cherryStem = new CherryStem();
