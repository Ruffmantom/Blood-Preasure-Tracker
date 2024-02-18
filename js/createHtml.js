const createDataCard = (data, age, index, length) => {
  // console.log("Creating Card...")
  /*
    {
        "topNum": "144",
        "bottomNum": "85",
        "recordedAt": "2024-02-16T17:07:44.081Z",
        _id: BP-BKW8938KJ
    }
    */
  let bpCategory = categorizeBloodPressure(data, age);
  // console.log("BP Category: " + bpCategory)

  return `
        <div class="bp_data_card ${index === length-1 ? "most_recent" : ""}" ${
    data._id
  }>
            
            <p class="bp_tag ${
              bpCategory === "Very Low"
                ? "danger"
                : bpCategory === "low"
                ? "caution"
                : bpCategory === "Very High"
                ? "danger"
                : bpCategory === "High"
                ? "caution"
                : "normal"
            }">${bpCategory}</p>

            <div class="bp_card_info">
            <p class="bp_rec_date">${formatDate(data.recordedAt)}
            </p>
            
            ${data.note ? `<p class="bp_note" >"${data.note}"</p>` : ""}
            </div>
            
            <div class="bp_showcase">
              <p class="top_num">${data.topNum}</p>
              <div class="bp_divide_line"></div>
              <p class="bot_num">${data.bottomNum}</p>
            </div>

          </div>
    `;
};
