let globalUser = null
let userLoaded = false
const defaultUser = {
    bp_data: []
}

const menu_overlay_cont = $(".menu_overlay_cont")
const settings_btn = $("#settings_btn")
const close_settings_btn = $("#close_settings_btn")
let menuOpen = false

const saveToLocal = () => {
    localStorage.setItem('BP_TR_USER', JSON.stringify(globalUser))
}

const renderCards = () => {
    // console.log("Render Cards has started...")
    // when re rendering be sure to empty div
    $(".bp_data_cont").empty()

    if (userLoaded && globalUser.bp_data.length >= 1) {
        // console.log("About to render cards...")
        globalUser.bp_data.forEach(d => {
            // console.log("Data: ", d)
            $(".bp_data_cont").prepend(createDataCard(d))
        });
    } else {
        $(".bp_data_cont").append(`<p class="end_of_data_note">No data found</p>`)
    }
}

// load program
const loadUserOrCreate = () => {
    // check local storage, if no user then create
    let localUser = localStorage.getItem('BP_TR_USER')
    if (localUser === null || localUser === undefined) {
        // console.log('lets create a new user!')
        localStorage.setItem('BP_TR_USER', JSON.stringify(defaultUser))
        globalUser = defaultUser
        userLoaded = true
    } else {
        globalUser = JSON.parse(localUser)
        userLoaded = true
        // load dom
        renderCards()
    }
}



$(() => {
    loadUserOrCreate()

    // form submit
    $("#submit_bp_btn").click(function (event) {
        event.preventDefault(); // Prevents the default form submission action
        var systolicValue = $("#bp_input_systolic").val();
        var diastolicValue = $("#bp_input_diastolic").val();
        var recordedAt = new Date().toISOString(); // ISO string format of current date and time

        var bpValues = {
            topNum: systolicValue,
            bottomNum: diastolicValue,
            recordedAt: recordedAt,
            _id: generateBPId()
        };

        // save to globaluser
        globalUser.bp_data.push(bpValues)
        // re render list
        renderCards()
        // save to local
        saveToLocal()
        // clean up
        systolicValue.val('')
        diastolicValue.val('')
    });


    settings_btn.on("click", (e) => {
        if (menuOpen) {
            menu_overlay_cont.removeClass("active")
            menuOpen = false
        } else {
            menu_overlay_cont.addClass("active")
            menuOpen = true
        }
    })
    close_settings_btn.on("click", (e) => {
        if (menuOpen) {
            menu_overlay_cont.removeClass("active")
            menuOpen = false
        }
    })

    $("#download_csv_btn").on("click", (e) => {
        let date = new Date().toISOString();
        let dateName = formatDate(date)
        let formattedName = dateName.split(' ')[0].replace(/\//g, "-")
        if(globalUser.bp_data.length >= 1){
            downloadCSV(globalUser.bp_data, `BP-${formattedName}.csv`)
        }

    })


    $("#clear_all_data_btn").on("click", (e) => {
        localStorage.clear("BP_TR_USER")
        // Reload the page from the server, ignoring the cache
        window.location.reload(true);

    })

})

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker
        .register("/serviceWorker.js")
        .then(res => console.log("service worker registered"))
        .catch(err => console.log("service worker not registered", err));
    });
  }