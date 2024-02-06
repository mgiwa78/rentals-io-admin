/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useEffect, useState} from 'react'
import {PageLink, PageTitle} from '../../_metronic/layout/core'
import {useSelector} from 'react-redux'
import {selectAuth} from '../../redux/selectors/auth'
import Role from '../../types/Role'
import get from '../../lib/get'
import {KTIcon, toAbsoluteUrl} from '../../_metronic/helpers'
import clsx from 'clsx'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import RentalCategory from '../../types/RentalCategory'
import Rental from '../../types/Rental'

type RolesData = {
  role: Role
  countUsers: number
}

const vendorCatrgoriesDefault = {
  name: '',
  picture: '',
}

const AllCategories: FC = () => {
  const [isUserLoading, setIsUserLoading] = useState<any>(false)
  const [categories, setCategories] = useState<Array<RentalCategory>>()

  const editRental = Yup.object().shape({
    name: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Name is required'),
  })

  const blankImg = toAbsoluteUrl('/media/svg/avatars/blank.svg')

  const formik = useFormik({
    initialValues: vendorCatrgoriesDefault,
    validationSchema: editRental,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      try {
        console.log()
        setSubmitting(false)
      } catch (ex) {
        console.error(ex)
      } finally {
        setSubmitting(true)
      }
    },
  })

  const rentalsCategories: Array<PageLink> = [
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
  const {token} = useSelector(selectAuth)
  const getCategories = async () => {
    try {
      if (token) {
        const RESPONSE = await get('categories', token)
        setCategories(RESPONSE.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getCategories()
  }, [token])

  // const [vendors, setVendors] = useState<any>(false)

  return (
    <>
      <PageTitle breadcrumbs={rentalsCategories}>Categories</PageTitle>
      <div className={`card mb-5 mb-xl-8`}>
        {/* begin::Header */}
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>All Categories</span>
            <span className='text-muted mt-1 fw-semibold fs-7'>Over 500 orders</span>
          </h3>
          <div className='card-toolbar'>
            {/* begin::Menu */}
            <button
              type='button'
              className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
              data-kt-menu-trigger='click'
              data-kt-menu-placement='bottom-end'
              data-kt-menu-flip='top-end'
            >
              <KTIcon iconName='category' className='fs-2' />
            </button>
            {/* begin::Menu 2 */}
            <div
              className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold w-200px'
              data-kt-menu='true'
            >
              {/* begin::Menu item */}
              <div className='menu-item px-3'>
                <div className='menu-content fs-6 text-dark fw-bold px-3 py-4'>Quick Actions</div>
              </div>
              {/* end::Menu item */}
              {/* begin::Menu separator */}
              <div className='separator mb-3 opacity-75'></div>
              {/* end::Menu separator */}
              {/* begin::Menu item */}
              <div className='menu-item px-3'>
                <a href='#' className='menu-link px-3'>
                  New Ticket
                </a>
              </div>
              {/* end::Menu item */}
              {/* begin::Menu item */}
              <div className='menu-item px-3'>
                <a href='#' className='menu-link px-3'>
                  New Customer
                </a>
              </div>
              {/* end::Menu item */}
              {/* begin::Menu item */}
              <div
                className='menu-item px-3'
                data-kt-menu-trigger='hover'
                data-kt-menu-placement='right-start'
                data-kt-menu-flip='left-start, top'
              >
                {/* begin::Menu item */}
                <a href='#' className='menu-link px-3'>
                  <span className='menu-title'>New Group</span>
                  <span className='menu-arrow'></span>
                </a>
                {/* end::Menu item */}
                {/* begin::Menu sub */}
                <div className='menu-sub menu-sub-dropdown w-175px py-4'>
                  {/* begin::Menu item */}
                  <div className='menu-item px-3'>
                    <a href='#' className='menu-link px-3'>
                      Admin Group
                    </a>
                  </div>
                  {/* end::Menu item */}
                  {/* begin::Menu item */}
                  <div className='menu-item px-3'>
                    <a href='#' className='menu-link px-3'>
                      Staff Group
                    </a>
                  </div>
                  {/* end::Menu item */}
                  {/* begin::Menu item */}
                  <div className='menu-item px-3'>
                    <a href='#' className='menu-link px-3'>
                      Member Group
                    </a>
                  </div>
                  {/* end::Menu item */}
                </div>
                {/* end::Menu sub */}
              </div>
              {/* end::Menu item */}
              {/* begin::Menu item */}
              <div className='menu-item px-3'>
                <a href='#' className='menu-link px-3'>
                  New Contact
                </a>
              </div>
              {/* end::Menu item */}
              {/* begin::Menu separator */}
              <div className='separator mt-3 opacity-75'></div>
              {/* end::Menu separator */}
              {/* begin::Menu item */}
              <div className='menu-item px-3'>
                <div className='menu-content px-3 py-3'>
                  <a className='btn btn-primary btn-sm px-4' href='#'>
                    Generate Reports
                  </a>
                </div>
              </div>
              {/* end::Menu item */}
            </div>
            {/* end::Menu 2 */}
            {/* end::Menu */}
          </div>
        </div>
        {/* end::Header */}
        {/* begin::Body */}
        <div className='card-body py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
              {/* begin::Table head */}
              <thead>
                <tr className='fw-bold text-muted'>
                  <th className='w-25px'>
                    <div className='form-check form-check-sm form-check-custom form-check-solid'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        value='1'
                        data-kt-check='true'
                        data-kt-check-target='.widget-13-check'
                      />
                    </div>
                  </th>
                  <th className='min-w-150px'> Id</th>
                  <th className='min-w-140px'>Name</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody>
                {categories?.map((category: RentalCategory) => (
                  <tr>
                    <td>
                      <div className='form-check form-check-sm form-check-custom form-check-solid'>
                        <input
                          className='form-check-input widget-13-check'
                          type='checkbox'
                          value='1'
                        />
                      </div>
                    </td>
                    <td>
                      <a href='#' className='text-dark fw-bold text-hover-primary fs-6'>
                        {category._id}
                      </a>
                    </td>
                    <td>
                      <a
                        href='#'
                        className='text-dark fw-bold text-hover-primary d-block mb-1 fs-6'
                      >
                        {category.name}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export {AllCategories}
