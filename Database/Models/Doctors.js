import Model from "./Model.js";
//bring in the DB
let doctorDb = new Localbase('BPT-DOC-DB');
// build table
let usersTable = doctorDb.collection('doctor');
class Doctors extends Model{
    create(data){
        usersTable.add(data);
    }
    update(data){
        // nothing yet
    }
}
export default Doctors;