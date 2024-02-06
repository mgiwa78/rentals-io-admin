import RentalCategory from './RentalCategory'
import User from './User'

type Rental = {
  _id: string
  name: string
  brand: string
  rate: string
  description: string
  size: string
  category: RentalCategory
  imgPath: string
  vendor: User
}

export default Rental
