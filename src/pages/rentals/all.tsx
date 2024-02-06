/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useEffect, useState} from 'react'
import {PageLink, PageTitle} from '../../_metronic/layout/core'
import {useSelector} from 'react-redux'
import {selectAuth} from '../../redux/selectors/auth'
import Role from '../../types/Role'
import get from '../../lib/get'
import {KTIcon, toAbsoluteUrl} from '../../_metronic/helpers'
import Rental from '../../types/Rental'

type RolesData = {
  role: Role
  countUsers: number
}

const AllRentals: FC = () => {
  const allRentals: Array<PageLink> = [
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
      title: '',
      path: '',
      isSeparator: true,
      isActive: false,
    },
  ]
  const [roles, setRoles] = useState<Array<RolesData>>([])
  const [rentals, setRentals] = useState<Array<Rental>>([])
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

  // const [vendors, setVendors] = useState<any>(false)

  const getRentals = async () => {
    if (token) {
      const RESPONSE = await get('rentals', token)
      if (RESPONSE?.data) setRentals(RESPONSE.data)
    }
  }

  useEffect(() => {
    getRentals()
  }, [])
  return (
    <>
      <PageTitle breadcrumbs={allRentals}>All</PageTitle>
      <div className='card card-flush'>
        <div className='card-header align-items-center py-5 gap-2 gap-md-5'>
          <div className='card-title'>
            <div className='d-flex align-items-center position-relative my-1'>
              <i className='ki-duotone ki-magnifier fs-3 position-absolute ms-4'>
                <span className='path1'></span>
                <span className='path2'></span>
              </i>
              <input
                type='text'
                data-kt-ecommerce-product-filter='search'
                className='form-control form-control-solid w-250px ps-12'
                placeholder='Search Product'
              />
            </div>
          </div>
          <div className='card-toolbar flex-row-fluid justify-content-end gap-5'>
            <div className='w-100 mw-150px'>
              <select
                className='form-select form-select-solid select2-hidden-accessible'
                data-control='select2'
                data-hide-search='true'
                data-placeholder='Status'
                data-kt-ecommerce-product-filter='status'
                data-select2-id='select2-data-9-gfmz'
                tabIndex={-1}
                aria-hidden='true'
                data-kt-initialized='1'
              >
                <option>Select Status</option>
                <option value='all'>All</option>
                <option value='published'>Published</option>
                <option value='scheduled'>Scheduled</option>
                <option value='inactive'>Inactive</option>
              </select>
            </div>
            <a
              href='../../demo1/dist/apps/ecommerce/catalog/add-product.html'
              className='btn btn-primary'
            >
              Add Product
            </a>
          </div>
        </div>
        <div className='card-body pt-0'>
          <div
            id='kt_ecommerce_products_table_wrapper'
            className='dataTables_wrapper dt-bootstrap4 no-footer'
          >
            <div className='table-responsive'>
              <table
                className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'
                id='kt_ecommerce_products_table'
              >
                <thead>
                  <tr className='text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0'>
                    <th
                      className='w-10px pe-2 sorting_disabled'
                      rowSpan={1}
                      colSpan={1}
                      aria-label='
															
																
															
														'
                      style={{width: '29.9px'}}
                    >
                      <div className='form-check form-check-sm form-check-custom form-check-solid me-3'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          data-kt-check='true'
                          data-kt-check-target='#kt_ecommerce_products_table .form-check-input'
                          value='1'
                        />
                      </div>
                    </th>
                    <th
                      className='min-w-200px sorting'
                      tabIndex={0}
                      aria-controls='kt_ecommerce_products_table'
                      rowSpan={1}
                      colSpan={1}
                      aria-label='Product: activate to sort column ascending'
                      style={{width: '257.875px'}}
                    >
                      Product
                    </th>
                    <th
                      className='text-end min-w-100px sorting'
                      tabIndex={0}
                      aria-controls='kt_ecommerce_products_table'
                      rowSpan={1}
                      colSpan={1}
                      aria-label='SKU: activate to sort column ascending'
                      style={{width: '130.275px'}}
                    >
                      ID
                    </th>

                    <th
                      className='text-end min-w-100px sorting'
                      tabIndex={0}
                      aria-controls='kt_ecommerce_products_table'
                      rowSpan={1}
                      colSpan={1}
                      aria-label='Price: activate to sort column ascending'
                      style={{width: '130.275px'}}
                    >
                      Rate
                    </th>

                    <th
                      className='text-end min-w-70px sorting_disabled'
                      rowSpan={1}
                      colSpan={1}
                      aria-label='Actions'
                      style={{width: '132.75px'}}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='fw-semibold text-gray-600'>
                  {rentals.map((rental) => (
                    <tr className='odd'>
                      <td>
                        <div className='form-check form-check-sm form-check-custom form-check-solid'>
                          <input className='form-check-input' type='checkbox' value='1' />
                        </div>
                      </td>
                      <td>
                        <div className='d-flex align-items-center'>
                          <a
                            href='../../demo1/dist/apps/ecommerce/catalog/edit-product.html'
                            className='symbol symbol-50px'
                          >
                            <span
                              className='symbol-label'
                              style={{
                                backgroundImage: `url(${
                                  rental.imgPath
                                    ? rental.imgPath
                                    : toAbsoluteUrl('/media/svg/files/blank-image.svg')
                                })`,
                              }}
                            ></span>
                          </a>
                          <div className='ms-5'>
                            <a
                              href='../../demo1/dist/apps/ecommerce/catalog/edit-product.html'
                              className='text-gray-800 text-hover-primary fs-5 fw-bold'
                              data-kt-ecommerce-product-filter='product_name'
                            >
                              {rental.name}
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className='text-end pe-0'>
                        <span className='fw-bold'>{rental._id}</span>
                      </td>

                      <td className='text-end pe-0'>{rental?.rate}</td>

                      <td className='text-end'>
                        <a
                          href='#'
                          className='btn btn-sm btn-light btn-flex btn-center btn-active-light-primary'
                          data-kt-menu-trigger='click'
                          data-kt-menu-placement='bottom-end'
                        >
                          Actions
                          <i className='ki-duotone ki-down fs-5 ms-1'></i>
                        </a>
                        <div
                          className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-125px py-4'
                          data-kt-menu='true'
                        >
                          <div className='menu-item px-3'>
                            <a
                              href='../../demo1/dist/apps/ecommerce/catalog/edit-product.html'
                              className='menu-link px-3'
                            >
                              Edit
                            </a>
                          </div>
                          <div className='menu-item px-3'>
                            <a
                              href='#'
                              className='menu-link px-3'
                              data-kt-ecommerce-product-filter='delete_row'
                            >
                              Delete
                            </a>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='row'>
              <div className='col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start'>
                <div className='dataTables_length' id='kt_ecommerce_products_table_length'>
                  <label>
                    <select
                      name='kt_ecommerce_products_table_length'
                      aria-controls='kt_ecommerce_products_table'
                      className='form-select form-select-sm form-select-solid'
                    >
                      <option value='10'>10</option>
                      <option value='25'>25</option>
                      <option value='50'>50</option>
                      <option value='100'>100</option>
                    </select>
                  </label>
                </div>
              </div>
              <div className='col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end'>
                <div
                  className='dataTables_paginate paging_simple_numbers'
                  id='kt_ecommerce_products_table_paginate'
                >
                  <ul className='pagination'>
                    <li
                      className='paginate_button page-item previous disabled'
                      id='kt_ecommerce_products_table_previous'
                    >
                      <a
                        href='#'
                        aria-controls='kt_ecommerce_products_table'
                        data-dt-idx='0'
                        tabIndex={0}
                        className='page-link'
                      >
                        <i className='previous'></i>
                      </a>
                    </li>
                    <li className='paginate_button page-item active'>
                      <a
                        href='#'
                        aria-controls='kt_ecommerce_products_table'
                        data-dt-idx='1'
                        tabIndex={0}
                        className='page-link'
                      >
                        1
                      </a>
                    </li>
                    <li className='paginate_button page-item '>
                      <a
                        href='#'
                        aria-controls='kt_ecommerce_products_table'
                        data-dt-idx='2'
                        tabIndex={0}
                        className='page-link'
                      >
                        2
                      </a>
                    </li>
                    <li className='paginate_button page-item '>
                      <a
                        href='#'
                        aria-controls='kt_ecommerce_products_table'
                        data-dt-idx='3'
                        tabIndex={0}
                        className='page-link'
                      >
                        3
                      </a>
                    </li>
                    <li className='paginate_button page-item '>
                      <a
                        href='#'
                        aria-controls='kt_ecommerce_products_table'
                        data-dt-idx='4'
                        tabIndex={0}
                        className='page-link'
                      >
                        4
                      </a>
                    </li>
                    <li className='paginate_button page-item '>
                      <a
                        href='#'
                        aria-controls='kt_ecommerce_products_table'
                        data-dt-idx='5'
                        tabIndex={0}
                        className='page-link'
                      >
                        5
                      </a>
                    </li>
                    <li
                      className='paginate_button page-item next'
                      id='kt_ecommerce_products_table_next'
                    >
                      <a
                        href='#'
                        aria-controls='kt_ecommerce_products_table'
                        data-dt-idx='6'
                        tabIndex={0}
                        className='page-link'
                      >
                        <i className='next'></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export {AllRentals}
