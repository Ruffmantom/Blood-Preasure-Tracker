import Model from "./Model.js";
import Increment from '../Helpers/Increment.js';
//bring in the DB
let userdb = new Localbase('BPT-USERS-DB');
// build table
let chartTable = userdb.collection('chart');

class Chart extends Model{

    create(user_id,_high,_low) {
        let userData = {
            id: this.id,
            high:_high,
            low:_low,
            u_id:user_id,
            created_at: this.created_at
        }
        // add user to db
        usersTable.add(userData)
        // increase local in ++ for next user
        let i = new Increment()
        i.inc();
    }
    
    // get users chart for today
    getAllData(){
        let rows = chartTable.orderBy('created_at', 'desc').get();
        return rows;
    }
    getTodaysData(today){
        let rows = chartTable.orderBy('created_at', 'desc').get();
        // logic for filtering by todays date
    }
    getThisWeeksData(weekOf){
        let rows = chartTable.orderBy('created_at', 'desc').get();
        // logic for filtering by week of
    }
}
export default Chart;