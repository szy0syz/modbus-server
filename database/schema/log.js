const mongoose = require('mongoose')

const Schema = mongoose.Schema

const LogSchema = new Schema({
  data: Schema.Types.Buffer,
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})

mongoose.model('log', LogSchema)
