const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middlewares/auth')

const User = require('../models/User')

// @route GET api/auth
// @desc Check if user is logged in or not
// @access Public
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password')
    !user && res.status(400).json({ error: 'User not found' })
    res.status(200).json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
})

// @route POST api/auth/register
// @desc Register user
// @access Public
router.post('/register', async (req, res) => {
  const { username, email, password, avatarUrl } = req.body

  // Simple validation
  if (!username || !email || !password)
    res.status(400).json({ error: 'Missing some info' })

  try {
    // Check for existing user
    const user = await User.findOne({ username })
    user && res.status(400).json({ error: 'Username already taken' })

    // All good
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      avatarUrl,
    })
    await newUser.save()

    // Return token
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    )
    res.status(201).json({ message: 'Registered successfully', accessToken })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
})

// @route POST api/auth/login
// @desc Login user
// @Access Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  // Simple validation
  if (!email || !password)
    res.status(400).json({ error: 'Missing email or password' })

  try {
    // Check for existing user
    const user = await User.findOne({ email })
    !user && res.status(400).json({ error: 'Incorrect email' })

    // User found
    const passwordValid = await bcrypt.compare(password, user.password)
    !passwordValid && res.status(400).json({ error: 'Incorrect password' })

    // All good
    // Return token
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
    )
    res.status(202).json({ message: 'Logged in successfully', accessToken })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
