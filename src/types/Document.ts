import User from './User'

type TDocument = {
  _id: string
  name: string
  state: string
  title: string
  author: User
  content: string
  createdAt: string
  description: string
}

export default TDocument
