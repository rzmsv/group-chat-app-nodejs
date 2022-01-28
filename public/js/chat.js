// Elements____

const $welcomeTag = document.getElementById('welcome')
const $messageFrom = document.querySelector('#message_form')
const $massageFormInput = document.getElementById('message')
const $massageFormButton = document.getElementById('buttonMessage')
const $locationSendButton = document.querySelector('#send_location_button')
const $alertMessage = document.getElementById('alert_message')
const $chatSideBar = document.getElementById('chat_sidbar')
const $createElementForMessages = document.createElement("p")
const $createElementTitleforSideBar = document.createElement('h1')
const $createElementUsersforSideBar = document.createElement('h3')
//______________

const socket = io()
//________________
// Options
const qs = location.search.split('?')[1].split('&')
const roomAndUser = {
    room: qs[1].split('=')[1],
    user: qs[0].split('=')[1]
}
// _______________
// SCROLL_________
// const autoscroll = ()=>{
//     const $newMessage = $messages.lastElementChild
//     const newMessageStyles = getComputedStyle($newMessage)
//     const newMessageHeight = $newMessage.offsetHeight
//     console.log(newMessageStyles)
// }
//________________
window.addEventListener('load',()=>{
    socket.on('welcome',(message)=>{
        var message_time =(moment(message.created_at).format('h:mm:ss:a'))
        $welcomeTag.innerHTML = `${message_time} - ${message.text}`
    })
})

socket.on('disconnect_message_from_socket',(message)=>{
    var message_time =(moment(message.created_at).format('h:mm:ss:a'))
    $welcomeTag.innerHTML = `${message_time} - ${message.text}`
})
// ROOM DATA
socket.on('roomdata',({room,users})=>{
    $createElementTitleforSideBar.innerHTML = room
    $chatSideBar.appendChild($createElementTitleforSideBar)
    $createElementUsersforSideBar.innerHTML = ''
    users.map((user)=>{
        $createElementUsersforSideBar.innerHTML += `<p> ${user.username}</p>`
        $chatSideBar.appendChild($createElementUsersforSideBar)
    })
})


$messageFrom.addEventListener('submit',(value)=>{
    console.log('Type with me!')
    value.preventDefault()
    //disable Button
    
    $massageFormButton.setAttribute('disabled','')

    // const message_input = document.getElementById('message').value
    //OR
    const message_input = value.target.elements.message.value
    
    socket.emit('input_message_to_socket', message_input,(err)=>{
        if (err){
            return console.log(err)
        }
        //enable Button

        $massageFormButton.removeAttribute('disabled')
        $massageFormInput.value = ''
        $massageFormInput.focus()
        console.log('Message delivered!')
    })
})

socket.on('message_input_from_server_to_client',(value)=>{
    var message_time =(moment(value.message.created_at).format('h:mm:ss:a'))
    $createElementForMessages.innerHTML += `<strong>${value.user.username} </strong> ${message_time} </br> ${value.message.text}</br>`
    document.getElementById("message_div").appendChild($createElementForMessages);

})


$locationSendButton.addEventListener('click',()=>{
    var options = {
        enableHighAccuracy: true,
        // timeout: 10000,
        maximumAge: 0
      };
    $locationSendButton.setAttribute('disabled','')
    if (!navigator.geolocation){
        return alert('Geolocation is not support by your browser')
    }
    
    else{
       
        navigator.geolocation.getCurrentPosition((position)=>{
                      
                const lat_long = {
                    latitude : position.coords.latitude,
                    longitude : position.coords.longitude
                }
                socket.emit('send_location_from_front_to_socket',lat_long,(cb)=>{
                    

                    $alertMessage.innerHTML = "Location shared!"
                    $locationSendButton.removeAttribute('disabled')
                    console.log(cb)
                    setTimeout(()=>{
                        $alertMessage.innerHTML = ''
                    },5000)
                })
        },(error)=>{
            if(error){
                $alertMessage.innerHTML = 'Your browser can not send your location!'
                return console.log(error)
            }
        },options)
    }
})

socket.on('send_location_from_socket_to_front',(data)=>{
    var message_time =(moment(data.location.created_at).format('h:mm:ss:a'))
    document.getElementById("message_div").appendChild($createElementForMessages);
    $createElementForMessages.innerHTML += `<p> <strong> ${data.user.username }  </strong> ${message_time} </br> <a href = ${data.location.url} target=_blank> My current location </a> </br> </p>`
})

socket.emit('join',roomAndUser,(error)=>{
    if (error){
        alert(error)
        location.href = '/'
    }
})