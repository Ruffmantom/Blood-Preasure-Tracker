import GenerateToken from "../Helpers/GenerateToken.js";
import Users from "../Models/Users.js";
class UsersController {
    create(name, age) {
        let userData = {
            id: GenerateToken.generate(),
            nuser_name: name,
            user_age: age,
        }
        // store user
        let usercreate = new Users;
        // create user
        usercreate.create(userData)
        // when the user has been created
        // show flash message

        // <flash-component title="User Saved!" theme="cheer"></flash-component>
    }
    update() {
        // nothing yet
    }
    delete() {
        // nothing yet
    }
}

export default UsersController;