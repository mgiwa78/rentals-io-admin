import TState from './States'

type TWorkflow = {
  _id: string
  color?: string
  default?: string
  defaultOrder?: string
  description: string
  states?: Array<TState>
  title: string
  count: string
}

export default TWorkflow
