// eslint-disable-next-line
import * as echarts from '../modules/addons/advance/cherry-table-echarts-plugin.js';
import Cherry from "../modules/cherry-markdown.esm.js";

window.echarts = echarts;

class CherryStem {
  constructor() {
    this.changed = false;

    // this.doSocket();

    fetch("./cherry.options.json")
      .then((response) => response.json())
      .then((options) => this.doEditor(options));
  }

  /*
  doSocket() {
    const { protocol, host, pathname } = window.location;
    const wsProtocol = protocol === "https:" ? "wss:" : "ws:";
    this.ws = new WebSocket(`${wsProtocol}//${host}${pathname}.ws`);

    this.ws.addEventListener("open", () => this.ws.send(JSON.stringify({ command: "getDoc" })));

    this.ws.addEventListener("message", (msg) => {
      const { command, data } = JSON.parse(msg.data);
      console.log(msg.data);
      document.cherryStem[command](data);
    });

    // this.ws.onmessage = (e) => document.cherryStem.cherry.setValue(e.data);
  }

  setDoc(doc) {
    console.log(doc);
  }
  */

  doEditor(options) {
    options.value = document.cherryStem.lastCache;
    options.callback = {};
    options.callback.afterChange = () => {
      document.cherryStem.changed = true;
    };

    this.cherry = new Cherry(options);

    setInterval(CherryStem.doRefresh, document.cherryStem.refreshRate);
  }

  static doRefresh() {
    if (!document.cherryStem.changed) return;
    document.cherryStem.changed = false;

    // console.log("CHANGE");

    // document.cherryStem.ws.send(document.cherryStem.text);
  }
}

document.cherryStem.stem = new CherryStem();
