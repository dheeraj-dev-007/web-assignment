const socket = io();

const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messageContainer = document.getElementById('message-container');
const plist = document.getElementById('plist');

let receiver = '';
let sender = '';

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
})


function sendMessage(){
    if(messageInput.value == '') return;
    
    // console.log("send message",messageInput.value)
    const data = {
        sender: sender,
        receiver: receiver,
        message: messageInput.value,
        dateTime: new Date()
    }

    socket.emit('send_message', data)
    addMessageToUI(true, data)
    messageInput.value = ''
}

socket.on('chat-message', (data) => {
    // console.log("data >>", data);
    addMessageToUI(false, data)
})


function addMessageToUI(isOwnMessage, data){
    const element = `<li class="clearfix">
        <div class="message-data ${isOwnMessage ? "text-right": ""}">
            <span class="message-data-time">${moment(data.dateTime).fromNow()}</span>
        </div>
        <div class="message ${isOwnMessage ? "other-message float-right": "my-message"}">${data.message}</div>
    </li>`;

    messageContainer.innerHTML += element;

    scrollToBottom();
}


function scrollToBottom(){
    messageContainer.scrollTo(0, messageContainer.scrollHeight)
}


$(document).ready(function(){
    let userId = $('#plist').data('id');
    socket.emit('user_connected', userId);

    sender = userId;

    socket.on('user_connected', function(userId){
        // console.log("socket Id saved for user id", userId)
    })

    $('body').on('click', '#plist ul li', function(e){
        e.preventDefault();
        let userId = $(this).data('id');
        let userName = $(this).find('.about .name').text();
        let html = `<div class="row">
            <div class="col-lg-6">
                <a href="javascript:void(0);">
                    <img src="/images/avatar2.png" alt="avatar">
                </a>
                <div class="chat-about">
                    <h6 class="m-b-0">${userName}</h6>
                </div>
            </div>
        </div>`
        $('#chat-header-user').html(html);

        receiver = userId;
        showChat()

        $(this).parent().find('li').removeClass('active');
        $(this).addClass('active')
        
    });

    //show default chat
    function showChat(){
        $.ajax({
            url: "http://localhost:3005/get_messages",
            method: 'post',
            data : {
                sender: sender,
                receiver: receiver
            },
            success: function(response){
                // console.log("response >>", response)
                messageContainer.innerHTML = '';
                for(let i=0; i < response.message.length; i++){
                    let dataMsg = {
                        dateTime: response.message[i].createdAt,
                        message: response.message[i].message
                    }
                    if(response.message[i].sender_id == sender){
                        addMessageToUI(true, dataMsg)
                    }else{
                        addMessageToUI(false, dataMsg)
                    }
                }
                $('#chat-box-msg').show();
                scrollToBottom()
            }
        })
    }
});
