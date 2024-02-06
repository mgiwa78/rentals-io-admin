/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useEffect, useState} from 'react'
import {PageLink, PageTitle} from '../../_metronic/layout/core'
import {useSelector} from 'react-redux'
import {selectAuth} from '../../redux/selectors/auth'
import Role from '../../types/Role'
import get from '../../lib/get'

type RolesData = {
  role: Role
  countUsers: number
}

const Setting: FC = () => {
  const setting: Array<PageLink> = [
    {
      title: 'Home',
      path: '/',
      isSeparator: false,
      isActive: false,
    },
    {
      title: 'Rentals ',
      path: '/rentals',
      isSeparator: true,
      isActive: false,
    },
  ]
  const [roles, setRoles] = useState<Array<RolesData>>([])
  const {token} = useSelector(selectAuth)
  useEffect(() => {
    const getRoles = async () => {
      try {
        if (token) {
          const RESPONSE = await get('roles/withUsers', token)
          setRoles(RESPONSE.data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getRoles()
  }, [token])

  return (
    <>
      <PageTitle breadcrumbs={setting}>Settings</PageTitle>
    </>
  )
}

export {Setting}
