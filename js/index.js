// elements
const headerTitle = document.querySelector('#header-title')
const footerTop = document.querySelector('#footer-top')
// buttons
const footerBpTrackerBtn = document.querySelector('#footer-bp-tracker-btn')
const footerCabinetBtn = document.querySelector('#footer-cabinet-btn')
const footerSettingsBtn = document.querySelector('#footer-settings-btn')
const footerAddBtn = document.querySelector('#footer-add-btn')
const closeAddEntryBtn = document.querySelector('#close-add-entry-btn')

footerBpTrackerBtn.innerHTML = bloodPressure()
footerCabinetBtn.innerHTML = medications()
footerSettingsBtn.innerHTML = settings()
footerAddBtn.innerHTML = add()
closeAddEntryBtn.innerHTML = close()




// actions

// footerAddBtn.addEventListener('click', function () {
//     alert('Hello!')
// })