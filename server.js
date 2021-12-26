const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)    //redirect to random url
})

app.get('/:room', (req, res) => {
    const roomId = req.params.room
    res.render('room', { roomId })
    console.log('joining the room:', roomId);
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.broadcast.emit('user-connected', userId)

        socket.on('disconnect', () => {
            socket.broadcast.emit('user-disconnected', userId)
        })
    })
})

server.listen(3000, () => {
    console.log('seerver up on port 3000');
})