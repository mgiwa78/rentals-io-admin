import axios from 'axios'
import {AuthModel, UserModel} from './_models'
import get from '../../../lib/get'
import post from '../../../lib/post'

const API_URL = process.env.REACT_APP_API_URL

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/verify_token`
export const LOGIN_URL = `${API_URL}auth/signin`
export const REGISTER_URL = `${API_URL}/register`
export const PASSWORD_RESET = `${API_URL}/forgotPassword`

// Server should return AuthModel
export async function login(email: string, password: string) {
  try {
    const RESPONSE = await axios<AuthModel>({
      method: 'post',
      url: LOGIN_URL,
      withCredentials: false,
      data: {
        email,
        password,
      },
    })

    return RESPONSE.data
  } catch (error: any) {
    throw error
  }
}

// Server should return AuthModel
export function register(
  email: string,
  firstname: string,
  lastname: string,
  password: string,
  password_confirmation: string
) {
  return axios.post(REGISTER_URL, {
    email,
    first_name: firstname,
    last_name: lastname,
    password,
    password_confirmation,
  })
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post<{result: boolean}>(PASSWORD_RESET, {
    email,
  })
}
export async function passwordReset(email: string) {
  try {
    const RESPONSE = await post('auth/forgotPassword', {email: email})
    return RESPONSE
  } catch (error: any) {
    throw new Error(error)
  }
}

export function getUserByToken(token: string) {
  return axios.post<UserModel>(GET_USER_BY_ACCESSTOKEN_URL, {
    api_token: token,
  })
}
