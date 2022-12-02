import Users from '../../Database/Models/Users.js';
import Chart from '../../Database/Models/Chart.js';

let user = new Users;
let chart = new Chart;

// bring in buttons
const createUserBtn = $('#create-user');

$(()=>{
    createUserBtn.click((e)=>{
        e.preventDefault();
        console.log('clicked')
    })
})


