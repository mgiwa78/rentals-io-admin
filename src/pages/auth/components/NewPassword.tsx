/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
import {useState, useEffect} from 'react'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'
import {getUserByToken, register} from '../core/_requests'
import {Link, useNavigate, useParams, useRoutes} from 'react-router-dom'
import {toAbsoluteUrl} from '../../../_metronic/helpers'
import {PasswordMeterComponent} from '../../../_metronic/assets/ts/components'
import {useAuth} from '../core/Auth'
import post from '../../../lib/post'
import * as swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(swal.default)

const initialValues = {
  password: '',
  changepassword: '',
  acceptTerms: false,
}

const NewPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
  changepassword: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password confirmation is required')
    .oneOf([Yup.ref('password')], "Password and Confirm Password didn't match"),
  acceptTerms: Yup.bool().required('You must accept the terms and conditions'),
})

export function NewPassword() {
  const navigate = useNavigate()
  let {token} = useParams()
  const [isVerifyToken, setIsVerifyToken] = useState<null | boolean | string>(null)
  useEffect(() => {
    if (token) {
      verifytoken(token)
    }
  }, [token])

  const verifytoken = async (token: string) => {
    const RESPONSE = await post('auth/verifyPasswordRequestToken', {token: token})
    if (RESPONSE) {
      setIsVerifyToken(true)
    } else {
      setIsVerifyToken('Invalid Token')
    }
  }
  const [loading, setLoading] = useState(false)
  const {saveAuth, setCurrentUser} = useAuth()
  const formik = useFormik({
    initialValues,
    validationSchema: NewPasswordSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      try {
        setLoading(true)
        setSubmitting(true)
        post('auth/passwordUpdate', {password: values.password, token})
        MySwal.fire({
          text: 'Password Update Successfully',
          icon: 'success',
          buttonsStyling: false,
          confirmButtonText: 'Login now!',

          heightAuto: false,
          customClass: {
            confirmButton: 'btn btn-danger',
          },
        }).then(() => {
          navigate('/auth/login')
        })
        setSubmitting(false)
        setLoading(false)
      } catch (error) {
        console.error(error)
        saveAuth(undefined)
        setStatus('The NewPassword details is incorrect')
        setSubmitting(false)
        setLoading(false)
      }
    },
  })

  useEffect(() => {
    PasswordMeterComponent.bootstrap()
  }, [])
  return (
    <>
      {isVerifyToken ? (
        <form
          className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
          noValidate
          id='kt_login_signup_form'
          onSubmit={formik.handleSubmit}
        >
          {/* begin::Heading */}
          <div className='text-center mb-11'>
            {/* begin::Title */}
            <h1 className='text-dark fw-bolder mb-3'>Update Password</h1>
            {/* end::Title */}
          </div>

          {formik.status && (
            <div className='mb-lg-15 alert alert-danger'>
              <div className='alert-text font-weight-bold'>{formik.status}</div>
            </div>
          )}

          {/* begin::Form group Password */}
          <div className='fv-row mb-8' data-kt-password-meter='true'>
            <div className='mb-1'>
              <label className='form-label fw-bolder text-dark fs-6'>Password</label>
              <div className='position-relative mb-3'>
                <input
                  type='password'
                  placeholder='Password'
                  autoComplete='off'
                  {...formik.getFieldProps('password')}
                  className={clsx(
                    'form-control bg-transparent',
                    {
                      'is-invalid': formik.touched.password && formik.errors.password,
                    },
                    {
                      'is-valid': formik.touched.password && !formik.errors.password,
                    }
                  )}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>
                      <span role='alert'>{formik.errors.password}</span>
                    </div>
                  </div>
                )}
              </div>
              {/* begin::Meter */}
              <div
                className='d-flex align-items-center mb-3'
                data-kt-password-meter-control='highlight'
              >
                <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
                <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
                <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
                <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px'></div>
              </div>
              {/* end::Meter */}
            </div>
            <div className='text-muted'>
              Use 8 or more characters with a mix of letters, numbers & symbols.
            </div>
          </div>
          {/* end::Form group */}

          {/* begin::Form group Confirm password */}
          <div className='fv-row mb-5'>
            <label className='form-label fw-bolder text-dark fs-6'>Confirm Password</label>
            <input
              type='password'
              placeholder='Password confirmation'
              autoComplete='off'
              {...formik.getFieldProps('changepassword')}
              className={clsx(
                'form-control bg-transparent',
                {
                  'is-invalid': formik.touched.changepassword && formik.errors.changepassword,
                },
                {
                  'is-valid': formik.touched.changepassword && !formik.errors.changepassword,
                }
              )}
            />
            {formik.touched.changepassword && formik.errors.changepassword && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.changepassword}</span>
                </div>
              </div>
            )}
          </div>
          {/* end::Form group */}

          {/* begin::Form group */}
          <div className='fv-row mb-8'>
            <label className='form-check form-check-inline' htmlFor='kt_login_toc_agree'>
              <input
                className='form-check-input'
                type='checkbox'
                id='kt_login_toc_agree'
                {...formik.getFieldProps('acceptTerms')}
              />
              <span>
                I Accept the{' '}
                <a href='#' target='_blank' className='ms-1 link-primary'>
                  Terms
                </a>
                .
              </span>
            </label>
            {formik.touched.acceptTerms && formik.errors.acceptTerms && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.acceptTerms}</span>
                </div>
              </div>
            )}
          </div>
          {/* end::Form group */}

          {/* begin::Form group */}
          <div className='text-center'>
            <button
              type='submit'
              id='kt_sign_up_submit'
              className='btn btn-lg btn-primary w-100 mb-5'
              disabled={formik.isSubmitting || !formik.isValid || !formik.values.acceptTerms}
            >
              {!loading && <span className='indicator-label'>Submit</span>}
              {loading && (
                <span className='indicator-progress' style={{display: 'block'}}>
                  Please wait...{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
            <Link to='/auth/login'>
              <button
                type='button'
                id='kt_login_signup_form_cancel_button'
                className='btn btn-lg btn-light-primary w-100 mb-5'
              >
                Cancel
              </button>
            </Link>
          </div>
          {/* end::Form group */}
        </form>
      ) : (
        <div className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'>
          <div className='text-center mb-11'>
            {/* begin::Title */}
            <h1 className='text-dark fw-bolder mb-3'>Invalid Token</h1>
            {/* end::Title */}
          </div>
          <img
            className='mx-auto w-100 w-md-100 w-xl-100 mb-10 mb-lg-20'
            src={toAbsoluteUrl('/media/illustrations/dozzy-1/18-dark.png')}
            alt=''
          />
        </div>
      )}
    </>
  )
}
