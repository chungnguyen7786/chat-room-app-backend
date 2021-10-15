const express = require('express')
const router = express.Router()
const verifyToken = require('../middlewares/auth')

const User = require('../models/User')
const Room = require('../models/Room')

// @route GET api/search/users
// @desc search users
// @access Private
router.get('/users', verifyToken, async (req, res) => {
  try {
    const regex = new RegExp(req.query.q, 'i')
    const foundUsers = await User.find({ username: regex })
    res.json({ success: true, foundUsers })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: error.message })
  }
})

// @route GET api/search/rooms
// @desc search rooms
// @access Private
router.get('/rooms', verifyToken, async (req, res) => {
  try {
    const regex = new RegExp(req.query.q, 'i')
    const foundRooms = await Room.find({ roomName: regex })
    res.json({ success: true, foundRooms })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router
