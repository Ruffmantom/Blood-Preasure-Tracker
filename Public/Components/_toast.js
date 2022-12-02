class Toast extends HTMLElement {
  constructor() {
    super();
    this.theme = this.getAttribute("theme");
    this.title = this.getAttribute("title");
    this.message = this.getAttribute("message");
    this.innerHTML = `
    <div class="toast_container" style="background-color: ${this.returnTheme(
      this.theme,
      "bkg"
    )}; color:${this.returnTheme(this.theme,'color')};">
        <div class="row toast_heading" style="border-bottom: 1px solid ${this.returnTheme(
          this.theme,
          "border"
        )};">
            <div class="col toast_title_col">
                <h5 class="toast_title">${this.title}</h5>
            </div>
            <div class="col toast_close_col">
                <div class="close_btn" id="toast_close"><i style="${this.returnTheme(this.theme,'color')}" class="fa-solid fa-xmark"></i></div>
            </div>
        </div>
        <div class="row">
            <div class="col toast_message_col">
                <p class="toast_message">${this.message}</p>
            </div>
        </div>
    </div>
    `;
  }
  returnTheme(theme, style) {
    const themes = {
      notify: {
        bkg: "#64a67f",
        border: "#4f9d69",
        color: "#ffffff",
      },
      cheer: {
        bkg: "#339af0",
        border: "#2d8cd9",
        color: "#ffffff",
      },
      error: {
        bkg: "#da5869",
        border: "#d84654",
        color: "#ffffff",
      },
      standard: {
        bkg: "#ffffff",
        border: "#f5f5f5",
        color: "#1f1f1f",
      },
    };
    if (style == "bkg") {
      switch (theme) {
        case "cheer":
          return themes.cheer.bkg;
        case "notify":
          return themes.notify.bkg;
        case "error":
          return themes.error.bkg;
        default:
          return themes.standard.bkg;
      }
    } else if (style == "color") {
      switch (theme) {
        case "cheer":
          return themes.cheer.color;
        case "notify":
          return themes.notify.color;
          case "error":
          return themes.error.color;
        default:
          return themes.standard.color;
      }
    } else {
      switch (theme) {
        case "cheer":
          return themes.cheer.border;
        case "notify":
          return themes.notify.border;
          case "error":
          return themes.error.border;
        default:
          return themes.standard.border;
      }
    }
  }
}
// USE IN HTML: <toast-component title="Welcome!" message="Thank you for being a toast! " theme="standard"></toast-component>
customElements.define("toast-component", Toast);