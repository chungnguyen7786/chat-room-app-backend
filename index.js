require('dotenv').config()
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
})
const PORT = process.env.PORT || 5000
const mongoose = require('mongoose')
const cors = require('cors')

const authRouter = require('./routes/auth')
const roomRouter = require('./routes/room')
const messageRouter = require('./routes/message')
const searchRouter = require('./routes/search')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(`MongoDB connected`)
  } catch (err) {
    console.error(err)
  }
}
connectDB()

app.use(express.json())
app.use(cors())

app.use('/api/auth', authRouter)
app.use('/api/rooms', roomRouter)
app.use('/api/messages', messageRouter)
app.use('/api/search', searchRouter)

const user = {}
io.on('connection', (socket) => {
  console.log(`Hello from the Server! Socket ID: ${socket.id}`)

  var currentRoom = ''
  socket.on('oldRoom', (data) => {
    data !== {} && socket.leave(data.roomName)
  })
  socket.on('currentRoom', (data) => {
    if (data !== null) {
      currentRoom = data.roomName
      socket.join(currentRoom)
    }
  })

  socket.on('clientSendMessage', (data) => {
    io.in(currentRoom).emit('serverSendMessage', data)
  })

  // socket.on('logout', )

  socket.on('disconnect', () =>
    console.log(`This user just left! Socket ID: ${socket.id}`)
  )
})

server.listen(PORT, () => console.log(`Server started on port ${PORT}`))
