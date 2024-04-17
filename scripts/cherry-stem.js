import Cherry from "../modules/cherry-markdown.esm.js";

class CherryStem {
  constructor() {
    const site = new CherryStemSite();

    document.cherry = new Cherry({
      id: "markdown",
      locale: "en_US",

      toolbars: {
        toolbar: ["bold", "italic", "color", "|", "list", "panel", "detail"],
      },

      callback: { afterChange: site.doChange,afterInit: site.doInit },
    });

    document.cherry.setTheme("dark");
  }
}

class CherryStemSite {
  constructor() {}

  doInit() {
    console.log("init");
  }

  doChange(text) {
    console.log(text);
  }
}

const cherryStem = new CherryStem();
