import {useEffect} from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {useAuth} from './core/Auth'
import {useDispatch, useSelector} from 'react-redux'
import {logout} from '../../redux/slice/authSlice'

export function Logout() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(logout())
    document.location.reload()
  }, [])

  return (
    <Routes>
      <Route index element={<Navigate to='/auth/login' />}></Route>
    </Routes>
  )
}
