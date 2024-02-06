/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import {useIntl} from 'react-intl'
import {KTIcon} from '../../../../helpers'
import {SidebarMenuItemWithSub} from './SidebarMenuItemWithSub'
import {SidebarMenuItem} from './SidebarMenuItem'
import {useSelector} from 'react-redux'
import {RootState} from '../../../../../redux/store'

const SidebarMenuMain = () => {
  const intl = useIntl()
  const currentUser = useSelector((state: RootState) => state.auth.user)

  return (
    <>
      <SidebarMenuItem
        to='/dashboard'
        icon='element-11'
        title={intl.formatMessage({id: 'MENU.DASHBOARD'})}
        fontIcon='bi-app-indicator'
      />
      {currentUser?.roles.some((role) => role.name === 'superadmin') && (
        <SidebarMenuItem to='/builder' icon='switch' title='Layout Builder' fontIcon='bi-layers' />
      )}
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Menu</span>
        </div>
      </div>{' '}
      {currentUser?.roles.some((role) => role.name === 'superadmin') && (
        <>
          <SidebarMenuItemWithSub
            to='/users'
            title='Users'
            fontIcon='bi-people'
            icon='profile-user'
          >
            <>
              {currentUser?.roles.some((role) => role.name === 'superadmin') && (
                <>
                  <SidebarMenuItem to='/users/all' title='All' hasBullet={true} />
                  <SidebarMenuItem to='/users/vendors' title='Vendors' hasBullet={true} />
                  <SidebarMenuItem to='/users/customers' title='Customers' hasBullet={true} />
                  <SidebarMenuItem to='/users/roles' title='Roles' hasBullet={true} />
                  <SidebarMenuItem to='/users/permissions' title='Permissions' hasBullet={true} />
                </>
              )}
            </>
          </SidebarMenuItemWithSub>
          <SidebarMenuItemWithSub
            to='/rentals'
            title='Rentals'
            fontIcon='bi-box'
            icon='external-drive'
          >
            <>
              {currentUser?.roles.some((role) => role.name === 'superadmin') && (
                <>
                  <SidebarMenuItem to='/rentals/all' title='All' hasBullet={true} />
                  <SidebarMenuItem
                    to='/rentals/categories/create'
                    title='Create Category'
                    hasBullet={true}
                  />
                  <SidebarMenuItem
                    to='/rentals/categories/all'
                    title='All Categories'
                    hasBullet={true}
                  />
                  <SidebarMenuItem to='/rentals/approve' title='Approve' hasBullet={true} />
                  <SidebarMenuItem to='/rentals/create' title='Create' hasBullet={true} />
                </>
              )}
            </>
          </SidebarMenuItemWithSub>
          <SidebarMenuItemWithSub
            to='/finance'
            title='Finance'
            fontIcon='bi-chart'
            icon='chart-pie-3'
          >
            <>
              {currentUser?.roles.some((role) => role.name === 'superadmin') && (
                <>
                  <SidebarMenuItem to='/finance/overview' title='Overview' hasBullet={true} />
                  <SidebarMenuItem to='/finance/report' title='Report' hasBullet={true} />
                </>
              )}
            </>
          </SidebarMenuItemWithSub>
          <SidebarMenuItem fontIcon='bi-chart' icon='setting-3' to='/settings' title='Settings' />
        </>
      )}
      <SidebarMenuItem to='/help-center' title='Help center' fontIcon='bi-chart' icon='chart' />
    </>
  )
}

export {SidebarMenuMain}
