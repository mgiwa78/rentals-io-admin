import {FC, useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty, toAbsoluteUrl} from '../../../_metronic/helpers'
import clsx from 'clsx'
import {UsersListLoading} from './loading/UsersListLoading'
import useUserManagement from '../hooks/userManagement'
import User, {UserEdit} from '../../../types/User'
import {useSelector} from 'react-redux'
import {RootState} from '../../../redux/store'
import get from '../../../lib/get'
import Role from '../../../types/Role'
import {create} from 'domain'
import {selectAuth, selectToken} from '../../../redux/selectors/auth'
// import {createUser, updateUser} from '../core/_requests'
// import {useQueryResponse} from '../core/QueryResponseProvider'

type Props = {
  isUserLoading?: boolean
  user?: User
  state?: any
}

const rolesState: {[key: string]: boolean} = {}

const editUserSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  contact: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('contact is required'),
  password: Yup.string()
    .min(8, 'Minimum 8 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
  fullName: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Fullname is required'),
})

const UserEditModalForm: FC<Props> = ({state}) => {
  const auth = useSelector(selectAuth)
  const {
    setItemIdForUpdate,
    updateUser,
    createUser,
    getUsers,
    allRoles,
    user: us,
    isLoading: isUserLoading,
  } = state

  const token = useSelector(selectToken)

  const [roles, setRoles] = useState<Array<any>>([])
  const [rolesState, setRolesState] = useState<any>(false)
  const [userForEdit, setuserForEdit] = useState<UserEdit>({
    ...us,
    ...roles,
  })

  const getRoles = async () => {
    if (token) {
      const RESPONSE = await get('roles', token)
      setRoles(RESPONSE.data)
    }
  }

  useEffect(() => {
    getRoles()
  }, [])

  useEffect(() => {
    if (roles) {
      const rolesState: {[key: string]: boolean} = {}
      roles.forEach((e) => {
        if (userForEdit._id) {
          rolesState[e._id] = userForEdit.roles.some((r) => r.name === e.name)
        } else {
          rolesState[e._id] = false
        }
      })
      setRolesState(rolesState)
      setuserForEdit({...userForEdit, rolesState: rolesState})
    }
  }, [roles])

  // roleStatus: roles.map((r) => {
  //     return {[r.name]: us.roles.some((e) => e.name === r.name)}
  //   }),

  const cancel = (withRefresh?: boolean) => {
    // if (withRefresh) {
    //   refetch()
    // }
    setItemIdForUpdate(undefined)
  }

  const blankImg = toAbsoluteUrl('/media/svg/avatars/blank.svg')
  // const userAvatarImg = toAbsoluteUrl(`/media/${userForEdit.avatar}`)

  const formik = useFormik({
    initialValues: {
      ...userForEdit,
      contact: '',
      password: 'Password',
    },

    validationSchema: editUserSchema,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      try {
        if (userForEdit._id) {
          console.log(1)
          updateUser({...values, rolesState: userForEdit.rolesState}, token)
        } else {
          console.log(2)
          createUser({...values, rolesState: userForEdit.rolesState}, token)
        }
        console.log()
        setSubmitting(false)
      } catch (ex) {
        console.error(ex)
      } finally {
        setSubmitting(true)
        cancel(true)
      }
    },
  })
  return (
    <>
      <form id='kt_modal_add_user_form' className='form' onSubmit={formik.handleSubmit} noValidate>
        {/* begin::Scroll */}
        <div
          className='d-flex flex-column scroll-y me-n7 pe-7'
          id='kt_modal_add_user_scroll'
          data-kt-scroll='true'
          data-kt-scroll-activate='{default: false, lg: true}'
          data-kt-scroll-max-height='auto'
          data-kt-scroll-dependencies='#kt_modal_add_user_header'
          data-kt-scroll-wrappers='#kt_modal_add_user_scroll'
          data-kt-scroll-offset='300px'
        >
          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <div className='col-6'>
              <label className='d-block fw-bold fs-6 mb-5'>Avatar</label>
              {/* end::Label */}

              {/* begin::Image input */}
              <div
                className='image-input image-input-outline'
                data-kt-image-input='true'
                style={{backgroundImage: `url('${blankImg}')`}}
              >
                {/* begin::Preview existing avatar */}
                <div
                  className='image-input-wrapper w-125px h-125px'
                  style={{backgroundImage: `url('${userForEdit?.avatar}')`}}
                ></div>
                {/* end::Preview existing avatar */}

                {/* begin::Label */}
                {/* <label
              className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
              data-kt-image-input-action='change'
              data-bs-toggle='tooltip'
              title='Change avatar'
            >
              <i className='bi bi-pencil-fill fs-7'></i>

              <input type='file' name='avatar' accept='.png, .jpg, .jpeg' />
              <input type='hidden' name='avatar_remove' />
            </label> */}
                {/* end::Label */}

                {/* begin::Cancel */}
                {/* <span
              className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
              data-kt-image-input-action='cancel'
              data-bs-toggle='tooltip'
              title='Cancel avatar'
            >
              <i className='bi bi-x fs-2'></i>
            </span> */}
                {/* end::Cancel */}

                {/* begin::Remove */}
                {/* <span
              className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
              data-kt-image-input-action='remove'
              data-bs-toggle='tooltip'
              title='Remove avatar'
            >
              <i className='bi bi-x fs-2'></i>
            </span> */}
                {/* end::Remove */}
              </div>
            </div>
            {userForEdit?.roles?.some((role: Role) => role.name === 'Student') ||
              (userForEdit?.roles?.some((role: Role) => role.name === 'Student') && (
                <div className='col-6'>
                  <label className='required fw-bold fs-6 mb-2'>Student Id</label>

                  <input
                    readOnly={true}
                    placeholder='StudentId'
                    {...formik.getFieldProps('studentId')}
                    type='text'
                    className={clsx(
                      'form-control form-control-solid mb-3 mb-lg-0',
                      {'is-invalid': formik.touched.studentId && formik.errors.studentId},
                      {
                        'is-valid': formik.touched.studentId && !formik.errors.studentId,
                      }
                    )}
                    autoComplete='off'
                    disabled={formik.isSubmitting || isUserLoading}
                  />
                  {formik.touched.fullName && formik.errors.fullName && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>
                        <span role='alert'>{formik.errors.fullName}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}

            {/* end::Image input */}

            {/* begin::Hint */}
            {/* <div className='form-text'>Allowed file types: png, jpg, jpeg.</div> */}
            {/* end::Hint */}
          </div>
          {/* end::Input group */}
          {/* begin::Input group */}
          <div className='row mb-7'>
            <div className='col-12'>
              <label className='required fw-bold fs-6 mb-2'>Full Name</label>
              {/* end::Label */}

              {/* begin::Input */}
              <input
                placeholder='Full name'
                {...formik.getFieldProps('fullName')}
                type='text'
                name='fullName'
                className={clsx(
                  'form-control form-control-solid mb-3 mb-lg-0',
                  {'is-invalid': formik.touched.fullName && formik.errors.fullName},
                  {
                    'is-valid': formik.touched.fullName && !formik.errors.fullName,
                  }
                )}
                autoComplete='off'
                disabled={formik.isSubmitting || isUserLoading}
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.fullName}</span>
                  </div>
                </div>
              )}
            </div>

            {/* begin::Label */}

            {/* end::Input */}
          </div>
          {/* end::Input group */}
          {/* begin::Input group */}
          <div className='row mb-7'>
            {' '}
            <div className='col-12'>
              {/* begin::Label */}
              <label className='required fw-bold fs-6 mb-2'>Email</label>
              {/* end::Label */}
              {/* begin::Input */}
              <input
                placeholder='Email'
                {...formik.getFieldProps('email')}
                className={clsx(
                  'form-control form-control-solid mb-3 mb-lg-0',
                  {'is-invalid': formik.touched.email && formik.errors.email},
                  {
                    'is-valid': formik.touched.email && !formik.errors.email,
                  }
                )}
                type='email'
                name='email'
                autoComplete='off'
                disabled={formik.isSubmitting || isUserLoading}
              />
              {/* end::Input */}
              {formik.touched.email && formik.errors.email && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.email}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className='row mb-7'>
            {' '}
            <div className='col-12'>
              {/* begin::Label */}
              <label className='required fw-bold fs-6 mb-2'>Contact</label>
              {/* end::Label */}
              {/* begin::Input */}
              <input
                placeholder='Contact'
                {...formik.getFieldProps('contact')}
                className={clsx(
                  'form-control form-control-solid mb-3 mb-lg-0',
                  {'is-invalid': formik.touched.contact && formik.errors.contact},
                  {
                    'is-valid': formik.touched.contact && !formik.errors.contact,
                  }
                )}
                type='contact'
                name='contact'
                autoComplete='off'
                disabled={formik.isSubmitting || isUserLoading}
              />
              {/* end::Input */}
              {formik.touched.contact && formik.errors.contact && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.contact}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {!state.user._id ? (
            <div className='fv-row mb-7'>
              {' '}
              {/* begin::Label */}
              <label className='required fw-bold fs-6 mb-2'>
                Password <span className='text-muted'>: Default password is Password</span>
              </label>
              {/* end::Label */}
              {/* begin::Input */}
              <input
                placeholder='Password'
                {...formik.getFieldProps('password')}
                className={clsx(
                  'form-control form-control-solid mb-3 mb-lg-0',
                  {'is-invalid': formik.touched.password && formik.errors.password},
                  {
                    'is-valid': formik.touched.password && !formik.errors.password,
                  }
                )}
                type='password'
                name='password'
                autoComplete='off'
                disabled={formik.isSubmitting || isUserLoading}
              />
              {/* end::Input */}
              {formik.touched.password && formik.errors.password && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.password}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            ''
          )}

          {/* end::Input group */}
          {/* begin::Input group */}
          {auth.user?.roles.some((role) => role.name === 'superadmin') && (
            <div className='mb-7'>
              {/* begin::Label */}
              <label className='required fw-bold fs-6 mb-5'>Role</label>
              {/* end::Label */}
              {/* begin::Roles */}
              {/* begin::Input row */}
              {roles.map((role: Role) => {
                if (state.user._id)
                  return (
                    <div
                      className='form-check form-check-custom form-check-solid my-3'
                      key={role._id}
                    >
                      <input
                        className='form-check-input me-3'
                        name={role.name}
                        type='checkbox'
                        defaultChecked={rolesState[role._id]}
                        id='kt_modal_update_role_option_0'
                        onClick={() => {
                          if (userForEdit.rolesState) {
                            console.log(2)
                            console.log(userForEdit.rolesState[role._id])
                            userForEdit.rolesState[role._id] = !userForEdit.rolesState[role._id]
                          }
                        }}
                      />

                      {/* end::Input */}
                      {/* begin::Label */}
                      <label className='form-check-label' htmlFor='kt_modal_update_role_option_0'>
                        <div className='fw-bolder text-gray-800'>
                          {formik.values.roles.some((e) => e.name === role.name)
                            ? 'This user is a '
                            : ''}
                          {role.name}
                        </div>
                        <div className='text-gray-600'>
                          {/* Best for business owners and company administrators */}
                        </div>
                      </label>
                      {/* end::Label */}
                    </div>
                  )
                else
                  return (
                    <div
                      className='form-check form-check-custom form-check-solid my-3'
                      key={role._id}
                    >
                      {/* begin::Input */}
                      <input
                        className='form-check-input me-3'
                        name={role._id}
                        type='checkbox'
                        onClick={() => {
                          if (userForEdit.rolesState) {
                            console.log(userForEdit.rolesState[role._id])
                            userForEdit.rolesState[role._id] = !userForEdit.rolesState[role._id]
                          }
                        }}
                        id='kt_modal_update_role_option_0'
                      />

                      {/* end::Input */}
                      {/* begin::Label */}
                      <label className='form-check-label' htmlFor='kt_modal_update_role_option_0'>
                        <div className='fw-bolder text-gray-800'>{role.name}</div>
                        <div className='text-gray-600'>
                          {/* Best for business owners and company administrators */}
                        </div>
                      </label>
                      {/* end::Label */}
                    </div>
                  )
              })}

              {/* end::Input row */}
              {/* <div className='separator separator-dashed my-5'></div>
            {/* begin::Input row
            <div className='d-flex fv-row'>
          
              <div className='form-check form-check-custom form-check-solid'>
                <input
                  className='form-check-input me-3'
                  {...formik.getFieldProps('student')}
                  name='student'
                  type='checkbox'
                  value='Student'
                  id='kt_modal_update_role_option_1'
                  checked={formik.values.student}
                />
             
             
                <label className='form-check-label' htmlFor='kt_modal_update_role_option_1'>
                  <div className='fw-bolder text-gray-800'>
                    {formik.values.roles.some((e) => e.name === 'Student') ? 'This user is a ' : ''}
                    Student
                  </div>
                  {/* <div className='text-gray-600'>
                    Best for developers or people primarily using the API
                  </div> 
                </label>
            
              </div>
           
            </div>
       
            <div className='separator separator-dashed my-5'></div>
          
            <div className='d-flex fv-row'>
        
              <div className='form-check form-check-custom form-check-solid'>
            
                <input
                  className='form-check-input me-3'
                  {...formik.getFieldProps('supervisor')}
                  name='supervisor'
                  type='checkbox'
                  value='Supervisor'
                  id='kt_modal_update_role_option_2'
                  checked={formik.values.supervisor}
                />

         
         
                <label className='form-check-label' htmlFor='kt_modal_update_role_option_2'>
                  <div className='fw-bolder text-gray-800'>
                    {formik.values.roles.some((e) => e.name === 'Supervisor')
                      ? 'This user is a '
                      : ''}
                    Supervisor
                  </div>
                </label>
       x
              </div>
        
            </div> */}
              {/* end::Input row */}
              <div className='separator separator-dashed my-5'></div>
            </div>
          )}
          {/* end::Input group */}
        </div>
        {/* end::Scroll */}

        {/* begin::Actions */}
        <div className='text-center pt-15'>
          <button
            type='reset'
            onClick={() => cancel()}
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
        {/* end::Actions */}
      </form>
      {(formik.isSubmitting || isUserLoading) && <UsersListLoading />}
    </>
  )
}

export {UserEditModalForm}
