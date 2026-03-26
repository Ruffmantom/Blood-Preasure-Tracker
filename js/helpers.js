function generateBPId() {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var idLength = 10;
  var randomId = "";

  for (var i = 0; i < idLength; i++) {
    var randomIndex = Math.floor(Math.random() * chars.length);
    randomId += chars[randomIndex];
  }

  return randomId;
}

const returnIsoString = (includeYesterday = false) => {
  const date = new Date();

  if (includeYesterday) {
    date.setDate(date.getDate() - 1);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const handleSysAndDiaFormat = function () {
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
}

function formatDate(isoDateString) {
  const date = new Date(isoDateString);

  // Pad with leading zeros where necessary
  const pad = (num) => num.toString().padStart(2, "0");

  // Extract components
  const month = pad(date.getMonth() + 1); // getMonth() is zero-indexed
  const day = pad(date.getDate());
  const year = date.getFullYear();
  let hour = date.getHours();
  const minute = pad(date.getMinutes());

  // Determine AM or PM suffix
  const ampm = hour >= 12 ? "pm" : "am";

  // Convert hour to 12-hour format
  hour = hour % 12;
  hour = hour ? hour : 12; // the hour '0' should be '12'

  // Construct formatted date string
  const formattedDate = `${month}/${day}/${year} : ${pad(
    hour
  )}:${minute} ${ampm}`;

  return formattedDate;
}

function categorizeBloodPressure(systolic, diastolic, age = 30) {
  let category = "Normal"; // Default category

  // Define age-specific thresholds
  let thresholds;
  if (age >= 2 && age <= 13) {
    thresholds = {
      low: { systolic: 80, diastolic: 40 },
      high: { systolic: 120, diastolic: 80 },
    };
  } else if (age >= 14 && age <= 18) {
    thresholds = {
      low: { systolic: 90, diastolic: 50 },
      high: { systolic: 120, diastolic: 80 },
    };
  } else if (age >= 19 && age <= 40) {
    thresholds = {
      low: { systolic: 95, diastolic: 60 },
      high: { systolic: 135, diastolic: 80 },
    };
  } else if (age >= 41 && age <= 60) {
    thresholds = {
      low: { systolic: 110, diastolic: 70 },
      high: { systolic: 145, diastolic: 90 },
    };
  } else {
    // Default to adult (19-40 years) if age is not provided or out of range
    thresholds = {
      low: { systolic: 95, diastolic: 60 },
      high: { systolic: 135, diastolic: 80 },
    };
  }

  // Check against thresholds
  if (
    systolic < thresholds.low.systolic ||
    diastolic < thresholds.low.diastolic
  ) {
    category = "Low";
  } else if (
    systolic > thresholds.high.systolic ||
    diastolic > thresholds.high.diastolic
  ) {
    category = "High";
  }

  return category;
}

function downloadTxt(data, filename = "data.txt") {
  if (!Array.isArray(data)) data = [];

  // Build the text content using the stringData format
  let stringData = "";
  data.forEach((d) => {
    const note = String(d.notes).replace(/\r?\n/g, " ") || ""
    stringData += `• ${formatDate(d.createdAt)} - (${d.systolic}/${d.diastolic}) ${d.pulse ? `| Pulse rate: ${d.pulse}` : ""} ${d?.notes ? note : ""}\n`;
  });

  // Create a plain-text blob and trigger download
  const blob = new Blob([stringData], { type: "text/plain;charset=utf-8" });

  // IE fallback
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, filename);
    return;
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const returnBpCategoryClass = (cat) => {
  let className = ""
  switch (cat) {
    case "Low":
      className = "caution"
      break;
    case "High":
      className = "danger"
      break;
    default:
      className = "normal"
      break;
  }
  return className
}

function getAgeFromDateInput(dateValue) {
  if (!dateValue) return null

  const birthDate = new Date(dateValue)
  if (Number.isNaN(birthDate.getTime())) return null

  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()

  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate())

  if (!hasHadBirthdayThisYear) {
    age--
  }

  return age
}

function checkLinkIsValid(linkToTest) {
  if (typeof linkToTest !== 'string') return false;

  const link = linkToTest.trim();
  if (!link) return false;

  // Reject whitespace inside the URL
  if (/\s/.test(link)) return false;

  // Reject obvious non-external / unsafe schemes
  if (/^(javascript|data|vbscript|file|blob):/i.test(link)) return false;

  let url;
  try {
    url = new URL(link);
  } catch {
    return false;
  }

  // Only allow absolute external http/https links
  if (!['http:', 'https:'].includes(url.protocol)) return false;

  // Must have a real hostname
  if (!url.hostname) return false;

  // Block localhost
  if (
    url.hostname === 'localhost' ||
    url.hostname === '127.0.0.1' ||
    url.hostname === '::1'
  ) {
    return false;
  }

  // Block private/internal IPv4 ranges
  if (isPrivateIPv4(url.hostname)) return false;

  // Optional: require a dot in non-IP hostnames so "http://intranet" fails
  if (!isIPv4(url.hostname) && !url.hostname.includes('.')) return false;

  return true;
}

function isIPv4(hostname) {
  const parts = hostname.split('.');
  if (parts.length !== 4) return false;

  return parts.every(part => {
    if (!/^\d+$/.test(part)) return false;
    const n = Number(part);
    return n >= 0 && n <= 255;
  });
}

function isPrivateIPv4(hostname) {
  if (!isIPv4(hostname)) return false;

  const [a, b] = hostname.split('.').map(Number);

  return (
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  );
}


const returnRefillDate = (
  dateStarted = '',
  receivedQty = 0,
  doseAmount = 0,
  schedule = 'Daily'
) => {
  const baseDate = dateStarted ? new Date(dateStarted) : new Date();

  if (
    Number.isNaN(baseDate.getTime()) ||
    !receivedQty ||
    !doseAmount ||
    receivedQty <= 0 ||
    doseAmount <= 0
  ) {
    return null;
  }

  const scheduleMap = {
    'Daily': 1,
    'Every morning': 1,
    'Every evening': 1,
    'Morning and evening': 2,
    'At bedtime': 1,
    'Every 6 hours': 4,
    'Every 8 hours': 3,
    'Every 12 hours': 2,
    'Weekly': 1 / 7,
  };

  const dosesPerDay = scheduleMap[schedule] ?? 1;
  const amountPerDay = doseAmount * dosesPerDay;
  const daysUntilEmpty = receivedQty / amountPerDay;
  const notifyDaysFromStart = Math.max(0, Math.floor(daysUntilEmpty - 7));

  const notifyUserDate = new Date(baseDate);
  notifyUserDate.setDate(notifyUserDate.getDate() + notifyDaysFromStart);

  const year = notifyUserDate.getFullYear();
  const month = String(notifyUserDate.getMonth() + 1).padStart(2, '0');
  const day = String(notifyUserDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};


const sendNotification = (tag = "", title = "", message = "") => {
  Notification.requestPermission(perm => {
    if (perm) {
      new Notification(title, {
        tag: tag || undefined,
        body: message,
        icon: "./assets/images/bp-tracker-rounded-256.png"
      })
    }
  })
}