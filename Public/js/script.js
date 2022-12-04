// import DoctorsController from '../../Database/Controllers/DoctorsController.js';
// import UsersController from "../../Database/Controllers/UsersController.js";

// let user = new UsersController();
// let chart = new C;
// let doctor = new DoctorsController;

// bring in buttons
const submitRegOrLogBtn = $("#reg_log_submit_btn");
// bring in inputs
const nameInput = $("#name_input");
const ageInput = $("#age_input");
const userNameInput = $("#user_name_input");
const passwordInput = $("#password_input");
const confirmInput = $("#confirm_password_input");

// flash helper
const flashHelper = (message, theme) => {
  // return style helper
  const returnTheme = (find_theme, find_style) => {
    console.log("about to return theme css");
    const themes = {
      notify: {
        bkg: "--notify-primary",
        color: "--text-lt",
      },
      cheer: {
        bkg: "--cheer-primary",
        color: "--text-lt",
      },
      error: {
        bkg: "--error-primary",
        color: "--text-lt",
      },
      standard: {
        bkg: "--light-primary",
        color: "--text-dk",
      },
    };
    if (find_style == "bkg") {
      switch (find_theme) {
        case "cheer":
          return themes.cheer.bkg;
        case "notify":
          return themes.notify.bkg;
        case "error":
          return themes.error.bkg;
        default:
          return themes.standard.bkg;
      }
    } else {
      switch (find_theme) {
        case "cheer":
          return themes.cheer.color;
        case "notify":
          return themes.notify.color;
        case "error":
          return themes.error.color;
        default:
          return themes.standard.color;
      }
    }
  };
  // display flash
  $(".flash_container").css({
    "background-color": `var(${returnTheme(theme, "bkg")})`,
    color: `var(${returnTheme(theme, "color")})`,
  });
  $(".flash_container").fadeIn();
  $(".flash_title").text(message);
  // show message for..
  var flashTimmer = setTimeout(() => {
    $(".flash_container").fadeOut();
    $(".flash_title").text = "";
    clearTimeout(flashTimmer);
  }, 5000);
};
// Document on load
$(() => {
  // hide things that dont need to be seen
  $(".flash_container").attr("hidden", true);
  let user_username = "";
  let user_name = "";
  let user_age = "";
  let user_password = "";
  let confirm_pass = "";
  let confirmed = false;
  let validation = {
    username_val: {
      verified: false,
      err_message: "",
    },
    name_val: {
      verified: false,
      err_message: "",
    },
    age_val: {
      verified: false,
      err_message: "",
    },
    password_val: {
      verified: false,
      err_message: "",
    },
    confirm_val: {
      verified: false,
      err_message: "",
    },
  };
  const validationHelper = (d) => {
    // check and see if the data has been entered
    let sendit = false;
    // handle Username
    if (d.username.length <= 2 || d.username.length >= 21) {
      validation.username_val.err_message =
        "Please enter a username between 3 - 20 Characters.";
    } else if (d.username.length === 0 || d.username == null) {
      validation.username_val.err_message = "Please enter a username.";
    } else {
      validation.username_val.err_message = "";
      validation.username_val.verified = true;
    }
    // handle name
    if (d.name.length === 0 || d.name == null) {
      validation.name_val.err_message = "Please enter an age.";
    } else {
      validation.name_val.err_message = "";
      validation.name_val.verified = true;
    }
    // handle age
    if (d.age == 0 || d.age == null) {
      validation.age_val.err_message = "Please enter an age.";
    } else {
      validation.age_val.err_message = "";
      validation.age_val.verified = true;
    }
    // handle password
    if (d.password.length == 0) {
      validation.password_val.err_message = "Please enter a password.";
    } else {
      validation.password_val.err_message = "";
      validation.password_val.verified = true;
    }
    // handle confirm pass
    if (confirmed) {
      validation.confirm_val.err_message = "";
      validation.confirm_val.verified = true;
    } else if (d.userconfirmgth == 0) {
      validation.confirm_val.err_message = "Please confirm your password.";
    } else {
      validation.confirm_val.err_message = "Passwords dont match";
    }
    // now if they are false show errors
    Object.keys(validation).forEach((i) => {
      if (validation[i].verified === true) {
        console.log("verified Form!");
        sendit = true;
      } else {
        console.log("there are errors in the form");
        sendit = false;
      }
    });
    console.log(validation);
    return sendit;
  };

  // retrieve the values from inputs
  userNameInput.on("input", function () {
    user_username = this.value;
  });
  nameInput.on("input", function () {
    user_name = this.value;
  });
  ageInput.on("input", function () {
    user_age = this.value;
  });
  passwordInput.on("input", function () {
    user_password = this.value;
  });
  confirmInput.on("input", function () {
    confirm_pass = this.value;
    // verify
    if (confirm_pass !== "" && confirm_pass !== user_password) {
      $(this).css({ border: "1px solid var(--danger)" });
      confirmed = false;
    } else if (confirm_pass === user_password && user_password !== "") {
      $(this).css({ border: "1px solid var(--cheer-primary)" });
      confirmed = true;
    } else {
      // normal state
      $(this).css({ border: "1px solid var(--light-primary-darker)" });
    }
  });
  // when the submit button is clicked..
  submitRegOrLogBtn.click((e) => {
    e.preventDefault();
    // check to see if login or register
    let usage = e.target.dataset.usage;
    // set data
    let data = {
      username: user_username.replace(/(<([^>]+)>)/gi, "").trim(),
      name: user_name.replace(/(<([^>]+)>)/gi, "").trim(),
      age: user_age,
      password: user_password.replace(/(<([^>]+)>)/gi, "").trim(),
    };
    // usage
    if (usage === "newuser") {
      // signup
      // validation helper
      if (validationHelper(data)) {
        flashHelper("Congrats! Your account has been created!", "cheer");
      }
    } else {
      //login
      // validation helper

      console.log(data);
      flashHelper("Successful Login", "notify");
    }
  });
});
