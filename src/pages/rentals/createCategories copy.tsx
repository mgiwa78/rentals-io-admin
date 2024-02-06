/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useEffect, useState} from 'react'
import {PageLink, PageTitle} from '../../_metronic/layout/core'
import {useSelector} from 'react-redux'
import {selectAuth, selectToken} from '../../redux/selectors/auth'
import Role from '../../types/Role'
import get from '../../lib/get'
import {toAbsoluteUrl} from '../../_metronic/helpers'
import clsx from 'clsx'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import post from '../../lib/post'

type RolesData = {
  role: Role
  countUsers: number
}

const vendorCatrgoriesDefault = {
  name: '',
  imgPath: '',
  description: '',
}

const CreateCategories: FC = () => {
  const [isUserLoading, setIsUserLoading] = useState<any>(false)
  const token = useSelector(selectToken)

  const editRental = Yup.object().shape({
    name: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Name is required'),
    description: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Description is required'),
    imgPath: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Description is required'),
  })

  const blankImg = toAbsoluteUrl('/media/svg/avatars/blank.svg')

  const formik = useFormik({
    initialValues: vendorCatrgoriesDefault,
    validationSchema: editRental,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      try {
        await post('categories', values, token, true, 'Created')

        setSubmitting(false)
      } catch (err) {
        console.error(err)
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

  return (
    <>
      <PageTitle breadcrumbs={rentalsCategories}>Categories</PageTitle>
      <div className='card'>
        <form
          id='kt_modal_add_user_form'
          className='form'
          onSubmit={formik.handleSubmit}
          noValidate
        >
          <div className='card-body'>
            <div className='row  mb-3'>
              <div className='col-lg-6'>
                <div className='row'>
                  <div className='col-12 mb-3'>
                    <div className='row'>
                      <div className='col-lg-6'>
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
                      <div className='col-lg-6'>
                        <label className=' col-form-label  fw-bold fs-6'>Update Profile</label>
                        <div className='col-12'>
                          <input
                            type='file'
                            {...formik.getFieldProps('imgPath')}
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
                  <div className='col-12'>
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
                </div>
              </div>
              <div className='col-6'>
                <label className='required fw-bold fs-6 mb-2'>Description</label>
                <textarea
                  {...formik.getFieldProps('description')}
                  disabled={formik.isSubmitting || isUserLoading}
                  className={clsx(
                    'form-control form-control-solid mb-3 mb-lg-0',
                    {'is-invalid': formik.touched.description && formik.errors.description},
                    {
                      'is-valid': formik.touched.description && !formik.errors.description,
                    }
                  )}
                  placeholder='Description'
                  cols={30}
                  rows={10}
                ></textarea>
                {formik.touched.name && formik.errors.description && (
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

export {CreateCategories}
