const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: 'rooms',
    },
    text: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('messages', MessageSchema)
