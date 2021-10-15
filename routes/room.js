const express = require('express')
const router = express.Router()
const verifyToken = require('../middlewares/auth')

const Room = require('../models/Room')

// @route GET api/rooms
// @desc Get rooms
// @access Private
router.get('/', verifyToken, async (req, res) => {
  try {
    const rooms = await Room.find({ members: req.userId }).populate('members', [
      'username',
      'avatarUrl',
    ])
    res.json({ success: true, rooms })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: error.message })
  }
})

// @route POST api/rooms
// @desc Create a new room
// @access Private
router.post('/', verifyToken, async (req, res) => {
  const { roomName, desc } = req.body
  // Simple validation
  if (!roomName || !desc)
    res.status(400).json({
      success: false,
      message: 'Room name and description are required',
    })

  // Check for existing room
  const room = await Room.findOne({ roomName })
  room &&
    res
      .status(400)
      .json({ success: false, message: 'This room_name already taken' })

  try {
    const newRoom = new Room({
      roomName,
      desc,
      admin: req.userId,
      members: [req.userId],
    })

    await newRoom.save()

    //Test for .populate
    await newRoom.populate('admin', ['username'])
    await newRoom.populate('members', ['username'])

    res.status(201).json({
      success: true,
      message: 'Created room successfully',
      room: newRoom,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: error.message })
  }
})

// @route PUT api/rooms/:id
// @desc Update a room
// @access Private
router.put('/:id', verifyToken, async (req, res) => {
  const { roomName, desc } = req.body

  // Simple validation:
  if (!roomName || !desc)
    res.status(400).json({
      success: false,
      message: 'Room name and description are required',
    })

  try {
    let updatedRoom = {
      roomName,
      desc,
    }

    const roomUpdateCondition = {
      _id: req.params.id,
      admin: req.userId,
    }

    updatedRoom = await Room.findOneAndUpdate(
      roomUpdateCondition,
      updatedRoom,
      { new: true }
    )

    !updatedRoom &&
      res.status(401).json({
        success: false,
        message: 'Room not found or user not authorised',
      })

    res.json({
      success: true,
      message: 'Update successfully',
      room: updatedRoom,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: error.message })
  }
})

// @route DELETE api/rooms/:id
// @desc Delete a room
// @access Private
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const roomDeleteCondition = {
      _id: req.params.id,
      admin: req.userId,
    }

    const deletedRoom = await Room.findOneAndDelete(roomDeleteCondition)

    !deletedRoom &&
      res.status(401).json({
        success: false,
        message: 'Room not found or user not authorised',
      })

    res.json({ success: true, message: 'Delete successfully', deletedRoom })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router
