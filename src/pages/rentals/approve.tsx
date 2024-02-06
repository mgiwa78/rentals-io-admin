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

const ApproveRentals: FC = () => {
  const approveRentals: Array<PageLink> = [
    {
      title: 'Home',
      path: '/',
      isSeparator: false,
      isActive: false,
    },
    {
      title: '',
      path: '',
      isSeparator: true,
      isActive: false,
    },
    {
      title: 'Rentals',
      path: '/rentals',
      isSeparator: false,
      isActive: false,
    },
    {
      title: ' ',
      path: '',
      isSeparator: true,
      isActive: false,
    },
  ]

  return (
    <>
      <PageTitle breadcrumbs={approveRentals}>Approve</PageTitle>
    </>
  )
}

export {ApproveRentals}