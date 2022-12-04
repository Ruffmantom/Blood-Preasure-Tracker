const template = document.createElement("template");
template.innerHTML = `
<!-- font awesome -->
<script src="https://kit.fontawesome.com/39026cc83f.js" crossorigin="anonymous"></script>
<!-- App styles -->
<link rel="stylesheet" href="Public/styles/clear.css" />
<link rel="stylesheet" href="Public/styles/ruffstyles.css" />
<link rel="stylesheet" href="Public/styles/style.css" />

<div class="flash_container">
    <div class="row flash_heading">
        <div class="col flash_title_col">
            <h5 class="flash_title"></h5>
        </div>
    </div>
</div>`;

class Flash extends HTMLElement {
  constructor() {
    super();
    // attach to shadow dom
    this.attachShadow({ mode: "open" });
    // append template
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    // add message to title
    this.shadowRoot.querySelector(".flash_title").innerText =
      this.getAttribute("title");
    // get theme
    this.theme = this.getAttribute("theme");
    // set style for main container
    const mainCont = this.shadowRoot.querySelector(".flash_container");
    mainCont.style = `background-color: var(${this.returnTheme(this.theme, "bkg")}); color:var(${this.returnTheme(this.theme, "color")});`
  }

  returnTheme(theme, style) {
    console.log("about to return theme css");
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
