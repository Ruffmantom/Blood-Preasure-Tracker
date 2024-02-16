const createDataCard = (data, age) => {
    // console.log("Creating Card...")
    /*
    {
        "topNum": "144",
        "bottomNum": "85",
        "recordedAt": "2024-02-16T17:07:44.081Z",
        _id: BP-BKW8938KJ
    }
    */
    let bpCategory = categorizeBloodPressure(data, age)
    // console.log("BP Category: " + bpCategory)

    return `
        <div class="bp_data_card" ${data._id}>
            
            <p class="bp_tag ${bpCategory === "Very Low" ? "danger" : bpCategory === "low" ? "caution" : bpCategory === "Very High" ? "danger" : bpCategory === "High" ? "caution" : "normal"}">${bpCategory}</p>
            <p class="bp_rec_date">Recorded: <br> <span>${formatDate(data.recordedAt)}</span></p>
            
            <div class="bp_showcase">
              <p class="top_num">${data.topNum}</p>
              <div class="bp_divide_line"></div>
              <p class="bot_num">${data.bottomNum}</p>
            </div>

          </div>
    `
}