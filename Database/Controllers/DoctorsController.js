import GenerateToken from "../Helpers/GenerateToken.js";
import Doctors from "../Models/Doctors.js";

export default DoctorsController = {
    create(_name, _email, _phone, _userId) {
        // create data
        let data = {
            id: GenerateToken.generate(),
            name: _name,
            email: _email ?? null,
            phone: _phone ?? null,
            user_id: _userId,
            created_at: this.created_at
        }
        let createDoc = new Doctors;
        // create
        createDoc.create(data)
    }
}