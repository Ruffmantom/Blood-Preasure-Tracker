import Users from '../../Database/Models/Users';
import Chart from '../../Database/Models/Chart';

let user = new Users;
let chart = new Chart;

// bring in buttons
const createUserBtn = $('#create-user');


// inputs

$(document).ready(function() {
    $("#doc-contact").intlTelInput({
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/8.4.6/js/utils.js"
      });
});
createUserBtn.on('click',(e)=>{
    e.preventDefault();
    console.log('clicked!')
})