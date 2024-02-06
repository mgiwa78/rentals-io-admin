import User from './User'
import TTicketCategories from './ticketCategories'

type TTicket = {
  description: string
  category: TTicketCategories
  status: string
  subject: string
  createdAt: string
  author: User
  _id: string
}

export default TTicket
