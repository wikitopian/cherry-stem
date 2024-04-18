// eslint-disable-next-line
import Cherry from "../modules/cherry-markdown.esm.js";

class CherryStemSite {
  doInit() {
    console.log("init");
  }

  doChange(text) {
    console.log(text);
  }
}

class CherryStem {
  constructor() {
    const site = new CherryStemSite();

    this.cherry = new Cherry({
      id: "markdown",
      locale: "en_US",

      toolbars: {
        toolbar: ["bold", "italic", "color", "|", "list", "panel", "detail"],
      },

      callback: { afterChange: site.doChange, afterInit: site.doInit },
    });

    this.cherry.setTheme("dark");
  }
}

document.cherryStem = new CherryStem();
