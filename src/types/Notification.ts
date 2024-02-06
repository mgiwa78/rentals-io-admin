import User from './User'

type TNotification = {
  title: string
  message: string
  status: boolean
  color: string
  createdAt: string
  linkType: string
  _id: string
  user: User
}

export default TNotification
