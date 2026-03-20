// elements
const headerTitle = $('#header-title')
const footerTop = $('#footer-top')
const loadingOverlayLogo = $("#loading-overlay-logo")
const welcomeLogo = $("#welcome-logo")
const loadingOverlayText = $("#loading-overlay-text")
const settingsThemeText = $("#settings-theme-text")
const versionTextElm = $("#version")
const userYearsOld = $("#user-years-old")

// inputs
const addBloodPressureInput = $("#add-blood-pressure-input")
const addBloodPressurePulseInput = $("#add-blood-pressure-pulse-input")
const addBloodPressureNotesInput = $("#add-blood-pressure-notes-input")
const editBloodPressureInput = $("#edit-blood-pressure-input")
const editBloodPressurePulseInput = $("#edit-blood-pressure-pulse-input")
const editBloodPressureNotesInput = $("#edit-blood-pressure-notes-input")
const userBirthdayInput = $("#user-birthday")
// sections
const bloodPressureTrackerSection = $("#blood-pressure-tracker-section")
const cabinetSection = $("#cabinet-section")
const settingsSection = $("#settings-section")

// modals
const loadingOverlay = $("#loading-overlay")
const modalOverlay = $("#overlay")
const addBpEntryModal = $("#add-bp-entry-modal")
const editBpEntryModal = $("#edit-bp-entry-modal")
const notificationContainer = $("#notification-container")
const welcomeOverlay = $("#welcome-overlay")
// buttons
const footerBpTrackerBtn = $('#footer-bp-tracker-btn')
const footerCabinetBtn = $('#footer-cabinet-btn')
const footerSettingsBtn = $('#footer-settings-btn')
const footerAddBtn = $('#footer-add-btn')
const closeAddEntryBtn = $('#close-add-entry-btn')
const closeEditEntryBtn = $('#close-edit-entry-btn')
const addBloodPressureBtn = $('#add-blood-pressure-btn')
const bloodPressureCardBtn = $(".blood-pressure-card-btn")
const editBloodPressureSaveBtn = $("#edit-blood-pressure-save-btn")
const editBloodPressureDeleteBtn = $("#edit-blood-pressure-delete-btn")
const welcomeGetStartedBtn = $('#welcome-get-started-btn')
// classes
class BloodPressureEntry {
    constructor(
        systolic = "",
        diastolic = "",
        pulse = "",
        notes = "",
        age = 30
    ) {
        this.id = generateBPId()
        this.systolic = systolic
        this.diastolic = diastolic
        this.bloodPressureRating = categorizeBloodPressure(systolic, diastolic, age)
        this.pulse = pulse
        this.notes = notes || ""
        this.updatedAt = ""
        this.createdAt = returnIsoString()
    }
    returnId() {
        return this.id
    }
}

class CabinetItem {
    constructor(
        type = "Medication",
        name = "",
        amount = 1,
        frequency = 1,
        schedule = "Daily",
        notes = "",
        daysWorth = 0,
        notifyUser = false,
        refillLink = "",
        pharmacy = ""
    ) {
        this.id = generateBPId()
        this.type = type
        this.name = name
        this.amount = amount
        this.frequency = frequency
        this.schedule = schedule
        this.notes = notes
        this.daysWorth = daysWorth
        this.notifyUser = notifyUser
        this.refillLink = refillLink
        this.pharmacy = pharmacy
        this.updatedAt = ""
        this.createdAt = returnIsoString()
    }
    returnId() {
        return this.id
    }
}



// set all close btns
const closeBtns = $(".close-btn")
let closeBtnsArr = Array.from(closeBtns)

// set icons
closeBtnsArr.forEach(elm => {
    $(elm).html(close())
})

footerBpTrackerBtn.html(bloodPressure())
footerCabinetBtn.html(medications())
footerSettingsBtn.html(settings())
footerAddBtn.html(add())
loadingOverlayLogo.html(digitalLogo())
welcomeLogo.html(digitalLogo())



// on load before app
$(() => {
    loadingOverlay.show()
    // start loading overlay
    let loadingTimer = setTimeout(() => {
        loadingOverlay.fadeOut()
        clearTimeout(loadingTimer)
    }, 2500)
});