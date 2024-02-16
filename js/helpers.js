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
    const pad = (num) => num.toString().padStart(2, '0');

    // Extract components
    const month = pad(date.getMonth() + 1); // getMonth() is zero-indexed
    const day = pad(date.getDate());
    const year = date.getFullYear();
    let hour = date.getHours();
    const minute = pad(date.getMinutes());

    // Determine AM or PM suffix
    const ampm = hour >= 12 ? 'PM' : 'AM';

    // Convert hour to 12-hour format
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'

    // Construct formatted date string
    const formattedDate = `${month}/${day}/${year} @ ${pad(hour)}:${minute} ${ampm}`;
    
    return formattedDate;
}

function categorizeBloodPressure(bpReadings, age = 30) {
    const systolic = parseInt(bpReadings.topNum, 10);
    const diastolic = parseInt(bpReadings.bottomNum, 10);
    let category = "Normal"; // Default category

    // Define age-specific thresholds
    let thresholds;
    if (age >= 2 && age <= 13) {
        thresholds = { low: { systolic: 80, diastolic: 40 }, high: { systolic: 120, diastolic: 80 } };
    } else if (age >= 14 && age <= 18) {
        thresholds = { low: { systolic: 90, diastolic: 50 }, high: { systolic: 120, diastolic: 80 } };
    } else if (age >= 19 && age <= 40) {
        thresholds = { low: { systolic: 95, diastolic: 60 }, high: { systolic: 135, diastolic: 80 } };
    } else if (age >= 41 && age <= 60) {
        thresholds = { low: { systolic: 110, diastolic: 70 }, high: { systolic: 145, diastolic: 90 } };
    } else {
        // Default to adult (19-40 years) if age is not provided or out of range
        thresholds = { low: { systolic: 95, diastolic: 60 }, high: { systolic: 135, diastolic: 80 } };
    }

    // Check against thresholds
    if (systolic < thresholds.low.systolic || diastolic < thresholds.low.diastolic) {
        category = "Low";
    } else if (systolic > thresholds.high.systolic || diastolic > thresholds.high.diastolic) {
        category = "High";
    }

    return category;
}

function downloadCSV(data, filename = 'data.csv') {
    // Convert array of objects into CSV data
    let csvContent = 'data:text/csv;charset=utf-8,';
    const headers = Object.keys(data[0]).join(',');
    csvContent += headers + '\n';

    data.forEach(row => {
        const rowData = Object.values(row).join(',');
        csvContent += rowData + '\n';
    });

    // Create a link to download the CSV file
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link); // Required for FF

    // Trigger the download
    link.click();

    // Clean up
    document.body.removeChild(link);
}