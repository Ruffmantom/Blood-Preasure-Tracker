class ComponentImport extends HTMLElement {
  constructor() {
    super();
    this.componets = JSON.parse(this.getAttribute("component"))
    this.innerHTML = `
    <div>
        ${this.componets.map((comp => {
      return `
          <script  src="./Public/Components/_${comp}.js" ></script>
          `
    })).join('')}`
  }
}

customElements.define("component-importer", ComponentImport);