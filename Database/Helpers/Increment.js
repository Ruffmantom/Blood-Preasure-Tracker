export default class Increment {
    inc(){
        let i = localStorage.getItem('local-inc');
        i++
        localStorage.setItem('local-inc', i);
    }
}