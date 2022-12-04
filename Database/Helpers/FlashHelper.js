const FlashHelper = {
    show:function(message,theme,time){
        // execute flash when ran
        // show flash with message for what ever time limit
        // var flash =  document.createElement(`<flash-component title="${message}" theme="${theme}"></flash-component>`)
        var flash =  document.createElement(`flash-component`)
        
        document.body.prepend(flash);
        var flashTimer = setTimeout(()=>{
            // inside here will remove the flash
        },time)
    }
}
export default FlashHelper;