import { model, Schema } from 'mongoose'

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, 'Set password for user'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: '',
    },
    token: String,
    avatarURL: String,
  },
  {
    versionKey: false,
  }
)

const User = model('User', userSchema, 'user')

export { User }
