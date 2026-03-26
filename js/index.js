// variables
let appVersion = "2.0.4";
const localUserId = 'O1LHQAMLTTIUVI2USHPGZOKKAJOVU4PCCBKF26Q7ZRNNHK496PPOV9THXRRGXEKH7T6M8WDXNKYLIDSWHQFMMSPWHCRLBPJKJ4YM'
// pages are bloodPressure, cabinet, settings
let currentPage = 'bloodPressure'

// State
let globalUser = null;
let userLoaded = false;
let activeModalDataNote = ""
let activeModalDataId = ""
let currentBloodPressureCardId = ''
let currentCabinetCardId = ''
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
const defaultUser = {
    userAge: "",
    userBirthday: "",
    bp_theme_title: prefersDarkScheme ? "Dark" : "Light",
    bp_data: [],
    cabinet_data: [],
    userStatus: "setup",
    allow_notifications: false,
    notification_log: [],
    app_notifications: []
};


// elements
const headerTitle = $('#header-title')
const footerTop = $('#footer-top')
const loadingOverlayLogo = $("#loading-overlay-logo")
const welcomeLogo = $("#welcome-logo")
const loadingOverlayText = $("#loading-overlay-text")
const settingsThemeText = $("#settings-theme-text")
const versionTextElm = $("#version")
const userYearsOld = $("#user-years-old")
const settingsUsersAge = $("#settings-users-age")
const addEditCabinetFormTitle = $("#add-edit-cabinet-form-title")
const cabinetFormOverflow = $("#cabinet-form-overflow")
const settingsNotifyTakeBpTimeBlock = $("#settings-notify-take-bp-time-block")
const addCabinetItemTrackingQtyAndStartedCont = $("#add-cabinet-item-tracking-qty-and-started-cont")
const addCabinetItemTrackingNotifyCont = $("#add-cabinet-item-tracking-notify-cont")
const notificationCheckMark = $("#notification-check-mark")

// inputs
const addBloodPressureInput = $("#add-blood-pressure-input")
const addBloodPressurePulseInput = $("#add-blood-pressure-pulse-input")
const addBloodPressureNotesInput = $("#add-blood-pressure-notes-input")
const editBloodPressureInput = $("#edit-blood-pressure-input")
const editBloodPressurePulseInput = $("#edit-blood-pressure-pulse-input")
const editBloodPressureNotesInput = $("#edit-blood-pressure-notes-input")
const userBirthdayInput = $("#user-birthday")

const addCabinetNameInput = $('#add-cabinet-name-input')
const addCabinetTypeInput = $('#add-cabinet-type-input')
const addCabinetFormInput = $('#add-cabinet-form-input')
const addCabinetStrengthInput = $('#add-cabinet-strength-input')
const addCabinetStrengthUnitInput = $('#add-cabinet-unit-input')
const addCabinetAmountInput = $('#add-cabinet-amount-input')
const addCabinetScheduleInput = $('#add-cabinet-schedule-input')
const addCabinetNotesInput = $('#add-cabinet-notes-input')
const addCabinetReceivedQtyInput = $('#add-cabinet-qty-input')
const addCabinetStartedInput = $('#add-cabinet-started-input')
const addCabinetNotifyInput = $('#add-cabinet-notify-input')
const addCabinetRefillLinkInput = $('#add-cabinet-refill-link-input')
const addCabinetPharmacyInput = $('#add-cabinet-pharmacy-input')

const updateUserBirthdayInput = $('#update-user-birthday-input')
// settings
const settingsAllowNotifyInput = $("#settings-allow-notify-input")
const settingsNotifyTakeBpInput = $("#settings-notify-take-bp-input")
const settingsNotifyTakeBpTimeInput = $("#settings-notify-take-bp-time-input")

// sections
const bloodPressureTrackerSection = $("#blood-pressure-tracker-section")
const cabinetSection = $("#cabinet-section")
const settingsSection = $("#settings-section")
const notificationsSection = $("#notifications-section")

// modals
const loadingOverlay = $("#loading-overlay")
const modalOverlay = $("#overlay")
const addBpEntryModal = $("#add-bp-entry-modal")
const editBpEntryModal = $("#edit-bp-entry-modal")
const notificationContainer = $("#notification-container")
const welcomeOverlay = $("#welcome-overlay")
const addCabinetItemModal = $("#add-cabinet-item-modal")
const changeAgeModal = $('#change-age-modal')
const confirmClearDataModal = $("#confirm-clear-data-modal")

// buttons
const footerBpTrackerBtn = $('#footer-bp-tracker-btn')
const footerCabinetBtn = $('#footer-cabinet-btn')
const footerSettingsBtn = $('#footer-settings-btn')
const footerNotificationsBtn = $('#footer-notifications-btn')
const footerAddBtn = $('#footer-add-btn')
const closeAddEntryBtn = $('#close-add-entry-btn')
const closeEditEntryBtn = $('#close-edit-entry-btn')
const addBloodPressureBtn = $('#add-blood-pressure-btn')
const bloodPressureCardBtn = $(".blood-pressure-card-btn")
const cabinetItemCardBtn = $(".cabinet-item-card-btn")
const editBloodPressureSaveBtn = $("#edit-blood-pressure-save-btn")
const editBloodPressureDeleteBtn = $("#edit-blood-pressure-delete-btn")
const welcomeGetStartedBtn = $('#welcome-get-started-btn')
const closeBtns = $(".close-btn")
const closeAddCabinetItemBtn = $("#close-add-cabinet-item-btn")
const closeChangeAgeModalBtn = $('#close-change-age-modal-btn')
const updateUserBirthdayBtn = $('#update-user-birthday-btn')
const openUpdateUserBirthdayBtn = $('#open-update-user-birthday-btn')
const addCabinetItemBtn = $('#add-cabinet-item-btn')
const deleteCabinetItemBtn = $('#delete-cabinet-item-btn')
const closeConfirmClearBtn = $("#close-confirm-clear-btn")
const confirmClearAllDataBtn = $("#confirm-clear-all-data-btn")
const footerBtn = $('.footer-btn')
const notificationsMarkAllReadBtn = $('#notifications-mark-all-read-btn')
// toggle
const themeToggleHandlerBtn = $('#theme-toggle-handler-btn')
const parentToggle = $('#parent-toggle')
const innerToggle = $('#inner-toggle')

//settings btns
const copyBloodPressureDataBtn = $('#copy-blood-pressure-data-btn')
const clearAllDataBtn = $('#clear-all-data-btn')

// classes
class BloodPressureEntry {
    constructor(
        systolic = 0,
        diastolic = 0,
        pulse = 0,
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
        type = "Prescriptions",
        name = "",
        form = "pill",
        strength = 0,
        strengthUnit = "mg",
        amount = 0,
        schedule = "Daily",
        notes = "",
        receivedQty = 0,
        dateStarted = "",
        notifyUser = false,
        refillLink = "",
        pharmacy = ""
    ) {
        this.id = generateBPId()
        this.name = name
        this.type = type
        this.form = form
        this.strength = {
            value: strength,
            unit: strengthUnit
        }
        this.dose = {
            value: amount,
            schedule: schedule
        }
        this.notes = notes
        this.tracking = {
            startDate: dateStarted,
            startQty: receivedQty, // reset refill will override this
            refillReminderBy: returnRefillDate(dateStarted, receivedQty, amount, schedule)
        }
        this.refillLink = refillLink
        this.pharmacy = pharmacy
        this.notifyUser = notifyUser
        this.needsRefill = false // this is to render the refill btn on the card
        this.createdAt = returnIsoString()
    }
    returnId() {
        return this.id
    }
}

class AppNotifications {
    constructor(
        tag = "",
        title = "",
        message = "",
        link = "",
    ) {
        this.id = generateBPId()
        this.tag = tag
        this.title = title
        this.message = message
        this.read = false
        this.link = link
        this.createdAt = returnIsoString()
    }
}



// set all close btns

let closeBtnsArr = Array.from(closeBtns)

// set icons
closeBtnsArr.forEach(elm => {
    $(elm).html(close())
})

footerBpTrackerBtn.html(bloodPressure())
footerCabinetBtn.html(medications())
footerSettingsBtn.html(settings())
footerNotificationsBtn.html(bell())
footerAddBtn.html(add())
loadingOverlayLogo.html(digitalLogo())
welcomeLogo.html(digitalLogo())
notificationCheckMark.html(check())



// on load before app
$(() => {
    loadingOverlay.show()
    // start loading overlay
    let loadingTimer = setTimeout(() => {
        loadingOverlay.fadeOut()
        clearTimeout(loadingTimer)
    }, 2500)
});