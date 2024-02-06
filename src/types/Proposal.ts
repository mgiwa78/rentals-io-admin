import User from './User'

export interface TProposal {
  title: string
  description: string
  status: string
  deadline: string
  workflow: string
  field: string
  methodology: string
  objectives: string[]
  timeline: string
  files: Array<{
    name: string
    path: string
    _id: string
  }>
  createdAt: string
  student: User
  _id: string
}
