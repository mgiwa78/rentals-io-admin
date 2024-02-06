import {UserEditModalForm} from './UserEditModalForm'
import {isNotEmpty} from '../../../_metronic/helpers'
import {useEffect, useState} from 'react'
import useUserManagement from '../hooks/userManagement'
// import {useListView} from '../core/ListViewProvider'
// import {getUserById} from '../core/_requests'

const UserEditModalFormWrapper = ({state}: {state: any}) => {
  const {itemIdForUpdate, isLoading, user, error} = state
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)

  useEffect(() => {}, [user])

  if (!itemIdForUpdate) {
    return <UserEditModalForm state={state} />
  }
  if (!isLoading && !error && user) {
    return <UserEditModalForm state={state} />
  }

  return null
}

export {UserEditModalFormWrapper}
