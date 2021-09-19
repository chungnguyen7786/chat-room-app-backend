const express = require('express')
const router = express.Router()
const verifyToken = require('../middlewares/auth')

const Room = require('../models/Room')
const Message = require('../models/Message')

// @route GET api/messages/:id
// @desc Get all messages in room (id)
// @access Private
router.get('/:id', verifyToken, async (req, res) => {
  const room = await Room.findOne({ _id: req.params.id })

  !room && res.status(404).json({ error: 'room can not found' })
  !room.members.includes(req.userId) &&
    res.status(400).json({ error: 'You are not a member of this room' })

  try {
    const messages = await Message.find({ room: req.params.id }).populate(
      'sender',
      ['username']
    )
    res.json(messages)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
})

// @route POST api/messages/:id
// @desc Send a message to the room (id)
// @access Private
router.post('/:id', verifyToken, async (req, res) => {
  const room = await Room.findOne({ _id: req.params.id })

  !room && res.status(404).json({ error: 'room can not found' })
  !room.members.includes(req.userId) &&
    res.status(400).json({ error: 'You can not send message to this room' })

  try {
    const { text } = req.body
    let newMessage = new Message({
      sender: req.userId,
      room: req.params.id,
      text,
    })

    await newMessage.save()

    newMessage = await newMessage.populate('sender', ['username'])

    res.status(201).json(newMessage)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
