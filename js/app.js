const saveToLocal = () => {
  localStorage.setItem(localUserId, JSON.stringify(globalUser));
};

// render Blood Pressure Cards
const renderCards = () => {
  bloodPressureTrackerSection.empty()
  if (userLoaded && globalUser.bp_data.length >= 1) {
    let sortedCards = globalUser.bp_data.sort((a, b) => a.createdAt - b.createdAt)
    sortedCards.forEach((d) => {
      let element = bloodPressureCardComponent(d)
      bloodPressureTrackerSection.prepend(element)
    })
  } else {
    bloodPressureTrackerSection.append(`<p class="text-center">No data found</p>
      <p class="text-center">You have not added any entries yet</p>`)
  }

};

// checking refill status
const checkUserRefills = () => {
  // check notifyDates for cabinet items and notify user of any that have a date of today or past.
  let today = getTodayString()
  globalUser.cabinet_data.forEach(item => {
    if (!item.notifyUser) {
      return
    }
    // check if notification had already been sent
    if (item.needsRefill || item.tracking.refillReminderBy <= today) {
      let foundLog = globalUser.notification_log.find(l => l.date === today && l.tag === item.name)
      // set needsRefill
      item.needsRefill = true
      // notify user if have not already
      if (!foundLog) {
        let message = `Time to refill your ${item.name} - ${item.strength.value} ${item.strength.unit}.`
        sendNotification(item.name, "Refill reminder", message, globalUser)
        // create app notification
        let newAppNotification = new AppNotifications(item.name, "Refill reminder", message)
        // push new notification
        globalUser.app_notifications.push(newAppNotification)
        // add notification to log
        globalUser.notification_log.push({
          date: today,
          msg: message,
          tag: item.name,
          appNotification: newAppNotification.id
        })
        saveToLocal()
      }
    }
  })
}

// Render Cabinet Cards
const renderCabinetCards = () => {
  cabinetSection.empty()
  if (userLoaded && globalUser.cabinet_data.length >= 1) {
    // load refill statuses
    checkUserRefills()
    // filter supplements and Prescriptions
    let usersPrescriptions = globalUser.cabinet_data.filter(c => c.type === 'Medication')
    let usersSupplements = globalUser.cabinet_data.filter(c => c.type === 'Supplement')

    usersPrescriptions.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    usersSupplements.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    cabinetSection.prepend(`
      ${usersPrescriptions.length >= 1 ? `<p class="">Prescriptions ${usersPrescriptions.length}</p>
          ${usersPrescriptions.map(m => (
      cabinetItemComponent(m)
    )).join('')}  
        `: ""}

      ${usersSupplements.length >= 1 ? `<p class="">Supplements ${usersSupplements.length}</p>
          ${usersSupplements.map(s => (
      cabinetItemComponent(s)
    )).join('')}  
        `: ""}
      `)
  } else {
    cabinetSection.append(`<p class="text-center">No data found</p>
      <p class="text-center">You have not added any cabinet items yet</p>`)
  }
};

// load in all notifications
const renderAppNotifications = () => {
  notificationsSection.empty()
  // check if there are un read ones and if so show button at top
  let num = 0
  globalUser.app_notifications.forEach(n => {
    if (!n.read) {
      num++
    }
  })

  if (num >= 2 && currentAppSection === "notifications") {
    // show mark all as read btn
    notificationsMarkAllReadBtn.show()
  }

  // render the footer button
  if (num >= 1) {
    footerNotificationBtnPing.show()
  } else {
    footerNotificationBtnPing.hide()
  }

  if (globalUser.app_notifications.length >= 1) {
    let todaysIso = returnIsoString()
    let yesterdaysIso = returnIsoString(true)
    let lastWeeksIso = returnIsoString(false, true)

    // check dates and archive
    globalUser.app_notifications.forEach(n => {
      if (n.createdAt < lastWeeksIso) {
        n.status = 'archived'
      }
    })
    saveToLocal()
    // collect all viewable ones
    let viewableNotifications = globalUser.app_notifications.filter(n => n.status !== 'archived').sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    // render out recent, yesterdays, and a while ago
    const todaysNotifications = viewableNotifications.filter(n => n.createdAt.split('T')[0] === todaysIso.split("T")[0])
    const yesterdaysNotifications = viewableNotifications.filter(n => n.createdAt.split('T')[0] === yesterdaysIso.split("T")[0])
    const beyondNotifications = viewableNotifications.filter(n => n.createdAt.split('T')[0] < yesterdaysIso.split("T")[0])

    notificationsSection.append(`
  ${todaysNotifications.length >= 1 ? `<p>Today</p>
    ${todaysNotifications.map(n => (
      notificationItemComponent(n)
    )).join("")}
    `: ""}
  ${yesterdaysNotifications.length >= 1 ? `<p>Yesterday</p>
    ${yesterdaysNotifications.map(n => (
      notificationItemComponent(n)
    )).join("")}
    `: ""}
  ${beyondNotifications.length >= 1 ? `<p>Beyond</p>
    ${beyondNotifications.map(n => (
      notificationItemComponent(n)
    )).join("")}
    `: ""}
  `)

  } else {
    notificationsSection.append(`
      <p class="text-center">You have no new notifications</p>   
      `)
  }
}

notificationsMarkAllReadBtn.click(e => {
  e.preventDefault()
  globalUser.app_notifications.forEach(n => {
    n.read = true
  })
  saveToLocal()
  renderAppNotifications()
})

// Load in theme
// this will be phased out since is not using tailwind sense for device settings
const loadTheme = () => {
  // set settings text
  if (globalUser.bp_theme_title === 'Dark') {
    parentToggle.removeClass('justify-start').addClass('justify-end')
  }
  settingsThemeText.text(globalUser.bp_theme_title)
};

// toggle cabinet tracking inputs
const toggleCabinetTrackingInputs = (show) => {
  if (show) {
    // hide qty and started date and notify
    addCabinetItemTrackingQtyAndStartedCont.show()
    addCabinetItemTrackingNotifyCont.show()
  } else {
    addCabinetItemTrackingQtyAndStartedCont.hide()
    addCabinetItemTrackingNotifyCont.hide()
  }
}


// this will be phased out since is not using tailwind sense for device settings
themeToggleHandlerBtn.click(function () {
  if (globalUser.bp_theme_title === 'Light') {
    // left to right
    parentToggle.removeClass('justify-start').addClass('justify-end')
    globalUser.bp_theme_title = 'Dark'
  } else {
    // right side to left
    parentToggle.removeClass('justify-end').addClass('justify-start')
    globalUser.bp_theme_title = 'Light'
  }
  saveToLocal()
  settingsThemeText.text(globalUser.bp_theme_title)
})

// Load in the settings info and values
const loadInSettings = () => {
  // set settings
  settingsAllowNotifyInput.prop('checked', globalUser.allow_notifications)
  settingsNotifyTakeBpInput.prop('checked', globalUser.notifyUser_take_bp)
  settingsNotifyTakeBpTimeBlock.show()
  settingsUsersAge.text(globalUser.userAge)
  // set version
  versionTextElm.text(appVersion)
}


// load program
const loadUserOrCreate = () => {
  // check local storage, if no user then create
  let localUser = localStorage.getItem(localUserId);
  if (localUser === null || localUser === undefined) {
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
      if (globalUser.bp_theme_title === undefined || globalUser.bp_theme_title === null) {
        // add variable and save
        globalUser.bp_theme_title = prefersDarkScheme ? "Dark" : "Light"; // default go to users choice
        //save to local
        saveToLocal();
      }
      // load dom
      loadTheme();
      loadInSettings();
      renderCards();
      renderCabinetCards();
      renderAppNotifications()
    }
  }
};


userBirthdayInput.on('input', function () {
  let birthday = $(this).val()
  userYearsOld.text(`Your age: ${getAgeFromDateInput(birthday)}`)
})

// getting started welcome
welcomeGetStartedBtn.on('click', function (e) {
  e.preventDefault()
  let birthday = userBirthdayInput.val()
  if (!birthday) {
    addAppAlert('danger', "Please input your birthday to help get accurate feedback.")
    return
  }

  // set user birthday and age
  globalUser.userAge = getAgeFromDateInput(birthday)
  globalUser.userBirthday = birthday
  globalUser.userStatus = 'ready'

  // create welcome notification
  let newNotification = new AppNotifications('welcome', "Welcome!", `Thank you for choosing to use BPT to be your go to app for blood pressure tracking! It is an honor you are using our app over many others on the web. We hope that this can be a solid place for you to keep track of all the important things. Please let us know your feedback to help improve this app. Click the button below to do a quick 2 min survey if interested, thank you!`, "#", 'Give Feedback')
  globalUser.app_notifications.push(newNotification)

  // save user
  saveToLocal();
  loadInSettings();
  renderAppNotifications()
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
      // update record
      d.systolic = data.systolic
      d.diastolic = data.diastolic
      d.pulse = data.pulse
      d.notes = data.notes
      d.updatedAt = returnIsoString()
    }
  })

  // save
  saveToLocal()
  // render dom
  renderCards()
  // close edit modal
  modalOverlay.fadeOut()
  editBpEntryModal.slideUp(() => {
    // clear state
    currentBloodPressureCardId = ''
    // clear inputs
    editBloodPressureInput.val('')
    editBloodPressurePulseInput.val('')
    editBloodPressureNotesInput.val('')
  })
}

const toggleAddEditCabinetItemForm = function () {
  if (currentCabinetCardId) {
    addEditCabinetFormTitle.text('Edit Cabinet Item')
    addCabinetItemBtn.text('Save')
    deleteCabinetItemBtn.show()
  } else {
    addEditCabinetFormTitle.text('Add Cabinet Item')
    addCabinetItemBtn.text('Add Item')
    deleteCabinetItemBtn.hide()
  }
}

const resetCabinetForm = () => {
  addCabinetNameInput.val('')
  addCabinetTypeInput.val('Medication')
  addCabinetFormInput.val("Pill")
  addCabinetStrengthInput.val(0)
  addCabinetStrengthUnitInput.val("mg")
  addCabinetAmountInput.val(0)
  addCabinetScheduleInput.val('Daily')
  addCabinetNotesInput.val('')
  addCabinetReceivedQtyInput.val(0)
  addCabinetStartedInput.val('')
  addCabinetNotifyInput.prop('checked', false)
  addCabinetRefillLinkInput.val('')
  addCabinetPharmacyInput.val('')
  // bring back the tracking portion if removed
  toggleCabinetTrackingInputs(true)
}

const handleSaveCabinetItem = (data) => {
  globalUser.cabinet_data.forEach(d => {
    // find data
    if (d.id === currentCabinetCardId) {
      // check to see if user has edited the note
      d.type = data.type
      d.name = data.name
      d.form = data.form
      d.strength.value = data.strength
      d.strength.unit = data.strengthUnit
      d.dose.value = data.amount
      d.dose.schedule = data.schedule
      d.notes = data.notes
      d.tracking.startDate = data.startDate
      d.tracking.startQty = data.receivedQty
      d.notifyUser = data.notifyUser
      d.refillLink = data.refillLink
      d.pharmacy = data.pharmacy
      d.notifyDate = returnRefillDate(data.startDate, data.receivedQty, data.amount, data.schedule)
    }
  })
  // save to local
  saveToLocal()
  // render cards
  renderCabinetCards()
  // close edit modal
  modalOverlay.fadeOut()
  editBpEntryModal.slideUp(() => {
    // clear inputs
    resetCabinetForm()
    // reset form to add
    toggleAddEditCabinetItemForm()
    // clear state
    currentCabinetCardId = ""
  })
}

const addAppAlert = (type, text, time = 5000) => {
  const notifyId = generateBPId()
  const alert = $(appAlertComponent(type, text, notifyId))

  appAlertContainer.prepend(alert)

  setTimeout(() => {
    alert.fadeOut(400, () => {
      alert.remove()
    })
  }, time)
}


// handle loading Blood pressure edit form
const loadEditBloodPressureForm = (cardId) => {
  let foundCard = globalUser.bp_data.find(d => d.id === cardId)

  if (!foundCard) {
    addAppAlert('danger', 'There was an error loading this Blood Pressure reading, please reload the app.')
    return
  }
  editBloodPressureInput.val(`${foundCard.systolic}/${foundCard.diastolic}`)
  editBloodPressurePulseInput.val(foundCard.pulse)
  editBloodPressureNotesInput.val(foundCard.notes)
}

// handle loading Cabinet Card edit form
const loadEditCabinetCardForm = (cardId) => {
  let foundCard = globalUser.cabinet_data.find(d => d.id === cardId)

  if (!foundCard) {
    addAppAlert('danger', 'There was an error loading this Cabinet item. Please reload the app.')
    return
  }

  if (foundCard.form === 'Powder' || foundCard.dose.schedule === 'As needed') {
    toggleCabinetTrackingInputs(false)
  }

  addCabinetTypeInput.val(foundCard.type)
  addCabinetNameInput.val(foundCard.name)
  addCabinetFormInput.val(foundCard.form)
  addCabinetStrengthInput.val(foundCard.strength.value)
  addCabinetStrengthUnitInput.val(foundCard.strength.unit)
  addCabinetAmountInput.val(foundCard.dose.value)
  addCabinetScheduleInput.val(foundCard.dose.schedule)
  addCabinetNotesInput.val(foundCard.notes)
  addCabinetReceivedQtyInput.val(foundCard.tracking.startQty)
  addCabinetStartedInput.val(foundCard.tracking.startDate)
  addCabinetNotifyInput.prop('checked', foundCard.notifyUser);
  addCabinetRefillLinkInput.val(foundCard.refillLink)
  addCabinetPharmacyInput.val(foundCard.pharmacy)
}

// toggle footer button classes
const toggleCurrentPage = (currentButton, currentSection, title) => {
  // set State
  currentAppSection = title
  // section title map
  const sectionTitleMap = {
    bloodPressure: "Blood Pressure Tracker",
    cabinet: "Cabinet",
    settings: "Settings",
    notifications: "Notifications",
  }
  headerTitle.text(sectionTitleMap[title])
  // set all other buttons inactive
  let allFooterBtns = Array.from($('.footer-btn'))
  let allSections = Array.from($('.section-container'))
  allFooterBtns.forEach(btn => {
    $(btn).addClass('border-zinc-50/0 fill-zinc-950 dark:fill-zinc-50')
    $(btn).removeClass('border-blue-600 fill-blue-600')
  })
  allSections.forEach(section => {
    $(section).hide()
  })
  // set current
  $(currentSection).show()
  $(currentButton).removeClass('border-zinc-50/0 fill-zinc-950 dark:fill-zinc-50')
  $(currentButton).addClass('border-blue-600 fill-blue-600')

  if (title === 'notifications') {
    renderAppNotifications()
  }
}

// set and load page
const setPage = (pageId) => {
  if (pageId === 'bloodPressure') {
    // footer add
    footerTop.show()
    // add and remove classes
    toggleCurrentPage(footerBpTrackerBtn, bloodPressureTrackerSection, pageId)
  } else if (pageId === 'cabinet') {
    // footer add
    footerTop.show()
    // add and remove classes
    toggleCurrentPage(footerCabinetBtn, cabinetSection, pageId)
  } else if (pageId === 'settings') {
    // footer Add
    footerTop.hide()
    // add and remove classes
    toggleCurrentPage(footerSettingsBtn, settingsSection, pageId)
  } else if (pageId === 'notifications') {

    // footer Add
    footerTop.hide()
    // add and remove classes
    toggleCurrentPage(footerNotificationsBtn, notificationsSection, pageId)
  } else {
    return
  }
}

$(() => {
  loadUserOrCreate();
  // new input for systolic and diastolic
  // formats the value inside of these inputs
  addBloodPressureInput.on("input", handleSysAndDiaFormat);
  editBloodPressureInput.on("input", handleSysAndDiaFormat);

  // add create entry
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

    // check if first entry
    if (globalUser.bp_data.length === 0 && !globalUser.has_created_first_reading) {
      let newNotification = new AppNotifications('first-bp-reading', 'Great Job!', 'You created your first Blood Pressure Reading! Keep it going so you can really take charge in your blood pressure management!')
      globalUser.app_notifications.push(newNotification)
      globalUser.has_created_first_reading = true

      renderAppNotifications()
    }

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


  // download data
  copyBloodPressureDataBtn.on("click", (e) => {
    let date = new Date().toISOString();
    let dateName = formatDate(date);
    let formattedName = dateName.split(" ")[0].replace(/\//g, "-");
    if (!globalUser.bp_data.length >= 1) {
      addAppAlert('warning', 'There are no entries to download. Time to start tracking your blood pressure!')
      return
    }

    downloadTxt(globalUser.bp_data, `BP-${formattedName}.txt`);
    addAppAlert('alert', 'Data has been downloaded as a text document!')
  });

  // clear all data
  clearAllDataBtn.on("click", (e) => {
    e.preventDefault()
    modalOverlay.fadeIn()
    confirmClearDataModal.fadeIn()
  });

  closeConfirmClearBtn.on('click', (e) => {
    e.preventDefault()
    modalOverlay.fadeOut()
    confirmClearDataModal.fadeOut()
  })

  confirmClearAllDataBtn.on("click", (e) => {
    e.preventDefault()
    // clear user
    localStorage.clear(localUserId);
    addAppAlert('alert', "All data has been successfully cleared. You may now close the app or wait for it to re-load.")

    setTimeout(() => {
      // Reload the page from the server, ignoring the cache
      window.location.reload(true);
    }, 5000)
  });



  editBloodPressureSaveBtn.on("click", (e) => {
    e.preventDefault()

    var bothSysAndDia = editBloodPressureInput.val();
    var pulseElmVal = editBloodPressurePulseInput.val();
    var noteElmVal = editBloodPressureNotesInput.val();
    let sys = parseInt(bothSysAndDia.split("/")[0]);
    let dia = parseInt(bothSysAndDia.split("/")[1]);
    let editFormData = {
      systolic: sys,
      diastolic: dia,
      pulse: parseInt(pulseElmVal),
      notes: noteElmVal,
    }

    handleSaveRecord(editFormData)
  })

  editBloodPressureDeleteBtn.on("click", (e) => {
    handleDeleteRecord()
  })


  // actions
  footerAddBtn.click(() => {
    if (currentAppSection === 'bloodPressure') {
      modalOverlay.fadeIn()
      addBpEntryModal.slideDown()
    } else {
      modalOverlay.fadeIn()
      addCabinetItemModal.slideDown()
      // scroll edit form to top
      cabinetFormOverflow.animate({
        scrollTop: 0
      }, 'fast');
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

  closeAddCabinetItemBtn.click(() => {
    // clear editing variable
    modalOverlay.fadeOut()
    addCabinetItemModal.slideUp(() => {
      currentCabinetCardId = ''
      toggleAddEditCabinetItemForm()
      resetCabinetForm()
    })
  })

  closeChangeAgeModalBtn.click(() => {
    modalOverlay.fadeOut()
    changeAgeModal.slideUp()
  })

  openUpdateUserBirthdayBtn.click((e) => {
    e.preventDefault()
    modalOverlay.fadeIn()
    changeAgeModal.slideDown()
    // set value of birthday
    updateUserBirthdayInput.val(globalUser.userBirthday)
  })


  // footer navigation
  footerBtn.click(function (e) {
    e.preventDefault()
    let sectionId = $(this).data().sectionid
    setPage(sectionId)
  })

  // open edit blood pressure entry
  bloodPressureTrackerSection.on('click', ".blood-pressure-card-btn", function () {
    let cardId = $(this).data().cardid
    // open edit modal
    loadEditBloodPressureForm(cardId)
    currentBloodPressureCardId = cardId
    modalOverlay.fadeIn()
    editBpEntryModal.slideDown()
  })

  notificationsSection.on('click', ".notification-btn", function () {
    let notificationId = $(this).data().notificationid
    let foundNotification = globalUser.app_notifications.find(n => n.id === notificationId)
    // don't need to render dom if already read
    if (foundNotification.read) {
      return
    }

    globalUser.app_notifications.forEach(n => {
      if (n.id === notificationId) {
        n.read = true
      }
    })

    saveToLocal()
    renderAppNotifications()
  })

  // open edit blood pressure entry
  cabinetSection.on('click', ".cabinet-item-card-btn", function () {
    let cardId = $(this).data().cardid
    // scroll edit form to top
    cabinetFormOverflow.animate({
      scrollTop: 0
    }, 'fast');
    // open edit modal
    loadEditCabinetCardForm(cardId)
    currentCabinetCardId = cardId
    // modify the form to look like edit
    toggleAddEditCabinetItemForm()
    // open up form
    modalOverlay.fadeIn()
    addCabinetItemModal.slideDown()
  })

  // reset refill
  cabinetSection.on('click', ".cabinet-item-reset-refill-btn", function (e) {
    let id = $(this).data().itemid
    globalUser.cabinet_data.forEach(item => {
      if (item.id === id) {
        item.daysWorth = item.originalQty
        item.needsRefill = false
        item.notifyDate = returnRefillDate(item.originalQty, item.amount, item.schedule)
      }
    })

    saveToLocal()
    renderCabinetCards()
  })

  // update users birthday
  updateUserBirthdayBtn.click(function (e) {
    e.preventDefault()
    let newBirthday = updateUserBirthdayInput.val()
    if (newBirthday === globalUser.userBirthday) {
      return
    }
    // update
    globalUser.userAge = getAgeFromDateInput(newBirthday)
    globalUser.userBirthday = newBirthday
    // save
    saveToLocal()
    // update setting text
    settingsUsersAge.text(globalUser.userAge)
    // close modal
    modalOverlay.fadeOut()
    changeAgeModal.slideUp()
  })

  // add case for refill notifications on "As needed"
  addCabinetNotifyInput.on('input', () => {
    if (addCabinetNotifyInput.is(':checked')) {
      if (addCabinetScheduleInput.val() === 'As needed') {
        addAppAlert('warning', `You have "As needed" selected. Please choose a different schedule to enable refill notifications.`)
      }

      if (addCabinetReceivedQtyInput.val() <= 0) {
        addAppAlert('warning', `Please add a received QTY if you would like to be notified for refill.`)
      }

      if (!globalUser.allow_notifications) {
        addAppAlert('alert', 'Notifications have been turned on', 7000)
        let timeout = setTimeout(() => {
          sendNotification('enabled-notifications', 'Notifications', 'Notifications have been successfully enabled!', globalUser)
          globalUser.allow_notifications = true
          saveToLocal()
          clearTimeout(timeout)
        }, 3000);

      }
    }
  })


  // add check for powder
  addCabinetFormInput.on('input', () => {
    if (addCabinetFormInput.val() === "Powder" || addCabinetScheduleInput.val() === 'As needed') {
      toggleCabinetTrackingInputs(false)
    } else {
      toggleCabinetTrackingInputs(true)
    }
  })

  // add check for as needed
  addCabinetScheduleInput.on('input', () => {
    if (addCabinetScheduleInput.val() === 'As needed' || addCabinetFormInput.val() === "Powder") {
      // hide qty and started date and notify
      toggleCabinetTrackingInputs(false)
    } else {
      toggleCabinetTrackingInputs(true)
    }
  })



  // add cabinet item
  addCabinetItemBtn.click(function (e) {
    e.preventDefault()
    let isEditing = currentCabinetCardId !== ""
    let medType = addCabinetTypeInput.val()
    let medForm = addCabinetFormInput.val()
    let medName = addCabinetNameInput.val()
    let medStrength = addCabinetStrengthInput.val()
    let medStrengthUnit = addCabinetStrengthUnitInput.val()
    let medAmount = addCabinetAmountInput.val()
    let medSched = addCabinetScheduleInput.val()
    let medNotes = addCabinetNotesInput.val()
    let medQty = addCabinetReceivedQtyInput.val()
    let medStartDate = addCabinetStartedInput.val()
    let medNotify = addCabinetNotifyInput.is(':checked')
    let medRefillLink = addCabinetRefillLinkInput.val()
    let medPharmacy = addCabinetPharmacyInput.val()

    if (!medName) {
      addAppAlert('danger', `Please enter a name before ${isEditing ? "saving" : "adding"} a cabinet item.`)
      return
    }

    // check if link is valid
    if (medRefillLink) {
      let isLinkValid = checkLinkIsValid(medRefillLink)
      if (!isLinkValid) {
        addAppAlert('danger', 'Please enter a valid refill link.')
        return
      }
    }

    if (medNotify && medQty <= 0) {
      addAppAlert('warning', `Please add a Available Qty if you would like to be notified.`)
      return
    }

    if (medNotify && medSched === "As needed") {
      addAppAlert('warning', `You have "As needed" selected. Please choose a different schedule to enable refill notifications.`)
      return
    }

    if (!isEditing) {
      let newCabinetItem = new CabinetItem(
        medType,
        medName,
        medForm,
        medStrength,
        medStrengthUnit,
        medAmount,
        medSched,
        medNotes,
        medQty,
        medStartDate,
        medNotify,
        medRefillLink,
        medPharmacy,
      )
      // add item
      globalUser.cabinet_data.push(newCabinetItem)
    } else {
      handleSaveCabinetItem({
        type: medType,
        name: medName,
        form: medForm,
        strength: medStrength,
        strengthUnit: medStrengthUnit,
        amount: medAmount,
        schedule: medSched,
        notes: medNotes,
        receivedQty: medQty,
        startDate: medStartDate,
        notifyUser: medNotify,
        refillLink: medRefillLink,
        pharmacy: medPharmacy
      })
    }
    // save
    saveToLocal()
    // render cards
    renderCabinetCards()

    // close modals
    modalOverlay.fadeOut()
    addCabinetItemModal.slideUp(() => {
      // return form to add
      toggleAddEditCabinetItemForm()
      resetCabinetForm()
    })
  })

  // delete cabinet item
  deleteCabinetItemBtn.click(function () {
    if (!currentCabinetCardId) {
      addAppAlert('danger', 'There was an issue deleting this item. Please reload the app and try again.')
      return
    }
    globalUser.cabinet_data = globalUser.cabinet_data.filter(d => d.id !== currentCabinetCardId)
    // render cards
    renderCabinetCards()
    // save to local
    saveToLocal()
    // clear state
    currentCabinetCardId = ""
    // close modal
    modalOverlay.fadeOut()
    addCabinetItemModal.slideUp(() => {
      // return form to add
      toggleAddEditCabinetItemForm()
      resetCabinetForm()
    })
  })

  // set up notifications
  settingsAllowNotifyInput.on('input', function () {
    if (!globalUser.allow_notifications) {
      // turn on
      globalUser.allow_notifications = true
      saveToLocal()

      sendNotification('enabled-notifications', 'Notifications', 'Notifications have been successfully enabled!', globalUser)
    } else {
      globalUser.allow_notifications = false
      saveToLocal()
    }
  })

  // set up Reminder for checking blood pressure
  settingsNotifyTakeBpInput.on('input', function () {
    if (settingsNotifyTakeBpInput.is(':checked')) {
      settingsNotifyTakeBpTimeBlock.show()
      globalUser.notifyUser_take_bp = true
      saveToLocal()
    } else {
      globalUser.notifyUser_take_bp = false
      saveToLocal()
      settingsNotifyTakeBpTimeBlock.hide()
    }

  })

  // phased out for now since no backend
  settingsNotifyTakeBpTimeInput.on('input', function () {
    globalUser.notifyUser_take_bp_when = settingsNotifyTakeBpTimeInput.val()
    saveToLocal()
  })

});
