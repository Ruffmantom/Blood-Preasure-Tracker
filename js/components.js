const bloodPressureCardComponent = (data) => {
  let formattedCreatedAt = formatDate(data.updatedAt || data.createdAt)
  return `
  <div class="p-3 flex gap-2 bg-zinc-50 dark:bg-zinc-900 dark:text-white border-1 border-zinc-200
dark:border-zinc-800 rounded-md relative">
    <div data-cardid="${data.id}" class="blood-pressure-card-btn absolute top-0 left-0 w-full h-full"></div>
    <div class="flex flex-col grow-1 gap-1">
      <p class="text-xs py-[2px] px-[6px] rounded-sm ${data.bloodPressureRating === "High" ? "bg-red-600" : data.bloodPressureRating === "Low" ? "bg-orange-500" : "bg-blue-600"} text-white w-max">${data.bloodPressureRating}</p>
      <p class="text-xs">${data.updatedAt ? `Updated: ${formattedCreatedAt}` : formattedCreatedAt}</p>
      <p class="truncate-2-lines w-full">${data.notes ? `"${data.notes}"` : ""}</p>
    </div>
    <div class="py-1 px-2 flex flex-col text-right rounded-sm bg-zinc-200 dark:bg-zinc-800 whitespace-nowrap">
      <p class="text-3xl text-digital tracking-widest">${data.systolic}</p>
      <p class="text-3xl text-digital tracking-widest">${data.diastolic}</p>
      <p class="text-digital tracking-widest">PULSE ${data.pulse ? data.pulse : "NA"}</p>
    </div>
  </div>
  `
}

const appAlertComponent = (type = '', text = '', id = '') => {
  let color = 'zinc'
  if (type === 'danger') {
    color = 'red'
  } else if (type === 'alert') {
    color = 'blue'
  } else if (type === 'warning') {
    color = 'orange'
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

  const formatForm = () => {
    if (data.dose.value >= 2 && data.form !== 'Powder') {
      return `${data.form}s`
    } else if (data.form === 'Powder') {
      if (data.dose.value >= 2) {
        return 'scoops'
      } else {
        return 'scoop'
      }
    } else {
      return data.form
    }
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
        <p class="text-xl font-bold">${data.name} - ${data.strength.value}${data.strength.unit}</p>
        <p class="text-sm">Taking ${data.dose.value} ${formatForm()} ${data.dose.schedule}</p>
        ${data.pharmacy ? `<p class="text-sm">Pharmacy: ${data.pharmacy}</p>` : ""}
        ${data.notes ? `<p class="text-sm">"${data.notes}"</p>` : ""}
        ${data.needsRefill ? `<p class="text-xs italic">Estimated ${data.daysWorth} left</p>` : ""}
      </div>
      ${data.refillLink ? `<a href="${data.refillLink}" target="_blank" class="p-3 bg-zinc-200 dark:bg-zinc-800 dark:text-white text-zinc-950 w-full text-center rounded-sm">Refill Link</a>` : ""}
      ${data.needsRefill ? `<button data-itemid="${data.id}" target="_blank" class="cabinet-item-reset-refill-btn p-3 bg-blue-600 text-white w-full text-center rounded-sm">Reset Refill</button>` : ""}
    </div>
  
  `
}


const notificationItemComponent = (data) => {

  return `
      <div class="flex flex-col gap-3 p-3 rounded-md bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-50 relative border-1 ${data.read ? "border-zinc-200 dark:border-zinc-800 " : "border-blue-600 "}">
       
      ${data.read ? "" : `
        <div class="bg-blue-600 absolute top-[-4px] right-[-4px] rounded-full h-4 w-4"></div>
        <div class="bg-blue-600 absolute top-[-4px] right-[-4px] rounded-full h-4 w-4 animate-ping"></div>
        `}

        <div class="flex flex-col gap-2 relative ${data.read ? "opacity-70" : " opacity-100"}">
          <div data-notificationid=${data.id} class="notification-btn absolute z-[2] top-0 left-0 w-full h-full"></div>
          <p class=" text-base font-medium">${data.title}</p>
          <p class="text-sm font-light">${data.message}</p>
        </div>
        ${data.link ? `<a href="${data.link}" class="p-3 bg-blue-600 text-white w-full text-center rounded-sm">${data.linkLabel ? data.linkLabel : "Refill Now"}</a>` : ""}
        <p class="text-xs">${formatDate(data.createdAt, false)}</p>
      </div>
  
  `
}