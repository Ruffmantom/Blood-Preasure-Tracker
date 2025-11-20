function generateBPId() {
  var prefix = "BP-";
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var idLength = 8; // Length after "BP-" prefix
  var randomId = "";

  for (var i = 0; i < idLength; i++) {
    var randomIndex = Math.floor(Math.random() * chars.length);
    randomId += chars[randomIndex];
  }

  return prefix + randomId;
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
  const ampm = hour >= 12 ? "PM" : "AM";

  // Convert hour to 12-hour format
  hour = hour % 12;
  hour = hour ? hour : 12; // the hour '0' should be '12'

  // Construct formatted date string
  const formattedDate = `${month}/${day}/${year} @ ${pad(
    hour
  )}:${minute} ${ampm}`;

  return formattedDate;
}

function categorizeBloodPressure(bpReadings, age = 30) {
  const systolic = parseInt(bpReadings.topNum, 10);
  const diastolic = parseInt(bpReadings.bottomNum, 10);
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

function dounloadTxt(data, filename = "data.txt") {
  if (!Array.isArray(data)) data = [];

  // Build the text content using the stringData format
  let stringData = "";
  data.forEach((row) => {
    const note = row.note ? String(row.note).replace(/\r?\n/g, " ") : "";
    stringData += `• ${formatDate(row.recordedAt)} - (${row.topNum}/${row.bottomNum}) "${note}"\n`;
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

const clearDataModal = () => {
  // reset
  $("#overlay_record_index").text("")
  $("#modal_top_num").text("")
  $("#modal_bot_num").text("")
  $("#overlay_note_input").val()
  $("#overlay_record_date").text("")
  $("#modal_bp_category").text("")
  $("#modal_bp_category").text("")
  $("#modal_bp_category").removeClass("danger")
  $("#modal_bp_category").removeClass("normal")
  $("#modal_bp_category").removeClass("caution")
  $("#save_record_btn").attr('recordid', "")
  $("#delete_record_btn").attr('recordid', "")
}
const setDataModal = (data) => {
  clearDataModal()
  // set elements
  $("#overlay_record_index").text(data._id)
  $("#modal_top_num").text(data.topNum)
  $("#modal_bot_num").text(data.bottomNum)
  $("#overlay_note_input").val(data.note)
  $("#overlay_record_date").text(formatDate(data.recordedAt))
  let category = categorizeBloodPressure(data, globalUser.userAge)
  let categoryClass = returnBpCategoryClass(category)

  $("#modal_bp_category").text(category)
  $("#modal_bp_category").addClass(categoryClass)
  // set save and delete btn ids
  $("#save_record_btn").attr('recordid', data._id)
  $("#delete_record_btn").attr('recordid', data._id)

}