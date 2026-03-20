let appVersion = "2.0.0";
let globalUser = null;
let userLoaded = false;
let activeModalDataNote = ""
let activeModalDataId = ""
let currentBloodPressureCardId = ''
const localUserId = 'O1LHQAMLTTIUVI2USHPGZOKKAJOVU4PCCBKF26Q7ZRNNHK496PPOV9THXRRGXEKH7T6M8WDXNKYLIDSWHQFMMSPWHCRLBPJKJ4YM'
// pages are bloodPressure, cabinet, settings
let currentPage = 'bloodPressure'
const defaultUser = {
  userAge: "",
  userBirthday: "",
  bp_theme: false, // if true then is dark
  bp_theme_title: "Light", // if true then is dark
  bp_data: [],
  userStatus: "setup"
};

const saveToLocal = () => {
  localStorage.setItem(localUserId, JSON.stringify(globalUser));
};

const renderCards = () => {
  bloodPressureTrackerSection.empty()
  if (userLoaded && globalUser.bp_data.length >= 1) {
    globalUser.bp_data.forEach((d) => {
      let element = bloodPressureCardComponent(d)
      bloodPressureTrackerSection.prepend(element)
    })
  } else {
    bloodPressureTrackerSection.append(`<p class="text-center">No data found</p>
      <p class="text-center">You have not added any entries yet</p>`)
  }

};

const loadTheme = () => {
  // set settings text
  settingsThemeText.text(globalUser.bp_theme_title)
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
  let localUser = localStorage.getItem(localUserId);
  if (localUser === null || localUser === undefined) {
    console.log('lets create a new user!')
    // load in welcome modal
    welcomeOverlay.show()
    localStorage.setItem(localUserId, JSON.stringify(defaultUser));
    globalUser = defaultUser;
    userLoaded = true;
  } else {
    let parsedUser = JSON.parse(localUser)
    if (parsedUser.userStatus === 'setup') {
      globalUser = parsedUser
      userLoaded = true;
      // load in welcome modal to finish setup
      welcomeOverlay.show()
      return
    } else {
      globalUser = parsedUser
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
  }
};

const handleSetup = () => {
  let birthday = userBirthdayInput.val()
  console.log(birthday)
}

userBirthdayInput.on('input', function () {
  let birthday = $(this).val()
  userYearsOld.text(`Your age: ${getAgeFromDateInput(birthday)}`)
})

welcomeGetStartedBtn.on('click', function (e) {
  e.preventDefault()
  console.log(globalUser)
  let birthday = userBirthdayInput.val()
  if (!birthday) {
    addAppAlert('danger', "Please input your birthday to help get accurate feedback.")
    return
  }

  // set user birthday and age
  globalUser.userAge = getAgeFromDateInput(birthday)
  globalUser.userBirthday = birthday
  globalUser.userStatus = 'ready'
  // save user
  saveToLocal()
  // close the welcome modal
  welcomeOverlay.fadeOut(() => {
    userBirthdayInput.val('')
  })

})

const handleDeleteRecord = () => {
  if (!currentBloodPressureCardId) {
    addAppAlert('danger', 'There was an issue deleting this entry. Please reload the app and try again.')
    return
  }
  globalUser.bp_data = globalUser.bp_data.filter(d => d.id !== currentBloodPressureCardId)
  // render cards
  renderCards()
  // save to local
  saveToLocal()
  // clear inputs
  editBloodPressureInput.val('')
  editBloodPressurePulseInput.val('')
  editBloodPressureNotesInput.val('')
  // clear state
  currentBloodPressureCardId = ""
  // close edit modal
  modalOverlay.fadeOut()
  editBpEntryModal.slideUp()
}

const handleSaveRecord = (data) => {
  globalUser.bp_data.forEach(d => {
    // find data
    if (d.id === currentBloodPressureCardId) {
      // console.log("found Data")
      // check to see if user has edited the note
      d.systolic = data.systolic
      d.diastolic = data.diastolic
      d.pulse = data.pulse
      d.notes = data.notes
    }
  })
  // save to local
  saveToLocal()
  // render cards
  renderCards()

  // clear inputs
  editBloodPressureInput.val('')
  editBloodPressurePulseInput.val('')
  editBloodPressureNotesInput.val('')
  // clear state
  currentBloodPressureCardId = ""
  // close edit modal
  modalOverlay.fadeOut()
  editBpEntryModal.slideUp()
}

const addAppAlert = (type, text) => {
  const notifyId = generateBPId()
  const notification = $(notificationComponent(type, text, notifyId))

  notificationContainer.prepend(notification)

  setTimeout(() => {
    notification.fadeOut(400, () => {
      notification.remove()
    })
  }, 3000)
}


// handle loading Blood pressure edit form
const loadEditBloodPressureForm = (cardId) => {
  let foundCard = globalUser.bp_data.find(d => d.id === cardId)

  if (!foundCard) {
    addAppAlert('danger', 'There was an error loading this card please reload the app.')
    return
  }
  editBloodPressureInput.val(`${foundCard.systolic}/${foundCard.diastolic}`)
  editBloodPressurePulseInput.val(foundCard.pulse)
  editBloodPressureNotesInput.val(foundCard.notes)
}



$(() => {
  loadUserOrCreate();
  // set version
  versionTextElm.text(appVersion)
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
  // formats the value inside of these inputs
  addBloodPressureInput.on("input", handleSysAndDiaFormat);
  editBloodPressureInput.on("input", handleSysAndDiaFormat);

  // form submit
  addBloodPressureBtn.click(function (event) {
    event.preventDefault();
    var bothSysAndDia = addBloodPressureInput.val();
    var pulseElmVal = addBloodPressurePulseInput.val();
    var noteElmVal = addBloodPressureNotesInput.val();
    let sys = bothSysAndDia.split("/")[0];
    let dia = bothSysAndDia.split("/")[1];
    let newBpEntry = new BloodPressureEntry(
      parseInt(sys),
      parseInt(dia),
      parseInt(pulseElmVal),
      noteElmVal,
      globalUser.age
    )

    // save to globaluser
    globalUser.bp_data.push(newBpEntry);
    // re render list
    renderCards();
    // save to local
    saveToLocal();
    // clean up
    addBloodPressureInput.val("");
    addBloodPressurePulseInput.val("");
    addBloodPressureNotesInput.val("");
    // hide modal
    modalOverlay.fadeOut()
    addBpEntryModal.slideUp()
  });


  $("#download_csv_btn").on("click", (e) => {
    let date = new Date().toISOString();
    let dateName = formatDate(date);
    let formattedName = dateName.split(" ")[0].replace(/\//g, "-");
    if (globalUser.bp_data.length >= 1) {
      dounloadTxt(globalUser.bp_data, `BP-${formattedName}.txt`);
    }
  });

  $("#clear_all_data_btn").on("click", (e) => {
    localStorage.clear("BP_TR_USER");
    // Reload the page from the server, ignoring the cache
    window.location.reload(true);
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


  editBloodPressureSaveBtn.on("click", (e) => {
    var bothSysAndDia = editBloodPressureInput.val();
    var pulseElmVal = editBloodPressurePulseInput.val();
    var noteElmVal = editBloodPressureNotesInput.val();
    let sys = bothSysAndDia.split("/")[0];
    let dia = bothSysAndDia.split("/")[1];
    let editFormData = {
      systolic: sys,
      diastolic: dia,
      pulse: pulseElmVal,
      notes: noteElmVal,
    }

    handleSaveRecord(editFormData)
  })

  editBloodPressureDeleteBtn.on("click", (e) => {
    handleDeleteRecord()
  })


  // actions
  footerAddBtn.click(() => {
    if (currentPage === 'bloodPressure') {
      modalOverlay.fadeIn()
      addBpEntryModal.slideDown()
    } else {
      console.log(`Opening modal for page: ${currentPage}`)
    }
  })

  closeAddEntryBtn.click(() => {
    modalOverlay.fadeOut()
    addBpEntryModal.slideUp()
  })

  closeEditEntryBtn.click(() => {
    modalOverlay.fadeOut()
    editBpEntryModal.slideUp()
  })


  // set and load page
  const setPage = (title, pageId) => {
    headerTitle.text(title)
    if (pageId === 'bloodPressure') {
      // footer
      footerTop.show()

      // show section
      bloodPressureTrackerSection.show()
      cabinetSection.hide()
      settingsSection.hide()

      // add and remove classes
      footerBpTrackerBtn.removeClass('border-zinc-50/0 fill-zinc-950 dark:fill-zinc-50')
      footerBpTrackerBtn.addClass('border-blue-600 fill-blue-600')

      footerCabinetBtn.addClass('border-zinc-50/0 fill-zinc-950 dark:fill-zinc-50')
      footerCabinetBtn.removeClass('border-blue-600 fill-blue-600')

      footerSettingsBtn.addClass('border-zinc-50/0 fill-zinc-950 dark:fill-zinc-50')
      footerSettingsBtn.removeClass('border-blue-600 fill-blue-600')
    } else if (pageId === 'cabinet') {
      // footer
      footerTop.show()

      // show section
      cabinetSection.show()
      bloodPressureTrackerSection.hide()
      settingsSection.hide()

      // add and remove classes
      footerCabinetBtn.removeClass('border-zinc-50/0 fill-zinc-950 dark:fill-zinc-50')
      footerCabinetBtn.addClass('border-blue-600 fill-blue-600')

      footerBpTrackerBtn.addClass('border-zinc-50/0 fill-zinc-950 dark:fill-zinc-50')
      footerBpTrackerBtn.removeClass('border-blue-600 fill-blue-600')

      footerSettingsBtn.addClass('border-zinc-50/0 fill-zinc-950 dark:fill-zinc-50')
      footerSettingsBtn.removeClass('border-blue-600 fill-blue-600')
    } else if (pageId === 'settings') {
      // footer
      footerTop.hide()

      // show section
      bloodPressureTrackerSection.hide()
      cabinetSection.hide()
      settingsSection.show()

      // add and remove classes
      footerSettingsBtn.removeClass('border-zinc-50/0 fill-zinc-950 dark:fill-zinc-50')
      footerSettingsBtn.addClass('border-blue-600 fill-blue-600')

      footerCabinetBtn.addClass('border-zinc-50/0 fill-zinc-950 dark:fill-zinc-50')
      footerCabinetBtn.removeClass('border-blue-600 fill-blue-600')

      footerBpTrackerBtn.addClass('border-zinc-50/0 fill-zinc-950 dark:fill-zinc-50')
      footerBpTrackerBtn.removeClass('border-blue-600 fill-blue-600')
    } else {
      return
    }
  }


  footerBpTrackerBtn.click(function () {
    currentPage = 'bloodPressure'
    setPage('Blood Pressure tracker', currentPage)
  })

  footerCabinetBtn.click(function () {
    currentPage = 'cabinet'
    setPage('Cabinet', currentPage)
  })

  footerSettingsBtn.click(function () {
    currentPage = 'settings'
    setPage('Settings', currentPage)
  })


  // open edit blood pressure entry
  bloodPressureTrackerSection.on('click', ".blood-pressure-card-btn", function (e) {
    let cardId = $(this).data().cardid
    // open edit modal
    loadEditBloodPressureForm(cardId)
    currentBloodPressureCardId = cardId
    modalOverlay.fadeIn()
    editBpEntryModal.slideDown()
  })

});
