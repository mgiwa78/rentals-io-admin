import TState from './States'

type TFile = {
  name: string
  description: string
  path: string
  position: string
  _id: string
  status: TState
}

export default TFile
