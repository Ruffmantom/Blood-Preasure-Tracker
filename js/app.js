const saveToLocal = () => {
  localStorage.setItem(localUserId, JSON.stringify(globalUser));
};

// render Blood Pressure Cards
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

// checking refill status
const checkUserRefills = () => {
  // check notifyDates for cabinet items and notify user of any that have a date of today or past.
  let today = getTodayString()
  globalUser.cabinet_data.forEach(item => {
    // check if notification had already been sent
    if (item.notifyDate <= today) {
      let foundLog = globalUser.notification_log.find(l => l.date === today && l.tag === item.name)
      // set needsRefill
      item.needsRefill = true
      // notify user if have not already
      if (!foundLog) {
        let message = `Time to refill your ${item.name} - ${item.strength} you have roughly ${item.daysWorth} left.`
        sendNotification(item.name, message)
        // add notification to log
        globalUser.notification_log.push({
          date: today,
          msg: message,
          tag: item.name
        })
        saveToLocal()
      }
    } else {
      item.needsRefill = false
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
      ${usersPrescriptions.length >= 1 ? `<p class="">Prescriptions</p>
          ${usersPrescriptions.map(m => (
      cabinetItemComponent(m)
    )).join('')}  
        `: ""}

      ${usersSupplements.length >= 1 ? `<p class="">Supplements</p>
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

// Load in theme
// this will be phased out since is not using tailwind sense for device settings
const loadTheme = () => {
  // set settings text
  if (globalUser.bp_theme_title === 'Dark') {
    parentToggle.removeClass('justify-start').addClass('justify-end')
  }
  settingsThemeText.text(globalUser.bp_theme_title)
};


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
    }
  }
};


userBirthdayInput.on('input', function () {
  let birthday = $(this).val()
  userYearsOld.text(`Your age: ${getAgeFromDateInput(birthday)}`)
})


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
  // save user
  saveToLocal();
  loadInSettings();
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
      // check to see if user has edited the note
      d.systolic = data.systolic
      d.diastolic = data.diastolic
      d.pulse = data.pulse
      d.notes = data.notes
    }
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
  addCabinetTypeInput.val('Medication')
  addCabinetNameInput.val('')
  addCabinetStrengthInput.val("")
  addCabinetAmountInput.val(0)
  addCabinetFrequencyInput.val(0)
  addCabinetScheduleInput.val('Daily')
  addCabinetNotesInput.val('')
  addCabinetQtyInput.val(0)
  addCabinetNotifyInput.prop('checked', false)
  addCabinetRefillLinkInput.val('')
  addCabinetPharmacyInput.val('')
}

const handleSaveCabinetItem = (data) => {
  globalUser.cabinet_data.forEach(d => {
    // find data
    if (d.id === currentCabinetCardId) {
      // check to see if user has edited the note
      d.type = data.type
      d.name = data.name
      d.strength = data.strength
      d.amount = data.amount
      d.frequency = data.frequency || 0
      d.schedule = data.schedule
      d.notes = data.notes
      d.daysWorth = data.daysWorth
      d.notifyUser = data.notifyUser
      d.refillLink = data.refillLink
      d.pharmacy = data.pharmacy
      d.notifyDate = returnRefillDate(data.daysWorth, data.amount, data.schedule)
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
  const notification = $(notificationComponent(type, text, notifyId))

  notificationContainer.prepend(notification)

  setTimeout(() => {
    notification.fadeOut(400, () => {
      notification.remove()
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

  addCabinetTypeInput.val(foundCard.type)
  addCabinetNameInput.val(foundCard.name)
  addCabinetStrengthInput.val(foundCard.strength)
  addCabinetAmountInput.val(foundCard.amount)
  addCabinetFrequencyInput.val(foundCard.frequency)
  addCabinetScheduleInput.val(foundCard.schedule)
  addCabinetNotesInput.val(foundCard.notes)
  addCabinetQtyInput.val(foundCard.daysWorth)
  addCabinetNotifyInput.prop('checked', foundCard.notifyUser);
  addCabinetRefillLinkInput.val(foundCard.refillLink)
  addCabinetPharmacyInput.val(foundCard.pharmacy)
}



$(() => {
  loadUserOrCreate();
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
    localStorage.clear("BP_TR_USER");
    // Reload the page from the server, ignoring the cache
    window.location.reload(true);
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
  bloodPressureTrackerSection.on('click', ".blood-pressure-card-btn", function () {
    let cardId = $(this).data().cardid
    // open edit modal
    loadEditBloodPressureForm(cardId)
    currentBloodPressureCardId = cardId
    modalOverlay.fadeIn()
    editBpEntryModal.slideDown()
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

      if (addCabinetQtyInput.val() <= 0) {
        addAppAlert('warning', `Please add a Available Qty if you would like to be notified.`)
      }

      if (!globalUser.allow_notifications) {
        addAppAlert('alert', 'Notifications have been turned on', 7000)
        let timeout = setTimeout(() => {
          sendNotification('enabled-notifications', 'Notifications have been enabled')
          globalUser.allow_notifications = true
          saveToLocal()
          clearTimeout(timeout)
        }, 3000);

      }
    }
  })

  // add cabinet item
  addCabinetItemBtn.click(function (e) {
    e.preventDefault()
    let isEditing = currentCabinetCardId !== ""
    let medType = addCabinetTypeInput.val()
    let medName = addCabinetNameInput.val()
    let medStrength = addCabinetStrengthInput.val()
    let medAmount = addCabinetAmountInput.val()
    let medFreq = addCabinetFrequencyInput.val()
    let medSched = addCabinetScheduleInput.val()
    let medNotes = addCabinetNotesInput.val()
    let medQty = addCabinetQtyInput.val()
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
      let newCabinetItem = new CabinetItem(medType, medName, medStrength, medAmount, medFreq, medSched, medNotes, medQty, medNotify, medRefillLink, medPharmacy)
      // add item
      globalUser.cabinet_data.push(newCabinetItem)
    } else {
      handleSaveCabinetItem({
        type: medType,
        name: medName,
        strength: medStrength,
        amount: medAmount,
        frequency: medFreq,
        schedule: medSched,
        notes: medNotes,
        daysWorth: medQty,
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

      sendNotification('enabled-notifications', 'Notifications have been enabled')
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
