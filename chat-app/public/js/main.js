const chatForm = document.querySelector('#chat-form');
const chatMessages = document.querySelector('.chat-messages');

const socket = io();

socket.on('message', msg => {
    console.log(msg);
    outputMessage(msg);

    chatMessages.scrollTop = chatMessages.scrollHeight;
})

chatForm.addEventListener('submit', e => {
    e.preventDefault();

    let msg = e.target.elements.msg.value;
    
    socket.emit('chatMessage', msg)

    e.target.elements.msg.value = '';
}) 

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}