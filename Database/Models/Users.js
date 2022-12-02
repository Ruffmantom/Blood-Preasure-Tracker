import Model from './Model.js';
//bring in the DB
let userdb = new Localbase('BPT-USERS-DB');
// build table
let usersTable = userdb.collection('user');

class Users extends Model{
    create(userData) {
        // add user to db
        usersTable.add(userData)
    }
    // update user
    update(_id, updateData) {
        // need to pass atleast one param
        usersTable.doc({ id: _id }).update(updateData)
    }
    // delete user
    remove(_id) {
        // need ID
        usersTable.doc({ id: _id }).delete()
    }

}
export default Users;