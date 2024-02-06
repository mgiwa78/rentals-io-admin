import Role from './Role'

type User = {
  _id: string
  email: string
  avatar?: string
  fullName: string
  createdAt: string
  studentId?: string
  contact: string
  password?: string
  supervisor?: User
  roles?: Array<Role>
  rolesState?: any
  notification: {
    email: boolean
  }
}

export type UserEdit = {
  _id?: string
  email?: string
  avatar?: string
  contact?: string
  fullName?: string
  department?: string
  createdAt?: string
  studentId?: string
  password?: string
  roles?: Array<Role>
  rolesState?: any
  notification: {
    email: boolean
  }
}

export default User
