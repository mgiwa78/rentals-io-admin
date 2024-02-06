import React, {useEffect, useState} from 'react'
import Role from '../../../types/Role'
import {useSelector} from 'react-redux'
import {selectAuth} from '../../../redux/selectors/auth'
import get from '../../../lib/get'
import Permission from '../../../types/Permission'
import {Modal} from 'react-bootstrap'
import {createPortal} from 'react-dom'
import * as Yup from 'yup'
import {FastField, useFormik} from 'formik'
import post from '../../../lib/post'
import clsx from 'clsx'
interface All {
  name: string
  permissions: any
}
const modalsRoot = document.getElementById('root-modals') || document.body

const createRoleSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Role Name is required'),
})

const CreateRole = ({show, handleClose}: {show: boolean; handleClose: Function}) => {
  const initialValues: All = {
    name: '',
    permissions: {},
  }

  const {token} = useSelector(selectAuth)
  const [permissions, setPermissions] = useState<Array<Permission>>([])

  const getPermissions = async () => {
    if (token) {
      const RESPONSE = await get('permissions', token)
      setPermissions(RESPONSE.data)
    }
  }

  const handleChange = (e: any, id: any) => {
    e.target.checked = formik.values.permissions[id]?.state
      ? !formik.values.permissions[id].state
      : true

    formik.values.permissions = {
      ...formik.values.permissions,
      [id]: {
        state: formik.values.permissions[id]?.state ? !formik.values.permissions[id].state : true,
        id,
      },
    }
    console.log(formik.values.permissions)
  }

  useEffect(() => {
    getPermissions()
  }, [])

  // useEffect(() => {
  //   if (permissions.length && !Object.keys(permissionValues)) {
  //     permissions.forEach((e) => {
  //       formik.values.permissions[e._id] = {state: false, id: e._id}
  //     })
  //   }
  // }, [permissions])

  const formik = useFormik({
    initialValues,
    validationSchema: createRoleSchema,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      console.log(values)
      try {
        await post('roles', values, token, true, 'Role Created Successfully').then(() => {
          setSubmitting(false)
          handleClose()
        })
      } catch (ex) {
        console.error(ex)
      } finally {
        setSubmitting(true)
      }
    },
  })
  return createPortal(
    <Modal
      tabIndex={-1}
      aria-hidden='true'
      dialogClassName='modal-dialog modal-dialog-centered mw-600px'
      show={show}
      // onHide={handleClose}
      backdrop={true}
      className='modal fade'
      id='kt_create_role_modal'
    >
      <div className='modal-header'>
        <h2 className='fw-bold'>Add a Role</h2>
        <div
          className='btn btn-icon btn-sm btn-active-icon-primary'
          data-kt-roles-modal-action='close'
          onClick={() => handleClose()}
        >
          <i className='ki-duotone ki-cross fs-1'>
            <span className='path1'></span>
            <span className='path2'></span>
          </i>
        </div>
      </div>
      <div className='modal-body scroll-y mx-lg-5 my-7'>
        <form
          onSubmit={formik.handleSubmit}
          noValidate
          id='kt_modal_add_role_form'
          className='form fv-plugins-bootstrap5 fv-plugins-framework'
        >
          <div
            className='d-flex flex-column scroll-y me-n7 pe-7'
            id='kt_modal_add_role_scroll'
            data-kt-scroll='true'
            data-kt-scroll-activate='{default: false, lg: true}'
            data-kt-scroll-max-height='auto'
            data-kt-scroll-dependencies='#kt_modal_add_role_header'
            data-kt-scroll-wrappers='#kt_modal_add_role_scroll'
            data-kt-scroll-offset='300px'
            style={{maxHeight: '418px'}}
          >
            <div className='fv-row mb-10 fv-plugins-icon-container'>
              <label className='fs-5 fw-bold form-label mb-2'>
                <span className='required'>Role name</span>
              </label>
              <input
                placeholder='Enter a Rolename'
                {...formik.getFieldProps('name')}
                type='text'
                name='name'
                className={clsx(
                  'form-control form-control-solid mb-3 mb-lg-0',
                  {'is-invalid': formik.touched.name && formik.errors.name},
                  {
                    'is-valid': formik.touched.name && !formik.errors.name,
                  }
                )}
              />
              {formik.touched.name && formik.errors.name && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.name[0]}</span>
                  </div>
                </div>
              )}
              <div className='fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback'></div>
            </div>
            <div className='fv-row'>
              <label className='fs-5 fw-bold form-label mb-2'>Role Permissions</label>
              <div className='table-responsive'>
                <table className='table align-middle table-row-dashed fs-6 gy-5'>
                  <tbody className='text-gray-600 fw-semibold'>
                    {/* <tr>
                      <td className='text-gray-800'>
                        Administrator Access
                        <span
                          className='ms-2'
                          data-bs-toggle='popover'
                          data-bs-trigger='hover'
                          data-bs-html='true'
                          data-bs-content='Allows a full access to the system'
                          data-kt-initialized='1'
                        >
                          <i className='ki-duotone ki-information fs-7'>
                            <span className='path1'></span>
                            <span className='path2'></span>
                            <span className='path3'></span>
                          </i>
                        </span>
                      </td>
                      <td>
                        <label className='form-check form-check-custom form-check-solid me-9'>
                          <input
                            className='form-check-input'
                            type='checkbox'
                            value=''
                            id='kt_roles_select_all'
                          />
                          <span className='form-check-label'>Select all</span>
                        </label>
                      </td>
                    </tr> */}
                    {permissions.map((perm) => {
                      return (
                        <tr key={perm._id}>
                          <td className='text-gray-800'>{perm.action}</td>
                          <td>
                            <label className='form-check form-check-custom form-check-solid me-9'>
                              <input
                                className='form-check-input'
                                type='checkbox'
                                name={perm._id}
                                onChange={(e) => handleChange(e, perm._id)}
                                id='kt_roles_select_all'
                              />
                            </label>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className='text-center pt-15'>
            <button type='reset' className='btn btn-light me-3' onClick={() => handleClose()}>
              Discard
            </button>
            <button
              type='submit'
              className='btn btn-primary'
              data-kt-roles-modal-action='submit'
              disabled={formik.isSubmitting || !formik.isValid || !formik.touched}
            >
              <span className='indicator-label'>Submit</span>
              {formik.isSubmitting && (
                <span className='indicator-progress'>
                  Please wait...{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>,
    modalsRoot
  )
}

export default CreateRole
