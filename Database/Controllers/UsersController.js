import FlashHelper from "../Helpers/FlashHelper.js";
import GenerateToken from "../Helpers/GenerateToken.js";
import Users from "../Models/Users.js";


let user = new Users;
// init variable all users
let allUsers = user.getAllUsers();


class UsersController {
    async verifyUsername(_username) {
        // let user = new Users;
        // let allUsers = await user.getAllUsers()
        let userFound = false;
        let gotUsers = await allUsers
        console.log('User Controller verifyUsername(): ', gotUsers)
        gotUsers.map(u => {
            if (u.username.toLowerCase() === _username.toLowerCase()) {
                // username has been taken
                console.log('User C username found! return TRUE')
                userFound = true
            }
        })

        return userFound;
    }
    create(_username, _name, _age, _password) {
        let userData = {
            id: GenerateToken.generate(),
            username: _username,
            name: _name,
            age: _age,
            password: _password,
        };
        // store user
        let user = new Users();
        // create user
        try {
            user.create(userData)
            // when the user has been created
            // show flash message
            FlashHelper.show("User Created!", "cheer", 1000);
        } catch (error) {
            console.log('error creating user')
            return error;
        }
    }
    login(u_username, u_pass) {
        // return erros if unsuccessful login
        let user = new Users();
        user.login(u_username);
    }
    update() {
        // nothing yet
    }
    delete() {
        // nothing yet
    }
}

export default UsersController;
