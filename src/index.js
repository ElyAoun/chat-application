const path = require('path')
const http = require('http') //core module
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage, generateLocationMessage} = require('./utils/messages')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app)//this will be done in the background anyway but when we are using socket.io we need to do it manually cause we need to pass the raw server to the socketio call
const io = socketio(server)

const port = process.env.PORT || 3000
const public_dir_path = path.join(__dirname, '../public')


app.use(express.static(public_dir_path))

io.on('connection',(socket)=>{
    console.log('New WebSocket connection')

    socket.on('join', ({username, room}, callback)=>{
        const {error, user } = addUser({ id: socket.id, username, room })
        
        if(error){
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message',generateMessage(`Welcome ${user.username}`,'admin'))
        socket.broadcast.to(user.room).emit('message',generateMessage(`${user.username} has joined!`,'admin'))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage',(message, callback)=>{

        const filter = new Filter()

        if(filter.isProfane(message)){
            return callback('Profanity is not allowed!')
        }

        const user = getUser(socket.id)

        io.to(user.room).emit('message', generateMessage(message, user.username))
        callback()
    })

    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id)

        if (user){
            io.to(user.room).emit('message',generateMessage(`${user.username} has left the room`,'admin'))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })

    socket.on('sendLocation',(coords, callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`,user.username))
        callback()
    })
})

server.listen(port, ()=>{
    console.log(`Server is up on port: ${port}`)
})





//socket.emit, io.emit, socket.broadcast.emit
        //io.to.emit => emits events to everybody in the given room