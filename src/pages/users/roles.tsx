import React, {useEffect, useMemo, useState} from 'react'
import {PageTitle} from '../../_metronic/layout/core'
import type {PageLink} from '../../_metronic/layout/core'
import {KTIcon} from '../../_metronic/helpers'
import get from '../../lib/get'
import {useSelector} from 'react-redux'
import {RootState} from '../../redux/store'
import User from '../../types/User'
import {UserEditModal} from './user-edit-modal/UserEditModal'
import useUserManagement from './hooks/userManagement'
import Role from '../../types/Role'
import {selectAuth} from '../../redux/selectors/auth'
import CreateRole from './components/createrole'
import EditRole from './components/editrole'

const rolesBreadcrumbs: Array<PageLink> = [
  {
    title: 'User Management',
    path: '/users/roles',
    isSeparator: false,
    isActive: false,
  },
  {
    title: 'Roles',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

type RolesData = {
  role: Role
  countUsers: number
}
const Roles = () => {
  const [showEditRole, setShowEditRole] = useState<boolean>(false)
  const [showCreateRole, setShowCreateRole] = useState<boolean>(false)
  const [editRole, setEditRole] = useState<Role>()

  const {token} = useSelector(selectAuth)
  const [roles, setRoles] = useState<Array<RolesData> | null>(null)

  const setHideEditRole = async () => {
    setShowEditRole(false)
    setEditRole(undefined)
  }
  const getRoles = async () => {
    try {
      if (token) {
        const RESPONSE = await get('roles/withUsers', token)
        setRoles(RESPONSE.data)
      }
    } catch (error) {
      setRoles([])
      console.log(error)
    }
  }

  useEffect(() => {
    getRoles()
  }, [])

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [filter, setFilter] = useState(0)
  const [pageSize, setPageSize] = useState(5)

  const handlePageClick = (page: any) => {
    setCurrentPage(page)
  }

  const filteredData = useMemo(() => {
    setCurrentPage(0)
    return roles?.filter((role) =>
      Object.values(role.role).some(
        (value: any) =>
          typeof value === 'string' && value.toLowerCase().includes(searchTerm.trim().toLowerCase())
      )
    )
  }, [roles, searchTerm])

  const paginatedData = useMemo(() => {
    const startIndex = currentPage * pageSize
    return filteredData?.slice(startIndex, startIndex + pageSize)
  }, [filteredData, currentPage, pageSize])

  const totalPages = Math.ceil(filteredData?.length / pageSize)
  console.log(filteredData)
  const paginationItems = []

  for (let i = 0; i < totalPages; i++) {
    paginationItems.push(
      <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
        <button className='page-link' onClick={() => handlePageClick(i)}>
          {i + 1}
        </button>
      </li>
    )
  }
  return (
    <>
      <PageTitle breadcrumbs={rolesBreadcrumbs}>Roles list</PageTitle>
      <div className='row'>
        <div className='d-flex align-items-center justify-content-end mb-8'>
          <div className='d-flex align-items-center position-relative me-4'>
            <i className='ki-duotone ki-magnifier fs-3 position-absolute ms-3'>
              <span className='path1'></span>
              <span className='path2'></span>
            </i>
            <input
              onChange={(e) => setSearchTerm(e.target.value)}
              type='text'
              id='kt_filter_search'
              className='form-control form-control-sm form-control-solid w-150px ps-10'
              placeholder='Search'
            />
          </div>
          <div className='d-flex'>
            <select
              name='status'
              data-control='select2'
              data-hide-search='true'
              className='form-select form-select-sm form-select-solid w-80px select2-hidden-accessible'
              tabIndex={-1}
              aria-hidden='true'
              data-kt-initialized='1'
              onChange={(e) => {
                setCurrentPage(0)
                setPageSize(Number(e.target.value))
              }}
              defaultValue={pageSize}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <ul className='pagination'>
              <li className={`page-item previous ${currentPage === 0 ? 'disabled' : ''}`}>
                <a href='#' className='page-link' onClick={() => handlePageClick(currentPage - 1)}>
                  <i className='previous'></i>
                </a>
              </li>
              {paginationItems}
              <li className={`page-item next ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                <a href='#' className='page-link' onClick={() => handlePageClick(currentPage + 1)}>
                  <i className='next'></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
        {roles ? (
          paginatedData.map((role) => (
            <div className='col-md-4 mb-10' key={role.role._id}>
              <div className='card card-flush h-md-100'>
                <div className='card-header'>
                  <div className='card-title'>
                    <h2>{role.role.name}</h2>
                  </div>
                </div>
                <div className='card-body pt-1'>
                  <div className='fw-bold text-gray-600 mb-5'>
                    Total users with this role: {role.countUsers}
                  </div>
                  <div className='d-flex flex-column text-gray-600'>
                    {role.role.permissions.map((perms) => (
                      <div
                        key={perms._id + role.role._id}
                        className='d-flex align-items-center py-2'
                      >
                        <span className='bullet bg-primary me-3'></span>
                        {perms.action}
                      </div>
                    ))}
                    {/* 
                <div className='d-flex align-items-center py-2'>
                  <span className='bullet bg-primary me-3'></span>
                  <em>and 7 more...</em>
                </div> */}
                  </div>
                </div>
                <div className='card-footer flex-wrap pt-0'>
                  {/* <a
                  href='../../demo1/dist/apps/user-management/roles/view.html'
                  className='btn btn-light btn-active-primary my-1 me-2'
                >
                  View Role
                </a> */}
                  <button
                    type='button'
                    className='btn btn-light btn-active-light-primary my-1'
                    onClick={() => {
                      setEditRole(role.role)
                      setShowEditRole(true)
                    }}
                  >
                    Edit Role
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className='fv-row d-flex justify-content-center mh-300px'>
            <div className='h-40px w-40px spinner-border spinner-border-sm align-middle ms-2'></div>
          </div>
        )}

        <div className='col-md-4'>
          <div className='card '>
            <div className='card-body d-flex flex-center'>
              <button
                type='button'
                className='btn btn-clear d-flex flex-column flex-center'
                onClick={() => setShowCreateRole(true)}
              >
                <img
                  src='/assets/media/illustrations/sketchy-1/4.png'
                  alt=''
                  className='mw-100 mh-150px mb-7'
                />
                <div className='fw-bold fs-3 text-gray-600 text-hover-primary'>Add New Role</div>
              </button>
            </div>
          </div>
        </div>
      </div>
      {editRole ? (
        <EditRole show={showEditRole} editRole={editRole} handleClose={() => setHideEditRole()} />
      ) : (
        <CreateRole show={showCreateRole} handleClose={() => setShowCreateRole(false)} />
      )}
    </>
  )
}

export default Roles
