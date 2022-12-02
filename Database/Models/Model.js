class Model{
    constructor(){
        super();
        this.id = localStorage.getItem('local-inc')
        this.created_at = new Date().toString()
    }
} 
export default Model;