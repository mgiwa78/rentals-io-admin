import User from './User'
import TTicket from './ticket'
import TTicketCategories from './ticketCategories'

type TTicketResponse = {
  ticket: TTicket
  message: string
  createdAt: string
  author: User
  _id: string
}

export default TTicketResponse
