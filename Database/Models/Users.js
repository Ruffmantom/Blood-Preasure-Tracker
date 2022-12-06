import FlashHelper from "../Helpers/FlashHelper.js";
import Model from "./Model.js";
//bring in the DB
let userdb = new Localbase("BPT-USERS-DB");
// build table
let usersTable = userdb.collection("user");

userdb.config.debug = false;


class Users extends Model {
  create(userData) {
    // add user to db
    usersTable.add(userData).add().then(response => {
      console.log('Add successful, now do something.')
      return 'Account has been created!'
    })
      .catch(error => {
        console.log('There was an error, do something else.')
        return 'There was an error creating account: ' + error;
      })
  }
  async getAllUsers() {
    // console.log(await usersTable.get())
    return await usersTable.get();
  }
  // login
  login(_username, _pass) {
    // verify user exists
    usersTable
      .doc({ username: _username })
      .get()
      .then((document) => {
        console.log(document);
      });
  }
  // update user
  update(_id, updateData) {
    // need to pass atleast one param
    usersTable.doc({ id: _id }).update(updateData);
  }
  // delete user
  remove(_id) {
    // need ID
    usersTable.doc({ id: _id }).delete();
  }
}
export default Users;
