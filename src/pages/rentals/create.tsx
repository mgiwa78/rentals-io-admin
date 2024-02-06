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
import {useDropzone} from 'react-dropzone'
import put from '../../lib/put'
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage'
import {storage} from '../../utils/firebase'

type RolesData = {
  role: Role
  countUsers: number
}

const rentalDefault = {
  name: '',
  imgPath: '',
  description: '',
  price: '',
  category: '',
  vendor: '',
  rate: '',
  interval: '',
}

const CreateRentals: FC = () => {
  const [isLoading, setIsLoading] = useState<any>(false)
  const [imageURLs, setImageURLs] = useState<any>([])

  const [categories, setCategories] = useState<any>(false)
  const [vendors, setVendors] = useState<any>(false)

  const [selectedThumbnail, setSelectedThumbnail] = useState(null)
  const [selectedThumbnailFile, setSelectedThumbnailFile] = useState(null)

  const [items, setItems] = useState([''])

  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
    accept: {
      'application/*': ['.png', '.jpg'],
    },
  })

  // const mod = acceptedFiles.map((image) => {
  //   const reader = new FileReader()
  //   reader.onload = () => {
  //     return reader.result
  //   }
  //   reader.readAsDataURL(image)
  // })

  const handleFileRead = (image: any) => {
    let url: any
    const reader = new FileReader()
    reader.onload = () => {
      url = reader.result

      setImageURLs((prevURLs: any) => [...prevURLs, url])
    }

    reader.readAsDataURL(image)
    // setImageURLs([...imageURLs, url])
  }

  const addItem = () => {
    setItems([...items, ''])
  }

  const handleThumbnailChange = (event: any) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedThumbnailFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setSelectedThumbnail(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const getCategories = async () => {
    if (token) {
      const RESPONSE = await get('categories', token)
      if (RESPONSE?.data) setCategories(RESPONSE.data)
    }
  }

  const getVendors = async () => {
    if (token) {
      const RESPONSE = await get('users?type=vendor', token)
      if (RESPONSE?.data) setVendors(RESPONSE.data)
    }
  }

  useEffect(() => {
    getCategories()
    getVendors()
  }, [])

  useEffect(() => {
    acceptedFiles.forEach((image) => {
      handleFileRead(image)
    })

    console.log(imageURLs)
  }, [acceptedFiles])

  const handleThumbnailUpload = async (rentalsId: string, image: any) => {
    const fileRefPathRef = ref(storage, `rentals/${rentalsId}/thumbnail`)
    await uploadBytes(fileRefPathRef, image).then((snapshot: any) => {})
    const path = await getDownloadURL(fileRefPathRef)
    return path
  }

  const handleImagesUpload = async (rentalsId: string, image: any) => {
    const fileRefPathRef = ref(storage, `rentals/${rentalsId}/pictures/${image.name}`)
    await uploadBytes(fileRefPathRef, image).then((snapshot) => {})
    const path = await getDownloadURL(fileRefPathRef)
    return path
  }

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
    rate: Yup.string().max(50, 'Maximum 50 symbols').required('Rate is required'),
    interval: Yup.string().max(50, 'Maximum 50 symbols').required('Interval is required'),
    vendor: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Vendor is required'),
    description: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Description is required'),
  })
  const blankImg = toAbsoluteUrl('/media/svg/avatars/blank.svg')

  const formik = useFormik({
    initialValues: rentalDefault,
    validationSchema: editRental,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      try {
        const rentalData = await post('rentals', values, token)

        if (selectedThumbnailFile && rentalData?.data) {
          const thumbnail = await handleThumbnailUpload(rentalData.data._id, selectedThumbnailFile)

          const picturesDownloadURL = acceptedFiles.map(async (a) => {
            return await handleImagesUpload(rentalData.data._id, a)
          })

          const allResolved = await Promise.all(picturesDownloadURL)

          await put(
            'rentals/image-update',
            {rentalId: rentalData?.data._id, imagePath: thumbnail, otherPictures: allResolved},
            token,
            true,
            'Created'
          )
        }
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
      <form
        id='kt_ecommerce_add_product_form'
        className='form d-flex flex-column flex-lg-row fv-plugins-bootstrap5 fv-plugins-framework'
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <div className='d-flex flex-column gap-7 gap-lg-10 w-100 w-lg-300px mb-7 me-lg-10'>
          <div className='card card-flush py-4'>
            <div className='card-header'>
              <div className='card-title'>
                <h2>Thumbnail</h2>
              </div>
            </div>
            <div className='card-body text-center pt-0'>
              {/* <style>.image-input-placeholder { background-image: url('assets/media/svg/files/blank-image.svg'); } [data-bs-theme="dark"] .image-input-placeholder { background-image: url('assets/media/svg/files/blank-image-dark.svg'); }</style> */}
              <div
                className='image-input image-input-empty image-input-outline image-input-placeholder mb-3'
                data-kt-image-input='true'
              >
                {selectedThumbnail ? (
                  <div
                    className='image-input-wrapper w-150px h-150px '
                    style={{
                      backgroundPosition: 'center',
                      backgroundSize: 'contain',
                      backgroundImage: `url(${selectedThumbnail})`,
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
                    name='thumbnailPath'
                    onChange={(e) => handleThumbnailChange(e)}
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
                <span
                  className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                  data-kt-image-input-action='remove'
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
              </div>
              <div className='text-muted fs-7'>
                Set the product thumbnail image. Only *.png, *.jpg and *.jpeg image files are
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
                  id='kt_ecommerce_add_product_status'
                ></div>
              </div>
            </div>
            <div className='card-body pt-0'>
              <select
                className='form-select mb-2 select2-hidden-accessible'
                data-control='select2'
                data-hide-search='true'
                data-placeholder='Select an option'
                id='kt_ecommerce_add_product_status_select'
                data-select2-id='select2-data-kt_ecommerce_add_product_status_select'
                tabIndex={-1}
                aria-hidden='true'
                data-kt-initialized='1'
              >
                <option>Selecct Status</option>
                <option value='published' selected={true} data-select2-id='select2-data-10-8ejg'>
                  Published
                </option>
                <option value='draft'>Draft</option>
              </select>
            </div>
          </div>
          <div className='card card-flush py-4'>
            <div className='card-header'>
              <div className='card-title'>
                <h2>Product Details</h2>
              </div>
            </div>
            <div className='card-body pt-0'>
              <label className='form-label'>Categories</label>
              <select
                {...formik.getFieldProps('category')}
                className={clsx(
                  'form-control form-control-solid mb-3 mb-lg-0',
                  {'is-invalid': formik.touched.category && formik.errors.category},
                  {
                    'is-valid': formik.touched.category && !formik.errors.category,
                  }
                )}
              >
                <option>Select Category</option>
                {categories &&
                  categories.map((category: RentalCategory) => (
                    <option value={category._id}>{category.name}</option>
                  ))}
              </select>
              {formik.touched.category && formik.errors.category && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.category}</span>
                  </div>
                </div>
              )}
              <div className='text-muted fs-7 mb-7'>Add product to a category.</div>
              <a
                href='../../demo1/dist/apps/ecommerce/catalog/add-category.html'
                className='btn btn-light-primary btn-sm mb-10'
              >
                <i className='ki-duotone ki-plus fs-2'></i>Create new category
              </a>

              <br />
              <label className='form-label'>Vendor</label>
              <select
                {...formik.getFieldProps('vendor')}
                className={clsx(
                  'form-control form-control-solid mb-3 mb-lg-0',
                  {'is-invalid': formik.touched.vendor && formik.errors.vendor},
                  {
                    'is-valid': formik.touched.vendor && !formik.errors.vendor,
                  }
                )}
              >
                <option>Select Vendor</option>
                {vendors &&
                  vendors.map((vendor: User) => (
                    <option value={vendor._id}>{vendor.fullName}</option>
                  ))}
              </select>
              {formik.touched.vendor && formik.errors.vendor && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.vendor}</span>
                  </div>
                </div>
              )}
              <div className='text-muted fs-7 mb-7'>Add product to vendor catalogue.</div>
            </div>
          </div>
        </div>
        <div className='d-flex flex-column flex-row-fluid gap-7 gap-lg-10'>
          <ul
            className='nav nav-custom nav-tabs nav-line-tabs nav-line-tabs-2x border-0 fs-4 fw-semibold mb-n2'
            role='tablist'
          >
            <li className='nav-item' role='presentation'>
              <a
                className='nav-link text-active-primary pb-4 active'
                data-bs-toggle='tab'
                href='#kt_ecommerce_add_product_general'
                aria-selected='true'
                role='tab'
              >
                General
              </a>
            </li>
            <li className='nav-item' role='presentation'>
              <a
                className='nav-link text-active-primary pb-4'
                data-bs-toggle='tab'
                href='#kt_ecommerce_add_product_advanced'
                aria-selected='false'
                tabIndex={-1}
                role='tab'
              >
                Advanced
              </a>
            </li>
          </ul>
          <div className='tab-content'>
            <div
              className='tab-pane fade show active'
              id='kt_ecommerce_add_product_general'
              role='tab-panel'
            >
              <div className='d-flex flex-column gap-7 gap-lg-10'>
                <div className='card card-flush py-4'>
                  <div className='card-header'>
                    <div className='card-title'>
                      <h2>General</h2>
                    </div>
                  </div>
                  <div className='card-body pt-0'>
                    <div className='mb-10 fv-row fv-plugins-icon-container'>
                      <label className='required form-label'>Product Name</label>
                      <input
                        placeholder='Enter product Name'
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
                        A product name is required and recommended to be unique.
                      </div>
                      <div className='fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback'></div>
                    </div>
                    <div>
                      <label className='form-label'>Description</label>
                      <textarea
                        name=''
                        disabled={formik.isSubmitting}
                        {...formik.getFieldProps('description')}
                        placeholder='Enter product description'
                        className={clsx(
                          'form-control  mb-3 mb-lg-0',
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
                      <div className='text-muted fs-7'>
                        Set a description to the product for better visibility.
                      </div>
                    </div>
                  </div>
                </div>
                <div className='card card-flush py-4'>
                  <div className='card-header'>
                    <div className='card-title'>
                      <h2>Media</h2>
                    </div>
                  </div>
                  <div className='card-body pt-0'>
                    <div className='fv-row mb-2'>
                      <div className='col-xl-3'>
                        <div className='fs-6 fw-semibold mt-2 mb-3'> Other Images </div>
                      </div>
                      <div className='mb-8' {...getRootProps({className: 'dropzone'})}>
                        <div className='row gap-3'>
                          {imageURLs &&
                            imageURLs.map((imageURL: any) => (
                              <div
                                className='w-100px h-100px rounded'
                                style={{
                                  backgroundImage: `url(${imageURL})`,
                                  backgroundPosition: 'center',
                                  backgroundSize: 'contain',
                                  position: 'relative',
                                }}
                              >
                                {/* <img
                                    data-dz-thumbnail=''
                                    alt='hypebeastronaut28816_square_20230105_213850_637_3.jpg'
                                    src={imageURL}
                                    className='w-100px h-100px rounded'
                                  /> */}
                                <a className='dz-remove' data-dz-remove=''>
                                  Remove file
                                </a>
                              </div>
                            ))}
                        </div>
                        <input {...getInputProps()} />
                        {!imageURLs ||
                          (imageURLs.length === 0 && (
                            <div className='dz-message needsclick'>
                              <i className='ki-duotone ki-file-up text-primary fs-3x'>
                                <span className='path1'></span>
                                <span className='path2'></span>
                              </i>
                              <div className='ms-4'>
                                <h3 className='fs-5 fw-bold text-gray-900 mb-1'>
                                  Drop files here or click to upload.
                                </h3>
                                <span className='fs-7 fw-semibold text-gray-400'>
                                  Upload up to 10 files
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className='text-muted fs-7'>Set the product media gallery.</div>
                  </div>
                </div>
                <div className='card card-flush py-4'>
                  <div className='card-header'>
                    <div className='card-title'>
                      <h2>Pricing</h2>
                    </div>
                  </div>
                  <div className='card-body pt-0'>
                    <div className='mb-10 fv-row fv-plugins-icon-container'>
                      <label className='required form-label'>Base Rate</label>
                      <input
                        placeholder='Enter product rate'
                        {...formik.getFieldProps('rate')}
                        className={clsx(
                          'form-control form-control-solid mb-3 mb-lg-0',
                          {'is-invalid': formik.touched.rate && formik.errors.rate},
                          {
                            'is-valid': formik.touched.rate && !formik.errors.rate,
                          }
                        )}
                        autoComplete='off'
                        disabled={formik.isSubmitting}
                      />
                      {formik.touched.rate && formik.errors.rate && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>
                            <span role='alert'>{formik.errors.rate}</span>
                          </div>
                        </div>
                      )}
                      <div className='text-muted fs-7'>Set the product rate.</div>
                      <div className='fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback'></div>
                    </div>

                    <div className='d-flex flex-wrap gap-5'>
                      <div className='fv-row w-100 flex-md-root fv-plugins-icon-container'>
                        <label className='required form-label'>Interval</label>
                        <select
                          {...formik.getFieldProps('interval')}
                          className={clsx(
                            'form-control form-control-solid mb-3 mb-lg-0',
                            {'is-invalid': formik.touched.interval && formik.errors.interval},
                            {
                              'is-valid': formik.touched.interval && !formik.errors.interval,
                            }
                          )}
                          autoComplete='off'
                          disabled={formik.isSubmitting}
                        >
                          <option>Select Interval</option>
                          <option value={0}>Hourly</option>
                          <option value={1}>Daily</option>
                          <option value={2}>Monthly</option>
                        </select>

                        {formik.touched.interval && formik.errors.interval && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>
                              <span role='alert'>{formik.errors.interval}</span>
                            </div>
                          </div>
                        )}
                        <div className='text-muted fs-7'>Set the product tax class.</div>
                        <div className='fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='tab-pane fade' id='kt_ecommerce_add_product_advanced' role='tab-panel'>
              <div className='d-flex flex-column gap-7 gap-lg-10'>
                <div className='card card-flush py-4'>
                  <div className='card-header'>
                    <div className='card-title'>
                      <h2>Inventory</h2>
                    </div>
                  </div>
                  <div className='card-body pt-0'>
                    <div className='mb-10 fv-row fv-plugins-icon-container'>
                      <label className='required form-label'>SKU</label>
                      <input
                        type='text'
                        name='sku'
                        className='form-control mb-2'
                        placeholder='SKU Number'
                        value=''
                      />
                      <div className='text-muted fs-7'>Enter the product SKU.</div>
                      <div className='fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback'></div>
                    </div>
                    <div className='mb-10 fv-row fv-plugins-icon-container'>
                      <label className='required form-label'>Barcode</label>
                      <input
                        type='text'
                        name='sku'
                        className='form-control mb-2'
                        placeholder='Barcode Number'
                        value=''
                      />
                      <div className='text-muted fs-7'>Enter the product barcode number.</div>
                      <div className='fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback'></div>
                    </div>
                    <div className='mb-10 fv-row fv-plugins-icon-container'>
                      <label className='required form-label'>Quantity</label>
                      <div className='d-flex gap-3'>
                        <input
                          type='number'
                          name='shelf'
                          className='form-control mb-2'
                          placeholder='On shelf'
                          value=''
                        />
                        <input
                          type='number'
                          name='warehouse'
                          className='form-control mb-2'
                          placeholder='In warehouse'
                        />
                      </div>
                      <div className='text-muted fs-7'>Enter the product quantity.</div>
                      <div className='fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback'></div>
                    </div>
                    <div className='fv-row'>
                      <label className='form-label'>Allow Backorders</label>
                      <div className='form-check form-check-custom form-check-solid mb-2'>
                        <input className='form-check-input' type='checkbox' value='' />
                        <label className='form-check-label'>Yes</label>
                      </div>
                      <div className='text-muted fs-7'>
                        Allow customers to purchase products that are out of stock.
                      </div>
                    </div>
                  </div>
                </div>
                <div className='card card-flush py-4'>
                  <div className='card-header'>
                    <div className='card-title'>
                      <h2>Variations</h2>
                    </div>
                  </div>
                  <div className='card-body pt-0'>
                    <div className='' data-kt-ecommerce-catalog-add-product='auto-options'>
                      <label className='form-label'>Add Product Variations</label>
                      <div id='kt_ecommerce_add_product_options'>
                        <div className='form-group'>
                          <div
                            data-repeater-list='kt_ecommerce_add_product_options'
                            className='d-flex flex-column gap-3'
                          >
                            <div
                              data-repeater-item=''
                              className='form-group d-flex flex-wrap align-items-center gap-5'
                            >
                              <div className='w-100 w-md-200px'>
                                <select
                                  className='form-select select2-hidden-accessible'
                                  name='kt_ecommerce_add_product_options[0][product_option]'
                                  data-placeholder='Select a variation'
                                  data-kt-ecommerce-catalog-add-product='product_option'
                                  data-select2-id='select2-data-126-ibm7'
                                  tabIndex={-1}
                                  aria-hidden='true'
                                >
                                  <option data-select2-id='select2-data-128-jynj'></option>
                                  <option value='color'>Color</option>
                                  <option value='size'>Size</option>
                                  <option value='material'>Material</option>
                                  <option value='style'>Style</option>
                                </select>
                                <span
                                  className='select2 select2-container select2-container--bootstrap5'
                                  dir='ltr'
                                  data-select2-id='select2-data-127-2nxd'
                                  style={{width: '100%'}}
                                >
                                  <span className='selection'>
                                    <span
                                      className='select2-selection select2-selection--single form-select'
                                      role='combobox'
                                      aria-haspopup='true'
                                      aria-expanded='false'
                                      tabIndex={0}
                                      aria-disabled='false'
                                      aria-labelledby='select2-kt_ecommerce_add_product_options0product_option-5u-container'
                                      aria-controls='select2-kt_ecommerce_add_product_options0product_option-5u-container'
                                    >
                                      <span
                                        className='select2-selection__rendered'
                                        id='select2-kt_ecommerce_add_product_options0product_option-5u-container'
                                        role='textbox'
                                        aria-readonly='true'
                                        title='Select a variation'
                                      >
                                        <span className='select2-selection__placeholder'>
                                          Select a variation
                                        </span>
                                      </span>
                                      <span
                                        className='select2-selection__arrow'
                                        role='presentation'
                                      >
                                        <b role='presentation'></b>
                                      </span>
                                    </span>
                                  </span>
                                  <span className='dropdown-wrapper' aria-hidden='true'></span>
                                </span>
                              </div>
                              <input
                                type='text'
                                className='form-control mw-100 w-200px'
                                name='kt_ecommerce_add_product_options[0][product_option_value]'
                                placeholder='Variation'
                              />
                              <button
                                type='button'
                                data-repeater-delete=''
                                className='btn btn-sm btn-icon btn-light-danger'
                              >
                                <i className='ki-duotone ki-cross fs-1'>
                                  <span className='path1'></span>
                                  <span className='path2'></span>
                                </i>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className='form-group mt-5'>
                          <button
                            type='button'
                            data-repeater-create=''
                            className='btn btn-sm btn-light-primary'
                          >
                            <i className='ki-duotone ki-plus fs-2'></i>Add another variation
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='card card-flush py-4'>
                  <div className='card-header'>
                    <div className='card-title'>
                      <h2>Shipping</h2>
                    </div>
                  </div>
                  <div className='card-body pt-0'>
                    <div className='fv-row'>
                      <div className='form-check form-check-custom form-check-solid mb-2'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          id='kt_ecommerce_add_product_shipping_checkbox'
                          value='1'
                        />
                        <label className='form-check-label'>This is a physical product</label>
                      </div>
                      <div className='text-muted fs-7'>
                        Set if the product is a physical or digital item. Physical products may
                        require shipping.
                      </div>
                    </div>
                    <div id='kt_ecommerce_add_product_shipping' className='d-none mt-10'>
                      <div className='mb-10 fv-row'>
                        <label className='form-label'>Weight</label>
                        <input
                          type='text'
                          name='weight'
                          className='form-control mb-2'
                          placeholder='Product weight'
                          value=''
                        />
                        <div className='text-muted fs-7'>
                          Set a product weight in kilograms (kg).
                        </div>
                      </div>
                      <div className='fv-row'>
                        <label className='form-label'>Dimension</label>
                        <div className='d-flex flex-wrap flex-sm-nowrap gap-3'>
                          <input
                            type='number'
                            name='width'
                            className='form-control mb-2'
                            placeholder='Width (w)'
                            value=''
                          />
                          <input
                            type='number'
                            name='height'
                            className='form-control mb-2'
                            placeholder='Height (h)'
                            value=''
                          />
                          <input
                            type='number'
                            name='length'
                            className='form-control mb-2'
                            placeholder='Lengtn (l)'
                            value=''
                          />
                        </div>
                        <div className='text-muted fs-7'>
                          Enter the product dimensions in centimeters (cm).
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='d-flex justify-content-end'>
            <a
              href='../../demo1/dist/apps/ecommerce/catalog/products.html'
              id='kt_ecommerce_add_product_cancel'
              className='btn btn-light me-5'
            >
              Cancel
            </a>
            <button
              type='submit'
              className='btn btn-primary'
              data-kt-users-modal-action='submit'
              disabled={formik.isSubmitting || !formik.isValid || !formik.touched}
            >
              <span className='indicator-label'>Submit</span>
              {formik.isSubmitting && (
                <span className='indicator-progress'>
                  Please wait...
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

export {CreateRentals}
