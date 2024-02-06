import TFile from './File'
import TState from './States'
import User from './User'
import TWorkflow from './Workflow'

export interface TProject {
  title: string
  _id: string
  createdAt: string
  deadline: string
  description: string
  student: User
  workflow: TWorkflow
  files: Array<TFile>
  supervisor: string | User
  keywords: string[]
  completionDate: Date
  category: string
  methodology: string
  resources: string[]
  ethicalConsiderations: string
  milestones: {name: string; date: Date}[]
  status: TState
  comments: string
}
