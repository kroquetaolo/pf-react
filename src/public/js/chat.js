const socket = io()

let user;
let chatBox = document.getElementById('chatBox')

Swal.fire({
    title: "Ingresa tu nombre de usuario",
    input: "text",
    text: "Para identificarte en el chat ;D ",
    inputValidator: value => {
        return !value && 'Escribe un nombre de usuario para identificarte'
    },
    allowOutsideClick: false,
    allowEscapeKey: false
}).then(result => {
    user = result.value
})

chatBox.addEventListener('keyup', event => {
    if(event.key === "Enter") {
        if(chatBox.value.trim().length > 0) {
            socket.emit("message", {user: user, message: chatBox.value})
            chatBox.value = ""
        }
    }
})

socket.on('messageLogs', data => {
    let log = document.getElementById('messageLogs')
    let messages = ""
    data.forEach(message => {
        messages = messages + `${message.user} > ${message.message}</br>`        
    });
    log.innerHTML = messages;
})