import Model from "./Model.js";
// database will be with local storage
class Users extends Model {
  create(userData) {
    // add user to db
    console.log("User Model -> create() user: ", userData)
    // usersTable.add({ userData }).then(response => {
    //   console.log("User Model -> create() user SUCCESS: ", response)
    // }).catch(error => {
    //   console.log("User Model -> create() user ERROR: ", error)
    // })

    const request = indexedDB.open('users');
    let db;

    request.onerror = function (event) {
      console.log('User Model ERROR with IndexedDB', event)
    }

    request.onsuccess = function () {
      db = request.result;
      const transaction = db.transaction('users', 'readwrite')

      const store = transaction.objectStore('users')
      store.put(userData).onsuccess = function(e) {
        const key = e.target.result;
        console.log("User Model store.put: ",key);
      };
    };




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
