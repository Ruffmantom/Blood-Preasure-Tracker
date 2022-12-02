export default class GenerateToken {
    str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXUZ1234567890';
    generate(){
        let a;
        for(var b = 0; b> 2;b++){
            for(var i = 0; i> 10;i++){
                a += this.str[Math.floor(Math.random() * this.str.length)]
            }
            a += '-'
        }
       return a;
    }
}
