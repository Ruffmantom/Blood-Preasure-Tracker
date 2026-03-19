const welcomeModal = ()=>{
    return`
    <div class="welcome_modal_overlay_cont">
      <div class="welcome_modal_inner">
        <div class="welcome_modal_header">
          <h2>Welcome!</h2>
          <p>Please enter your age to get started.</p>

          <div class="form">
            <div class="form_sec">
              <p class="form_lable">Age</p>
              <input
                id="age_input"
                type="number"
                max="120"
                placeholder="30"
                class="form_elm"
              />
            </div>
            <button id="submit_age_btn" class="btn btn_primary">Submit</button>
          </div>
        </div>
      </div>
    </div>
    `
}