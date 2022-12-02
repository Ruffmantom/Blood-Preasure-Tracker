const GenerateToken = {
    str: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXUZ1234567890',
    generate: function () {
        var charactersLength = this.str.length;
        let result = '';
        for (var i = 0; i <= 10; i++) {
            result += this.str.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },
    generateLongToken: function () {
        let result = '';
        return result += this.generate() + '-' + this.generate() + '-' + this.generate();
    }
}
export default GenerateToken;