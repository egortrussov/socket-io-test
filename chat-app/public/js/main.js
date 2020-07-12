const chatForm = document.querySelector('#chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.querySelector('#room-name');
let usersList = document.querySelector('#users');

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

roomName.innerText = room;

const socket = io();

socket.emit('joinRoom', { username, room });

socket.on('roomUsersList', users => {
    usersList.innerHTML = '';
    users.forEach(user => {
        let li = document.createElement('li');
        li.innerHTML = user.username;
        usersList.appendChild(li)
    })
})

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
    div.classList.add(message.type)
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}