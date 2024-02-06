/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useEffect, useState} from 'react'
import {PageLink, PageTitle} from '../../_metronic/layout/core'
import {useSelector} from 'react-redux'
import {selectAuth, selectToken} from '../../redux/selectors/auth'
import Role from '../../types/Role'
import get from '../../lib/get'
import clsx from 'clsx'
import {toAbsoluteUrl} from '../../_metronic/helpers'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import post from '../../lib/post'
import User from '../../types/User'
import RentalCategory from '../../types/RentalCategory'

type RolesData = {
  role: Role
  countUsers: number
}

const vendorDefault = {
  name: '',
  imgPath: '',
  description: '',
  price: '',
  brand: '',
  category: '',
  vendor: '',
  size: '',
}

const CreateRentals: FC = () => {
  const [isUserLoading, setIsUserLoading] = useState<any>(false)

  const [categories, setCategories] = useState<any>(false)
  const [vendors, setVendors] = useState<any>(false)

  const getCategories = async () => {
    if (token) {
      const RESPONSE = await get('categories', token)
      setCategories(RESPONSE.data)
    }
  }

  const getVendors = async () => {
    if (token) {
      const RESPONSE = await get('users?type=vendor', token)
      setVendors(RESPONSE.data)
    }
  }

  useEffect(() => {
    getCategories()
    getVendors()
  }, [])

  const token = useSelector(selectToken)

  const editRental = Yup.object().shape({
    name: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Name is required'),
    category: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Category is required'),
    vendor: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Vendor is required'),
    brand: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Brand is required'),
    price: Yup.number().required('Price is required'),
    size: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Size is required'),
    description: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Description is required'),
  })
  const blankImg = toAbsoluteUrl('/media/svg/avatars/blank.svg')

  const formik = useFormik({
    initialValues: vendorDefault,
    validationSchema: editRental,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      try {
        await post('rentals', values, token, true, 'Created')
        // console.log('object')
        console.log()
        setSubmitting(false)
      } catch (ex) {
        console.error(ex)
      } finally {
        setSubmitting(true)
      }
    },
  })

  const createrentals: Array<PageLink> = [
    {
      title: 'Home',
      path: '/',
      isSeparator: false,
      isActive: false,
    },
    {
      title: ' ',
      path: '',
      isSeparator: true,
      isActive: false,
    },
    {
      title: 'Rentals ',
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
      <PageTitle breadcrumbs={createrentals}>Create </PageTitle>
      <div className='card'>
        <form
          id='kt_modal_add_user_form'
          className='form'
          onSubmit={formik.handleSubmit}
          noValidate
        >
          <div className='card-body'>
            <div className='row mb-6'>
              <div className='col-lg-8'>
                <div className='row'>
                  {' '}
                  <div className='col-lg-6 fv-row'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>Picture</label>

                    <div
                      className='image-input image-input-outline w-125px h-125px'
                      data-kt-image-input='true'
                      style={{
                        backgroundImage: `url(${toAbsoluteUrl('/media/avatars/blank.png')})`,
                      }}
                    >
                      <div
                        className='image-input-wrapper w-125px h-125px'
                        style={{
                          backgroundImage: `url(${
                            false || toAbsoluteUrl('/media/avatars/blank.png')
                          })`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className='col-lg-6 fv-row  py-10'>
                    <label className='col-lg-4 col-form-label  fw-bold fs-6'>Update Profile</label>
                    <div className='col-12'>
                      <input
                        type='file'
                        // onChange={(e) => updateProfileImage(e)}
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Last name'
                      />
                      {formik.touched.imgPath && formik.errors.imgPath && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.imgPath}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='row  mb-3'>
              <div className='col-4'>
                <label className='required fw-bold fs-6 mb-2'>Name</label>

                <input
                  placeholder='Name'
                  {...formik.getFieldProps('name')}
                  className={clsx(
                    'form-control form-control-solid mb-3 mb-lg-0',
                    {'is-invalid': formik.touched.name && formik.errors.name},
                    {
                      'is-valid': formik.touched.name && !formik.errors.name,
                    }
                  )}
                  autoComplete='off'
                  disabled={formik.isSubmitting || isUserLoading}
                />
                {formik.touched.name && formik.errors.name && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>
                      <span role='alert'>{formik.errors.name}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className='col-4'>
                <label className='required fw-bold fs-6 mb-2'>Price</label>
                <input
                  placeholder='price'
                  {...formik.getFieldProps('price')}
                  className={clsx(
                    'form-control form-control-solid mb-3 mb-lg-0',
                    {'is-invalid': formik.touched.price && formik.errors.price},
                    {
                      'is-valid': formik.touched.price && !formik.errors.price,
                    }
                  )}
                  type='number'
                  autoComplete='off'
                  disabled={formik.isSubmitting || isUserLoading}
                />
                {/* end::Input */}
                {formik.touched.price && formik.errors.price && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>
                      <span role='alert'>{formik.errors.price}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className='col-4'>
                <label className='required fw-bold fs-6 mb-2'>Brand</label>
                <input
                  placeholder='Brand'
                  {...formik.getFieldProps('brand')}
                  className={clsx(
                    'form-control form-control-solid mb-3 mb-lg-0',
                    {'is-invalid': formik.touched.brand && formik.errors.brand},
                    {
                      'is-valid': formik.touched.brand && !formik.errors.brand,
                    }
                  )}
                  autoComplete='off'
                  disabled={formik.isSubmitting || isUserLoading}
                />
                {/* end::Input */}
                {formik.touched.brand && formik.errors.brand && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>
                      <span role='alert'>{formik.errors.brand}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className='row mb-3'>
              <div className='col-4'>
                <div className='row gap-3'>
                  <div className='col-12'>
                    <label className='required fw-bold fs-6 mb-2'>Category</label>
                    <select
                      className={clsx(
                        'form-control form-control-solid mb-3 mb-lg-0',
                        {'is-invalid': formik.touched.category && formik.errors.category},
                        {
                          'is-valid': formik.touched.category && !formik.errors.category,
                        }
                      )}
                      {...formik.getFieldProps('category')}
                      disabled={formik.isSubmitting || isUserLoading}
                      id=''
                    >
                      <option value=''>Select Category</option>

                      {categories &&
                        categories?.map((category: RentalCategory) => (
                          <option value={`${category._id}`}>{category.name}</option>
                        ))}
                    </select>

                    {formik.touched.category && formik.errors.category && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>
                          <span role='alert'>{formik.errors.category}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className='col-12'>
                    <label className='required fw-bold fs-6 mb-2'>Size</label>
                    <input
                      placeholder='Name'
                      {...formik.getFieldProps('size')}
                      className={clsx(
                        'form-control form-control-solid mb-3 mb-lg-0',
                        {'is-invalid': formik.touched.size && formik.errors.size},
                        {
                          'is-valid': formik.touched.size && !formik.errors.size,
                        }
                      )}
                      {...formik.getFieldProps('size')}
                      autoComplete='off'
                      disabled={formik.isSubmitting || isUserLoading}
                    />
                    {/* end::Input */}
                    {formik.touched.size && formik.errors.size && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>
                          <span role='alert'>{formik.errors.size}</span>
                        </div>
                      </div>
                    )}
                  </div>{' '}
                  <div className='col-12'>
                    <label className='required fw-bold fs-6 mb-2'>Vendor</label>
                    <select
                      className={clsx(
                        'form-control form-control-solid mb-3 mb-lg-0',
                        {'is-invalid': formik.touched.vendor && formik.errors.vendor},
                        {
                          'is-valid': formik.touched.vendor && !formik.errors.vendor,
                        }
                      )}
                      {...formik.getFieldProps('vendor')}
                      disabled={formik.isSubmitting || isUserLoading}
                      id=''
                    >
                      <option value=''>Select Vendor</option>
                      {vendors &&
                        vendors.map((vendor: User) => (
                          <option value={`${vendor._id}`}>{vendor.fullName}</option>
                        ))}
                    </select>

                    {formik.touched.vendor && formik.errors.vendor && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>
                          <span role='alert'>{formik.errors.vendor}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className='col-8'>
                <label className='required fw-bold fs-6 mb-2'>Description</label>
                <textarea
                  name=''
                  disabled={formik.isSubmitting || isUserLoading}
                  {...formik.getFieldProps('description')}
                  className={clsx(
                    'form-control form-control-solid mb-3 mb-lg-0',
                    {'is-invalid': formik.touched.description && formik.errors.description},
                    {
                      'is-valid': formik.touched.description && !formik.errors.description,
                    }
                  )}
                  id=''
                  cols={30}
                  rows={10}
                ></textarea>

                {formik.touched.description && formik.errors.description && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>
                      <span role='alert'>{formik.errors.description}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className='card-footer'>
            <button
              type='reset'
              // onClick={() => cancel()}
              className='btn btn-light me-3'
              data-kt-users-modal-action='cancel'
              disabled={formik.isSubmitting || isUserLoading}
            >
              Discard
            </button>

            <button
              type='submit'
              className='btn btn-primary'
              data-kt-users-modal-action='submit'
              disabled={isUserLoading || formik.isSubmitting || !formik.isValid || !formik.touched}
            >
              <span className='indicator-label'>Submit</span>
              {(formik.isSubmitting || isUserLoading) && (
                <span className='indicator-progress'>
                  Please wait...{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export {CreateRentals}
