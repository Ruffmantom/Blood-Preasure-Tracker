class RegiserForm extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
        <div class="mt-2 form">
          <h4 class="mt-1">Register</h4>
          <div class="form_sec ">
            <p class="form_lable ">Name</p>
            <input id="name_input" class="form_elm" type="text" maxlength="255" placeholder="John Doe" name="name">
          </div>
          <div class="form_sec ">
            <p class="form_lable ">Your Age</p>
            <input id="age_input" class="form_elm" type="number" maxlength="3" placeholder="45" name="age">
          </div>
          <button id="create_user_btn" class="btn btn_primary">Create User</button>
        </div>
        `
    }
}
customElements.define("register-form", RegiserForm);