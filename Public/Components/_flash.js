class Flash extends HTMLElement {
    constructor() {
      super();
      this.theme = this.getAttribute("theme");
      this.title = this.getAttribute("title");
      this.innerHTML = `
      <div class="flash_container" style="background-color: var(${this.returnTheme(
        this.theme,
        "bkg"
      )}); color:var(${this.returnTheme(this.theme,'color')});">
          <div class="row flash_heading">
              <div class="col flash_title_col">
                  <h5 class="flash_title">${this.title}</h5>
              </div>
              <div class="col flash_close_col">
                  <div class="close_btn" id="flash_close"><i style="color:var(${this.returnTheme(this.theme,'color')});" class="fa-solid fa-xmark"></i></div>
              </div>
          </div>
      </div>
      `;
    }
    returnTheme(theme, style) {
      const themes = {
        notify: {
          bkg: "--notify-primary",
          border: "--notify-primary-darker",
          color: "--text-lt",
        },
        cheer: {
          bkg: "--cheer-primary",
          border: "--cheer-primary-darker",
          color: "--text-lt",
        },
        error: {
          bkg: "--error-primary",
          border: "--error-primary-darker",
          color: "--text-lt",
        },
        standard: {
          bkg: "--light-primary",
          border: "--light-primary-darker",
          color: "--text-dk",
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
  customElements.define("flash-component", Flash);