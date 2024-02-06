import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {selectToken, selectUser} from '../../../redux/selectors/auth'
import TNotification from '../../../types/Notification'
import get from '../../../lib/get'
import {formatDistanceToNow} from 'date-fns'
import {KTIcon} from '../../../_metronic/helpers'
import post from '../../../lib/post'

const Notifications = () => {
  const token = useSelector(selectToken)
  const user = useSelector(selectUser)

  const [notifications, setNotifications] = useState<Array<TNotification>>()
  const [markAsReadIsLoading, setmarkAsReadIsLoading] = useState<boolean>(false)
  const getNotifications = async () => {
    const RESPONSE = await get(`notifications`, token)

    if (RESPONSE?.data) {
      setNotifications(RESPONSE.data)
    }
  }
  const markAsRead = async () => {
    setmarkAsReadIsLoading(true)
    const RESPONSE = await post(`notifications/mark-as-read`, {}, token)

    if (RESPONSE?.data) {
      setNotifications(RESPONSE.data)
    }
    setmarkAsReadIsLoading(false)
  }

  useEffect(() => {
    getNotifications()
  }, [user._id])

  return (
    <div className='card card-xl-stretch mb-5 mb-xl-8'>
      <div className='card-header border-0'>
        <h3 className='card-title fw-bold text-dark'>Notifications</h3>
        <div className='card-toolbar'>
          <button onClick={() => markAsRead()} className='btn btn-sm btn-light-primary'>
            <KTIcon iconName='messages' className='fs-2' />
            {!markAsReadIsLoading && <span className='indicator-label'> Mark all as read</span>}
            {markAsReadIsLoading && (
              <span className='indicator-progress' style={{display: 'block'}}>
                Marking all as read...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>
      </div>
      <div className='card-body pt-2'>
        {notifications?.length > 0 ? (
          <>
            {notifications?.slice(0, 6).map((notification) => (
              <div
                key={notification._id}
                className='d-flex justify-content-start align-items-center mb-8'
              >
                <span
                  className={`bullet bullet-vertical h-40px bg-${
                    notification?.status ? 'secondary' : 'warning'
                  }`}
                ></span>
                <div className='flex-grow-1 mx-5'>
                  <a href='#' className='text-gray-800 text-hover-primary fw-bold fs-7'>
                    {notification?.title}
                  </a>
                  <span className='fs-6 text-muted fw-semibold d-block'>
                    {notification?.message}
                  </span>
                </div>
                <div>
                  <span className='text-muted fw-semibold d-block'>
                    {formatDistanceToNow(new Date(notification?.createdAt), {addSuffix: true})}
                  </span>
                </div>
              </div>
            ))}
            {notifications?.length >= 6 ? (
              <button
                type='button'
                className='btn   btn-color-primary btn-active-light-primary'
                data-kt-menu-trigger='click'
                data-kt-menu-placement='bottom-end'
              >
                View All
              </button>
            ) : (
              ''
            )}
          </>
        ) : (
          <div className='flex-grow-1'>
            <span className='text-muted fs-5 d-block'>No Notifications</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications
