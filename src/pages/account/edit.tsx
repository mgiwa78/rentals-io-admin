import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toAbsoluteUrl} from '../../_metronic/helpers'
import User, {UserEdit} from '../../types/User'
import get from '../../lib/get'
import {useSelector} from 'react-redux'
import {selectAuth, selectUser} from '../../redux/selectors/auth'
import put from '../../lib/put'
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage'
import {storage} from '../../utils/firebase'
import {userInfo} from 'os'
import {Link} from 'react-router-dom'

const profileDetailsSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  email: Yup.string().email().required('Email is required'),
  contact: Yup.string().required('Contact Number is required'),
})

const initialValues = {
  createdAt: '',
  department: {_id: '', name: ''},
  email: '',
  avatar: '',
  fullName: '',
  contact: '',
  lastName: '',
  password: '',
  updatedAt: '',
  _id: '',
  notification: {
    email: false,
  },
}
const EditAccount: React.FC = () => {
  const [data, setData] = useState<User>()
  const [profile, setProfile] = useState<User>()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [newProfile, setNewProfile] = useState<File>()
  const [isSubmitting, setSubmitting] = useState<boolean>(true)
  const {token} = useSelector(selectAuth)
  const currentUser = useSelector(selectUser)

  const isAdmin = currentUser?.roles.some((role) => role.name === 'superadmin')

  const updateData = (fieldsToUpdate: Partial<User>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  useEffect(() => {
    const getProfile = async () => {
      setIsLoading(true)
      try {
        if (token) {
          const RESPONSE = await get('users/myProfile/view', token)
          setProfile(RESPONSE.data)

          console.log(RESPONSE.data)
          formik.values.fullName = RESPONSE.data?.fullName
          formik.values.email = RESPONSE.data?.email
          formik.values.contact = RESPONSE.data?.contact
          formik.values.notification = RESPONSE.data?.notification

          setIsLoading(false)
        }
      } catch (error) {
        setIsLoading(false)
        console.log(error)
      }
    }

    getProfile()
  }, [token])

  const updateProfileImage = (e: any) => {
    console.log(e.target.files)
    const file = e.target.files[0]

    if (file) {
      setNewProfile(file)
    }
  }

  const hadlefileProfileUpload = async (userId: string, image: any) => {
    const fileRefPathRef = ref(storage, `profiles/${profile}/profile`)
    await uploadBytes(fileRefPathRef, image).then((snapshot) => {})
    const path = await getDownloadURL(fileRefPathRef)
    return path
  }

  const [loading, setLoading] = useState(false)

  const formik = useFormik<User>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: async (values) => {
      setLoading(true)

      console.log(values)
      try {
        let profilePath
        if (newProfile) {
          profilePath = await hadlefileProfileUpload(values._id, newProfile)
        }

        const RESPONSE: any = await put(
          'users/myProfile/update',
          {...values, ...(profilePath && {avatar: profilePath})},
          token,
          true,
          'Profile Updated'
        )
        if (1) {
          formik.values = initialValues
        }
        setSubmitting(false)
        setLoading(false)
      } catch (error) {
        setSubmitting(false)
        setLoading(false)
      }
    },
  })

  return (
    <div className='card mb-5 mb-xl-10'>
      <div className='card-header border-0 cursor-pointer'>
        <div className='card-title m-0'>
          <h3 className='fw-bolder m-0'>Profile Details</h3>
        </div>
        <div className='card-toolbar d-flex gap-2'>
          <Link to='/account/overview' className='btn btn-sm btn-primary align-self-center '>
            Edit Profile
          </Link>
        </div>
      </div>

      <div id='kt_account_profile_details' className='collapse show'>
        <form onSubmit={formik.handleSubmit} noValidate className='form'>
          <div className='card-body border-top p-9'>
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>Avatar</label>
              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
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
                            profile?.avatar
                              ? profile?.avatar
                              : toAbsoluteUrl('/media/avatars/blank.png')
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
                        onChange={(e) => updateProfileImage(e)}
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Last name'
                      />
                      {formik.touched.avatar && formik.errors.avatar && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.avatar}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-2 col-form-label required fw-bold fs-6'>Full Name</label>

              <div className='col-lg-10'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                  placeholder='First name'
                  readOnly={!isAdmin}
                  {...formik.getFieldProps('fullName')}
                />
                {formik.touched.fullName && formik.errors.fullName && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.fullName}</div>
                  </div>
                )}
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-2 col-form-label required fw-bold fs-6'>Email</label>

              <div className='col-lg-10 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Email'
                  readOnly={!isAdmin}
                  {...formik.getFieldProps('email')}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.email}</div>
                  </div>
                )}
              </div>
            </div>
            <div className='row mb-6'>
              <label className='col-lg-2 col-form-label required fw-bold fs-6'>Notification</label>

              <div className='col-lg-10 fv-row'>
                <div className='form-check form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    id='inlineCheckbox3'
                    {...formik.getFieldProps('notification.email')}
                  />
                  <label className='form-check-label fw-bold' htmlFor='inlineCheckbox3'>
                    Email
                  </label>
                </div>
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-2 col-form-label fw-bold fs-6'>
                <span className='required'>Contact Phone</span>
              </label>

              <div className='col-lg-10 fv-row'>
                <input
                  type='tel'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Phone number'
                  {...formik.getFieldProps('contact')}
                />
                {formik.touched.contact && formik.errors.contact && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.contact}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='card-footer d-flex justify-content-end py-6 px-9'>
            <button type='submit' className='btn btn-primary' disabled={loading}>
              {!loading && 'Save Changes'}
              {loading && (
                <span className='indicator-progress' style={{display: 'block'}}>
                  Please wait...{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditAccount
