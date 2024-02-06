/* eslint-disable react/jsx-no-target-blank */
import {useDispatch} from 'react-redux'
import {logout} from '../../../../redux/slice/authSlice'
import {KTIcon} from '../../../helpers'

const SidebarFooter = () => {
  const dispatch = useDispatch()
  const handleLogout = () => {
    dispatch(logout())
  }
  return (
    <div className='app-sidebar-footer flex-column-auto pt-2 pb-6 px-6' id='kt_app_sidebar_footer'>
      <button
        onClick={() => handleLogout()}
        className='btn btn-flex flex-center btn-custom btn-primary overflow-hidden text-nowrap px-0 h-40px w-100'
        data-bs-toggle='tooltip'
        data-bs-trigger='hover'
        data-bs-dismiss-='click'
        title='Sign Out'
      >
        <span className='btn-label'>Sign out</span>
        <KTIcon iconName='exit-right' className='btn-icon fs-2 m-0' />
      </button>
    </div>
  )
}

export {SidebarFooter}
