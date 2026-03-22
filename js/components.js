const welcomeModal = () => {
  return `
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



const bloodPressureCardComponent = (data) => {
  let formattedCreatedAt = formatDate(data.updatedAt || data.createdAt)
  return `
  <div class="p-3 flex gap-2 bg-zinc-50 dark:bg-zinc-900 dark:text-white rounded-md relative">
    <div data-cardid="${data.id}" class="blood-pressure-card-btn absolute top-0 left-0 w-full h-full" ></div>
    <div class="flex flex-col grow-1 gap-1">
      <p class="text-xs py-[2px] px-[6px] rounded-sm ${data.bloodPressureRating === "High" ? "bg-red-600" : data.bloodPressureRating === "low" ? "bg-orange-600" : "bg-blue-600"} text-white w-max">${data.bloodPressureRating}</p>
      <p class="text-xs">${formattedCreatedAt}</p>
      <p class="truncate-2-lines w-full">${data.notes ? `"${data.notes}"` : ""}</p>
    </div>
    <div class="py-1 px-2 flex flex-col text-right rounded-sm bg-zinc-200 dark:bg-zinc-800 whitespace-nowrap">
      <p class="text-3xl text-digital tracking-widest">${data.systolic}</p>
      <p class="text-3xl text-digital tracking-widest">${data.diastolic}</p>
      <p class="text-digital tracking-widest">PULSE ${data.pulse}</p>
    </div>
  </div>
  `
}

const notificationComponent = (type = '', text = '', id = '') => {
  let color = 'zinc'
  if (type === 'danger') {
    color = 'red'
  } else if (type === 'alert') {
    color = 'blue'
  } else {
    color = 'zinc'
  }

  return `
    <div data-notifiactionid="${id}" class="notification-card bg-${color}-50 border-1 border-${color}-600 p-4 rounded-md z-50">
      <p class="text-${color}-600">${text}</p>
    </div>
  `
}

const cabinetItemComponent = (data) => {
  /*
    data.id
    data.type
    data.name
    data.strength
    data.amount
    data.frequency
    data.schedule
    data.notes
    data.daysWorth
    data.notifyUser
    data.refillLink
    data.pharmacy
    data.updatedAt
    data.createdAt
  */

  const formatFrequency = () => {
    /*
      data.amount
      data.frequency
      data.schedule
    */
  }

  return `
    <div class="relative flex flex-col gap-2 p-3 rounded-md bg-zinc-50 border-1 border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-50">
      <div class="relative flex flex-col gap-2">
      <div data-cardid="${data.id}" class="cabinet-item-card-btn absolute top-0 left-0 w-full h-full"></div>
      <div class="flex justify-between">
        <div class="flex gap-2 items-center dark:fill-zinc-50 fill-zinc-950">
            ${data.type === "Supplement" ? leaf() : pill()}
            <p class="text-xs">${data.type}</p>
        </div>
        ${data.notifyUser ? `<p class="text-xs text-green-600">Refill reminder</p>` : ""}
      </div>
      <p class="text-xl font-bold">${data.name} - ${data.strength}</p>
      <p class="text-sm">${data.daysWorth} days remaining</p>
      <p class="text-sm">${data.amount} - ${data.frequency} time ${data.schedule}</p>
      ${data.notes ? `<p class="text-sm">"${data.notes}"</p>` : ""}
      ${data.pharmacy ? `<p class="text-sm">${data.pharmacy}</p>` : ""}
</div>
      ${data.refillLink ? `<a href="${data.refillLink}" id="edit-blood-pressure-save-btn" class="p-3 bg-zinc-200 dark:bg-zinc-800 text-white w-full text-center rounded-sm">Refill</a>` : ""}
    </div>
  
  `
}