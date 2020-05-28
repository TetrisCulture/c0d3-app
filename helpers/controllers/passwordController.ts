import db from '../dbload'
import _ from 'lodash'
import bcrypt from 'bcrypt'
import { nanoid } from 'nanoid'
import { UserInputError, AuthenticationError } from 'apollo-server-micro'
import { changeChatPassword } from '../mattermost'
import { Context } from '../../@types/helpers'
import { sendResetEmail } from '../mail'
import { decode, encode } from '../encoding'

const { User } = db
const THREE_DAYS = 1000 * 60 * 60 * 24 * 3

export const reqPwReset = async (
  _parent: void,
  arg: { userOrEmail: string },
  ctx: Context
) => {
  const { req } = ctx
  try {
    const userOrEmail = _.get(arg, 'userOrEmail', null)
    if (!userOrEmail) {
      throw new UserInputError('Please provide username or email')
    }

    let user: any
    if (userOrEmail.indexOf('@') !== -1) {
      user = await User.findOne({
        where: { email: userOrEmail }
      })
    } else {
      user = await User.findOne({
        where: { username: userOrEmail }
      })
    }

    if (!user) {
      throw new UserInputError('User does not exist')
    }

    const encodedToken = encode({
      userId: user.id,
      userToken: nanoid()
    })

    user.forgotToken = encodedToken
    user.expiration = new Date(Date.now() + THREE_DAYS)
    await user.save()
    sendResetEmail(user.email, user.forgotToken)

    return { success: true, token: user.forgotToken }
  } catch (err) {
    if (!err.extensions) {
      req.error(err)
    }
    throw new Error(err)
  }
}

export const changePw = async (
  _parent: void,
  args: {
    token: string
    password: string
  },
  ctx: Context
) => {
  const { req } = ctx
  try {
    const { password, token } = args
    const { userId } = decode(token)
    const user = await User.findByPk(userId)
    if (!user) {
      throw new AuthenticationError('User does not exist')
    }
    if (token !== user.forgotToken || Date.now() > user.expiration) {
      throw new AuthenticationError('Invalid Token')
    }
    const hash = await bcrypt.hash(password, 10)
    user.expiration = null
    user.forgotToken = null
    user.password = hash
    await user.save()

    try {
      await changeChatPassword(user.email, password)
    } catch {
      throw new Error('Mattermost did not set password')
    }

    return {
      success: true
    }
  } catch (err) {
    if (!err.extensions) {
      req.error(err)
    }
    throw new Error(err)
  }
}
