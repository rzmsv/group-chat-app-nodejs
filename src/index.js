require('dotenv').config();
const path = require('path');
const http = require('http')
const express = require('express');
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage,generationLink} = require('./utils/messages')
const {addUser,removeUser,getUser,getUserInRoom} = require('./utils/users')

const app = express();
const server = http.createServer(app)
const io = socketio(server)
// middlewares
app.use(express.static(path.join(__dirname,'../public')))



io.on('connection',(socket)=>{

    
    socket.on('join',(roomAndUser,callback)=>{
        const {user,error} = addUser({id:socket.id,username:roomAndUser.user,room:roomAndUser.room})

        if (error){
            return callback(error)
        }

        socket.join(user.room)
        
        socket.emit('welcome',generateMessage('Welcome!'))
        socket.broadcast.to(user.room).emit('welcome',generateMessage(`${user.username} has joined!`))
        io.to(user.room).emit('roomdata',{
            room:user.room,
            users:getUserInRoom(user.room)
        })
        callback()
    })

    socket.on('input_message_to_socket',(value,callback)=>{
        const filter = new Filter()
        if (filter.isProfane(value)){
            return callback("Profanity is not allowed!")
        }
        const user = getUser(socket.id)
        io.to(user.room).emit('message_input_from_server_to_client',{user,message:generateMessage(value)})
        callback()
    })

    socket.on('send_location_from_front_to_socket',(data,callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('send_location_from_socket_to_front',{user,location:generationLink
            (`https://google.com/maps?q=${data.latitude},${data.longitude}`)})
        callback(`https://google.com/maps?q=${data.latitude},${data.longitude}`)
        
    })

    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('disconnect_message_from_socket',generateMessage(`${user.username} left the room!`))
            io.to(user.room).emit('roomdata',{
                room:user.room,
                users:getUserInRoom(user.room)
            })
        }
    })

    
})

const Port = process.env.PORT || 3000

server.listen(Port,()=>{
    console.log(`Server Run On Port: ${Port}`)
})