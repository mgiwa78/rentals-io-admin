/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import {PageLink, PageTitle} from '../../_metronic/layout/core'
import Notifications from './components/notifications'

const Dashboard: FC = () => (
  <>
    <div className='row g-5 g-xl-8'>
      <div className='col-xl-6'>
        <Notifications />
      </div>
    </div>
  </>
)

const SupervisorDashboard: FC = () => {
  const SupervisorDahboardb: Array<PageLink> = [
    {
      title: 'Home',
      path: '/',
      isSeparator: false,
      isActive: false,
    },
    {
      title: 'Supervisor Dahboard',
      path: '/dashboard',
      isSeparator: true,
      isActive: false,
    },
  ]
  return (
    <>
      <PageTitle breadcrumbs={SupervisorDahboardb}>Supervisor Dashboard</PageTitle>
      <Dashboard />
    </>
  )
}

export {SupervisorDashboard}
