const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization')
  const token = authHeader && authHeader.split(' ')[1]

  !token && res.status(401).json({ error: 'Access token not found' })

  try {
    //decrypt user info inside the token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    //attach user info to request
    req.userId = decoded.userId
    // res.status(200).json(req.userId)
    next()
  } catch (error) {
    console.error(error)
    res.status(403).json({ error: 'Invalid token' })
  }
}

module.exports = verifyToken
