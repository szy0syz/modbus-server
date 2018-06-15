const mongoose = require('mongoose')

const Schema = mongoose.Schema

const MainSchema = new Schema({
  _optCode: Schema.Types.Buffer,
  _count: Schema.Types.Number,
  _oriData: Schema.Types.Buffer,
  _data: [
    {
        date: Schema.Types.Buffer,
        DI: Schema.Types.Buffer,
        analogReg: Schema.Types.Buffer,
        innerReg: Schema.Types.Buffer,
        outerReg: Schema.Types.Buffer
    }
  ],
  _crc: Schema.Types.Buffer,
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

// 虚拟字段，没有实际存入数据库中，类似计算字段
UserSchema.virtual('isLocked').get(function () {
  return true
})



mongoose.model('main', UserSchema)
