const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RoomSchema = new Schema(
  {
    roomName: {
      type: String,
      required: true,
      // minlength: 3,
      // maxlength: 20,
      unique: true,
    },
    desc: {
      type: String,
      maxlength: 50,
      required: true,
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
    ],
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('rooms', RoomSchema)
