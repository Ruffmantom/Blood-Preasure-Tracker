let globalUser = null;
let userLoaded = false;
let activeModalDataNote = ""
let activeModalDataId = ""
const defaultUser = {
  userAge: "",
  bp_theme: false, // if true then is dark
  bp_data: [],
};

const menu_overlay_cont = $(".menu_overlay_cont");
const settings_btn = $("#settings_btn");
const close_settings_btn = $("#close_settings_btn");
let menuOpen = false;

const saveToLocal = () => {
  localStorage.setItem("BP_TR_USER", JSON.stringify(globalUser));
};

const renderCards = () => {
  // // console.log("Render Cards has started...")
  // when re rendering be sure to empty div
  $(".bp_data_cont").empty();

  if (userLoaded && globalUser.bp_data.length >= 1) {
    // // console.log("About to render cards...")
    globalUser.bp_data.forEach((d) => {
      let dataIndex = globalUser.bp_data.indexOf(d);
      let maxLength = globalUser.bp_data.length;
      $(".bp_data_cont").prepend(
        createDataCard(d, globalUser.userAge, dataIndex, maxLength)
      );
    });
  } else {
    $(".bp_data_cont").append(`<p class="end_of_data_note">No data found</p>`);
  }
};

const loadTheme = () => {
  if (globalUser.bp_theme) {
    $("#light_mode").prop("checked", false);
    $("#dark_mode").prop("checked", true);
    $("#theme_name").text("Dark");
  } else {
    $("#light_mode").prop("checked", true);
    $("#dark_mode").prop("checked", false);
    $("#theme_name").text("Light");
  }
};

const renderToggle = () => {
  if (globalUser.bp_theme) {
    $(".theme_toggle_btn").addClass("dark");


  } else {
    $(".theme_toggle_btn").removeClass("dark");

  }
};

// load program
const loadUserOrCreate = () => {
  // check local storage, if no user then create
  let localUser = localStorage.getItem("BP_TR_USER");
  if (localUser === null || localUser === undefined) {
    // // console.log('lets create a new user!')
    localStorage.setItem("BP_TR_USER", JSON.stringify(defaultUser));
    globalUser = defaultUser;
    userLoaded = true;
  } else {
    globalUser = JSON.parse(localUser);
    userLoaded = true;
    // check for theme init
    if (globalUser.bp_theme === undefined || globalUser.bp_theme === null) {
      // add variable and save
      globalUser.bp_theme = false; // default
      //save to local
      saveToLocal();
    }
    // load dom
    loadTheme();
    renderToggle();
    renderCards();
  }
};

const handleRecordModal = (recordId) => {
  let data = globalUser.bp_data.filter(d => d._id === recordId)
  // set state
  activeModalDataNote = data[0].note
  activeModalDataId = data[0]._id
  setDataModal(data[0])
}
const handleDeleteRecord = () => {
  globalUser.bp_data = globalUser.bp_data.filter(d => d._id !== activeModalDataId)
  // close modal
  $("#record_modal").removeClass("active")
  // render cards
  renderCards()
  // save to local
  saveToLocal()
  // clear state
  activeModalDataNote = ""
  activeModalDataId = ""
}

const handleSaveRecord = (newNote) => {
  // console.log("New Note: " + newNote)
  // only thing you can change is the note
  globalUser.bp_data.forEach(d => {
    // find data
    if (d._id === activeModalDataId) {
      // console.log("found Data")
      // check to see if user has edited the note
      if (newNote !== '' && newNote !== d.note) {
        // console.log("updating note")
        d.note = newNote
        // render cards
        renderCards()
        // save to local
        saveToLocal()
      }
    }
  })
  // close modal
  $("#record_modal").removeClass("active")
  // clear state
  activeModalDataNote = ""
  activeModalDataId = ""
}


$(() => {
  loadUserOrCreate();
  // onload hide footer
  $(".tracker_footer").hide();

  if (userLoaded && globalUser.userAge === "") {
    $(".welcome_modal_overlay_cont").addClass("active");
  }

  $("#submit_age_btn").click(function (event) {
    var ageInputVal = $("#age_input").val();
    globalUser.userAge = ageInputVal;
    // save to local
    saveToLocal();
    // render dom
    renderCards();
    // clean up
    $("#age_input").val("");
    // close modal
    $(".welcome_modal_overlay_cont").fadeOut();
    setTimeout(() => {
      $(".welcome_modal_overlay_cont").removeClass("active");
    }, 2000);
  });

  // new input for systolic and diastolic
  $("#input_sys_and_dio").on("input", function (e) {
    // Get the current cursor position
    var cursorPos = this.selectionStart;
    var originalLength = this.value.length;

    // Remove non-digits and the separator if it's not in the correct position
    var value = $(this)
      .val()
      .replace(/[^0-9]/g, "");
    if (value.length > 3) {
      value = value.slice(0, 3) + "/" + value.slice(3);
    }

    $(this).val(value);

    // Adjust cursor position after formatting
    var newLength = this.value.length;
    cursorPos = cursorPos + (newLength - originalLength);

    this.setSelectionRange(cursorPos, cursorPos);
  });

  // form submit
  $("#submit_bp_btn").click(function (event) {
    event.preventDefault();
    var bothSysAndDia = $("#input_sys_and_dio").val();
    var noteElmVal = $("#note_input_elm").val();
    let sys = bothSysAndDia.split("/")[0];
    let dia = bothSysAndDia.split("/")[1];
    var recordedAt = new Date().toISOString(); // ISO string format of current date and time

    var bpValues = {
      topNum: parseInt(sys),
      bottomNum: parseInt(dia),
      note: noteElmVal ? noteElmVal : "",
      recordedAt: recordedAt,
      _id: generateBPId(),
    };

    // save to globaluser
    globalUser.bp_data.push(bpValues);
    // re render list
    renderCards();
    // save to local
    saveToLocal();
    // clean up
    $("#input_sys_and_dio").val("");
    $("#note_input_elm").val("");
  });

  settings_btn.on("click", (e) => {
    if (menuOpen) {
      menu_overlay_cont.removeClass("active");
      menuOpen = false;
    } else {
      menu_overlay_cont.addClass("active");
      menuOpen = true;
    }
  });
  close_settings_btn.on("click", (e) => {
    if (menuOpen) {
      menu_overlay_cont.removeClass("active");
      menuOpen = false;
    }
  });


  $("#download_csv_btn").on("click", (e) => {
    let date = new Date().toISOString();
    let dateName = formatDate(date);
    let formattedName = dateName.split(" ")[0].replace(/\//g, "-");
    if (globalUser.bp_data.length >= 1) {
      downloadCSV(globalUser.bp_data, `BP-${formattedName}.csv`);
    }
  });

  $("#clear_all_data_btn").on("click", (e) => {
    localStorage.clear("BP_TR_USER");
    // Reload the page from the server, ignoring the cache
    window.location.reload(true);
  });

  // footer actions
  // close footer
  $("#close_footer_btn").on("click", function (e) {
    // // console.log("Close!");
    $(".tracker_footer").slideUp();
  });

  // open footer
  $("#footer_open_btn").on("click", function (e) {
    // // console.log("open!");
    $(".tracker_footer").slideDown();
  });

  // theme toggle
  /*
    - checkboxes
    #light_mode
    #dark_mode

  */
  $(".theme_toggle_btn").on("click", (e) => {
    // toggle theme
    globalUser.bp_theme = !globalUser.bp_theme;
    // render dom
    loadTheme();
    renderToggle();
    // save to local
    saveToLocal()
  });


  $(".bp_data_cont").on('click', ".bp_data_card ", (e) => {
    let cardId = $(e.target).data("recordid")
    $("#record_modal").addClass("active")
    // set modal
    handleRecordModal(cardId)
  })

  $("#close_record_modal_btn").on('click', (e) => {
    // clear state
    activeModalDataNote = ""
    activeModalDataId = ""
    // close modal
    $("#record_modal").removeClass("active")
    // cleanup
    clearDataModal()
  })

  $("#save_record_btn").on("click", (e) => {
    let noteVal = $("#overlay_note_input").val()
    handleSaveRecord(noteVal)
  })

  $("#delete_record_btn").on("click", (e) => {
    handleDeleteRecord()
  })

});
