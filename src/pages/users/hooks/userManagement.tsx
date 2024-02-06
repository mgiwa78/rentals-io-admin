import {useReducer} from 'react'
import post from '../../../lib/post'
import {useSelector} from 'react-redux'
import {Console} from 'console'
import put from '../../../lib/put'
import get from '../../../lib/get'

// const initialState = {
//   user: {
//     avatar: 'avatars/300-6.jpg',
//     position: 'Art Director',
//     role: 'Administrator',
//     name: '',
//     email: '',
//   },
//   users: [],
//   isLoading: false,
//   itemIdForUpdate: undefined,
// }

const allRoles = [{name: 'superadmin'}, {name: 'Student'}, {name: 'Supervisor'}]

type InitialState = {
  user: {
    avatar: string
    position: string
    role: string
    name: string
    email: string
  }
  allRoles: {
    name: string
  }[]
  users: any
  isLoading: boolean
  itemIdForUpdate: any
}
function createInitialState() {
  const initialState: InitialState = {
    user: {
      avatar: 'avatars/300-6.jpg',
      position: 'Art Director',
      role: 'Administrator',
      name: '',
      email: '',
    },
    allRoles: [{name: 'superadmin'}, {name: 'Student'}, {name: 'Supervisor'}],
    users: null,
    isLoading: false,
    itemIdForUpdate: undefined,
  }
  return {
    ...initialState,
  }
}

// Define your reducer function
const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'SetItemIdForUpdate':
      return {...state, itemIdForUpdate: action.payload}
    case 'CreateUser':
      return {...state, itemIdForUpdate: action.payload}
    case 'getUserById':
      return {...state, user: action.payload}
    case 'getUsers':
      return {...state, users: action.payload}
    case 'UpdateLoading':
      return {...state, isLoading: action.payload}
    case 'UpdateError':
      return {...state, error: action.payload}
    case 'SetLoading':
      return {...state, error: action.payload}
    case 'selectUser':
      const rolesStatus: any = {}
      if (action.payload) {
        allRoles.map((r) => {
          return (rolesStatus[r.name] = action.payload.roles.some((e: any) => e.name === r.name))
        })
      }
      return {
        ...state,
        user: {
          ...action.payload,
          ...rolesStatus,
        },
      }
    case 'RemoveUser':
      return {...state, user: undefined}
    default:
      throw new Error('Unsupported action type')
  }
}

const useUserManagement = () => {
  const [state, dispatch] = useReducer(reducer, createInitialState)

  const isLoading = false
  const RemoveUser = () => dispatch({type: 'RemoveUser'})

  const createUser = async (newUserData: any, token: any) => {
    await post(`users`, newUserData, token, true, 'User Updated')
    getUsers(token, 'Users')
  }

  const getUserById = (id: any) => dispatch({type: 'getUserById', payload: id})

  const selectUser = async (userData: any) => {
    dispatch({type: 'selectUser', payload: userData})
  }
  const getUsers = async (token: string, role: string) => {
    let RESPONSE
    if (token) {
      try {
        dispatch({type: 'UpdateLoading', payload: true})
        if (role && role !== 'Users') {
          RESPONSE = await get(`users?type=${role}`, token)
        } else {
          RESPONSE = await get('users', token)
        }

        if (RESPONSE) {
          dispatch({type: 'getUsers', payload: RESPONSE.data})
        }
        dispatch({type: 'UpdateLoading', payload: false})
      } catch (error) {
        console.log(error)
      }
    }
  }
  const updateUser = async (newUserData: any, token: any) => {
    // UpdateLoading(true)
    await put(`users/${newUserData._id}`, newUserData, token, true, 'User Updated')
    getUsers(token, 'Users')
    // UpdateLoading(false)
    // dispatch({type: 'UpdateUser', payload: newUserData})
  }

  const setItemIdForUpdate = (id: any) => {
    return dispatch({type: 'SetItemIdForUpdate', payload: id})
  }

  return {
    createUser,
    RemoveUser,
    updateUser,
    selectUser,
    setItemIdForUpdate,
    getUserById,
    getUsers,
    users: state.users,
    isLoading: state.isLoading,
    user: state.user,
    error: state.error,
    allRoles: state.allRoles,
    itemIdForUpdate: state.itemIdForUpdate,
  }
}

export default useUserManagement
