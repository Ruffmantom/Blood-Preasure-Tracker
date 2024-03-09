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
  let today = new Date().toLocaleDateString()
  let cardsDate = new Date(data.recordedAt).toLocaleDateString()

  let bpCategory = categorizeBloodPressure(data, age);
  // console.log("BP Category: " + bpCategory)

  return `
        <div class="bp_data_card ${cardsDate === today ? "most_recent" : ""}">
            <div class="bp_card_btn" data-recordid=${data._id}></div>
            <p class="bp_tag ${bpCategory === "Very Low"
      ? "danger"
      : bpCategory === "Low"
        ? "caution"
        : bpCategory === "High"
            ? "danger"
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
