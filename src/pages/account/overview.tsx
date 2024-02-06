import React, {useEffect, useState} from 'react'
import {KTIcon, toAbsoluteUrl} from '../../_metronic/helpers'
import {Link, useParams} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {TProject} from '../../types/Project'
import {selectAuth} from '../../redux/selectors/auth'
import get from '../../lib/get'
import {PageLink, PageTitle} from '../../_metronic/layout/core'
import ProfileDetails from './components/profileDetails'
import User from '../../types/User'

const AccountOverview = () => {
  const {token} = useSelector(selectAuth)
  const [profile, setProfile] = useState<User>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const accountOverviewBreadcrumbs: Array<PageLink> = [
    {
      title: 'Projects',
      path: '/projects/all',
      isSeparator: false,
      isActive: false,
    },
    {
      title: '',
      path: '',
      isSeparator: true,
      isActive: false,
    },
  ]

  useEffect(() => {
    const getProfile = async () => {
      setIsLoading(true)
      try {
        if (token) {
          const RESPONSE = await get('users/myProfile/view', token)
          setProfile(RESPONSE.data)
          setIsLoading(false)
        }
      } catch (error) {
        setIsLoading(false)
        console.log(error)
      }
    }
    getProfile()
  }, [token])

  return (
    <>
      <PageTitle breadcrumbs={accountOverviewBreadcrumbs}>Account Overview</PageTitle>
      <ProfileDetails profile={profile} />
    </>
  )
}

export default AccountOverview
