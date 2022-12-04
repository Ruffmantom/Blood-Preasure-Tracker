import FlashHelper from "../Helpers/FlashHelper.js";
import GenerateToken from "../Helpers/GenerateToken.js";
import Users from "../Models/Users.js";
class UsersController {
    create(name, age) {
        let userData = {
            id: GenerateToken.generate(),
            user_name: name,
            user_age: age,
        }
        // console.log(userData);
        // store user
        let usercreate = new Users;
        // create user
        usercreate.create(userData)
        // when the user has been created
        // show flash message
        FlashHelper.show('User Created!','cheer',1000);
    }
    update() {
        // nothing yet
    }
    delete() {
        // nothing yet
    }
}

export default UsersController;