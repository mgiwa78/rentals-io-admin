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
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage'
import {storage} from '../../utils/firebase'
import put from '../../lib/put'

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
  const token = useSelector(selectToken)

  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedImageFile, setSelectedImageFile] = useState(null)

  const handleImageChange = (event: any) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedImageFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setSelectedImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const editRental = Yup.object().shape({
    name: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Name is required'),
    description: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Description is required'),
  })

  const blankImg = toAbsoluteUrl('/media/svg/avatars/blank.svg')

  const hadlefCategoryThumbnailUpload = async (categoryId: string, image: any) => {
    const fileRefPathRef = ref(storage, `category/${categoryId}/thumbnail`)
    await uploadBytes(fileRefPathRef, image).then((snapshot) => {})
    const path = await getDownloadURL(fileRefPathRef)
    return path
  }

  const formik = useFormik({
    initialValues: vendorCatrgoriesDefault,
    validationSchema: editRental,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      try {
        const categoryData = await post('categories', values, token)

        if (selectedImageFile && categoryData?.data) {
          const imagePath = await hadlefCategoryThumbnailUpload(
            categoryData.data._id,
            selectedImageFile
          )
          console.log(imagePath)
          await put(
            'categories/image-update',
            {categoryId: categoryData?.data._id, imagePath},
            token,
            true,
            'Created'
          )
        }

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
      <form
        onSubmit={formik.handleSubmit}
        noValidate
        id='kt_ecommerce_add_category_form'
        className='form d-flex flex-column flex-lg-row fv-plugins-bootstrap5 fv-plugins-framework'
      >
        <div className='d-flex flex-column gap-7 gap-lg-10 w-100 w-lg-300px mb-7 me-lg-10'>
          <div className='card card-flush py-4'>
            <div className='card-header'>
              <div className='card-title'>
                <h2>Image</h2>
              </div>
            </div>
            <div className='card-body text-center pt-0'>
              {/* <style>.image-input-placeholder { background-image: url('assets/media/svg/files/blank-image.svg'); } [data-bs-theme="dark"] .image-input-placeholder { background-image: url('assets/media/svg/files/blank-image-dark.svg'); }</style> */}
              <div
                className='image-input image-input-empty image-input-outline image-input-placeholder mb-3'
                data-kt-image-input='true'
              >
                {selectedImage ? (
                  <div
                    className='image-input-wrapper w-150px h-150px '
                    style={{
                      backgroundPosition: 'center',
                      backgroundSize: 'contain',
                      backgroundImage: `url(${selectedImage})`,
                    }}
                  ></div>
                ) : (
                  <div
                    className='image-input-wrapper w-150px h-150px '
                    style={{
                      backgroundImage: `url(${toAbsoluteUrl('/media/svg/files/blank-image.svg')})`,
                    }}
                  ></div>
                )}

                <label
                  className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                  data-kt-image-input-action='change'
                  data-bs-toggle='tooltip'
                  aria-label='Change avatar'
                  data-bs-original-title='Change avatar'
                  data-kt-initialized='1'
                >
                  <i className='ki-duotone ki-pencil fs-7'>
                    <span className='path1'></span>
                    <span className='path2'></span>
                  </i>
                  <input
                    type='file'
                    onChange={(e) => handleImageChange(e)}
                    name='imgPath'
                    accept='.png, .jpg, .jpeg'
                  />

                  <input type='hidden' name='avatar_remove' />
                </label>
                <span
                  className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                  data-kt-image-input-action='cancel'
                  data-bs-toggle='tooltip'
                  aria-label='Cancel avatar'
                  data-bs-original-title='Cancel avatar'
                  data-kt-initialized='1'
                >
                  <i className='ki-duotone ki-cross fs-2'>
                    <span className='path1'></span>
                    <span className='path2'></span>
                  </i>
                </span>
                {selectedImage && (
                  <span
                    onClick={() => setSelectedImage(null)}
                    className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                    data-bs-toggle='tooltip'
                    aria-label='Remove avatar'
                    data-bs-original-title='Remove avatar'
                    data-kt-initialized='1'
                  >
                    <i className='ki-duotone ki-cross fs-2'>
                      <span className='path1'></span>
                      <span className='path2'></span>
                    </i>
                  </span>
                )}
              </div>
              {formik.touched.imgPath && formik.errors.imgPath && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.imgPath}</span>
                  </div>
                </div>
              )}
              <div className='text-muted fs-7'>
                Set the category thumbnail image. Only *.png, *.jpg and *.jpeg image files are
                accepted
              </div>
            </div>
          </div>
          <div className='card card-flush py-4'>
            <div className='card-header'>
              <div className='card-title'>
                <h2>Status</h2>
              </div>
              <div className='card-toolbar'>
                <div
                  className='rounded-circle bg-success w-15px h-15px'
                  id='kt_ecommerce_add_category_status'
                ></div>
              </div>
            </div>
            <div className='card-body pt-0'>
              <select
                className='form-select mb-2 select2-hidden-accessible'
                data-control='select2'
                data-hide-search='true'
                data-placeholder='Select an option'
                id='kt_ecommerce_add_category_status_select'
                data-select2-id='select2-data-kt_ecommerce_add_category_status_select'
                tabIndex={-1}
                aria-hidden='true'
                data-kt-initialized='1'
              >
                <option>Select Status</option>
                <option value='published' selected={true} data-select2-id='select2-data-10-8jos'>
                  Published
                </option>
                <option value='unpublished'>Unpublished</option>
              </select>
            </div>
          </div>
        </div>
        <div className='d-flex flex-column flex-row-fluid gap-7 gap-lg-10'>
          <div className='card card-flush py-4'>
            <div className='card-header'>
              <div className='card-title'>
                <h2>General</h2>
              </div>
            </div>
            <div className='card-body pt-0'>
              <div className='mb-10 fv-row fv-plugins-icon-container'>
                <label className='required form-label'>Category Name</label>
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
                  disabled={formik.isSubmitting}
                />
                {formik.touched.name && formik.errors.name && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>
                      <span role='alert'>{formik.errors.name}</span>
                    </div>
                  </div>
                )}
                <div className='text-muted fs-7'>
                  A category name is required and recommended to be unique.
                </div>
                <div className='fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback'></div>
              </div>
              <div>
                <label className='form-label'>Description</label>
                <textarea
                  {...formik.getFieldProps('description')}
                  disabled={formik.isSubmitting}
                  className={clsx(
                    'form-control form-control-solid mb-5 mb-lg-0 ',
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

                <div className='text-muted fs-7'>
                  Set a description to the category for better visibility.
                </div>
              </div>
            </div>
          </div>

          <div className='d-flex justify-content-end'>
            <a id='kt_ecommerce_add_product_cancel' className='btn btn-light me-5'>
              Cancel
            </a>
            <button
              type='submit'
              className='btn btn-primary'
              data-kt-users-modal-action='submit'
              disabled={formik.isSubmitting || !formik.isValid || !formik.touched}
            >
              <span className='indicator-label'>Create</span>
              {formik.isSubmitting && (
                <span className='indicator-progress'>
                  Please wait...{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
          </div>
        </div>
      </form>
    </>
  )
}

export {CreateCategories}
