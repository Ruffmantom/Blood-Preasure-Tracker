// import DoctorsController from '../../Database/Controllers/DoctorsController.js';
import UsersController from '../../Database/Controllers/UsersController.js';

let user = new UsersController;
// let chart = new C;
// let doctor = new DoctorsController;

// bring in buttons
const createUserBtn = $('#create_user_btn');
// bring in inputs
const nameInput = $('#name_input');
const ageInput = $('#age_input');
// const nameInput = $('#')
// const nameInput = $('#')
// const nameInput = $('#')
$(()=>{
    let userName = '';
    let userAge = '';
    createUserBtn.click((e)=>{
        e.preventDefault();
        // create user
        user.create(nameInput,ageInput)
    })
    nameInput.on("input", function() {
        userName = this.value;
    })
    ageInput.on("input", function() {
        userAge = this.value;
    })
})


