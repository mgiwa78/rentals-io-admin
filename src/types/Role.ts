import Permission from './Permission'

type Role = {
  _id: string
  name: string
  permissions: Array<Permission>
}

export default Role
