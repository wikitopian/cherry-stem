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

    setInterval(CherryStem.doRefresh, 1000);
  }

  static doRefresh() {
    if (!document.cherryStem.changed) return;
    document.cherryStem.changed = false;

    console.log(document.cherryStem.text);
  }
}

document.cherryStem = new CherryStem();
