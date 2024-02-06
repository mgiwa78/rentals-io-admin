import React, {useEffect, useState} from 'react'
import get from '../../../lib/get'
import TFaqCategories from '../../../types/faqCategories'
import {selectToken} from '../../../redux/selectors/auth'
import {useSelector} from 'react-redux'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import put from '../../../lib/put'
import post from '../../../lib/post'

type Props = {
  setCreateTicket: Function
  ticket: any
}

const initialValues = {
  category: '',
  description: '',
  subject: '',
}
const createTicketSchema = Yup.object().shape({
  subject: Yup.string().required('Subject is required'),
  description: Yup.string().required('Description is required'),
  category: Yup.string().required('Category is required'),
})

const CreateTicket = ({setCreateTicket, ticket = null}: Props) => {
  const [faqCategories, setFaqCategories] = useState<Array<TFaqCategories>>()
  const token = useSelector(selectToken)
  const [IsLoading, setIsLoading] = useState<boolean>(false)

  const getFaqCategories = async () => {
    const RESPONSE = await get('ticketCategories', token)
    if (RESPONSE?.data) {
      setFaqCategories(RESPONSE.data)
    }
  }
  useEffect(() => {
    getFaqCategories()
  }, [])

  const formik = useFormik({
    // initialValues: ticket._id
    //   ? {category: ticket?.category, question: ticket?.subject, answer: ticket?.answer}
    //   : initialValues,
    initialValues,
    validationSchema: createTicketSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      setIsLoading(true)
      try {
        if (ticket._id) {
          await put(`tickets/${ticket._id}`, {...values}, token, true, 'Ticket Updated')
        } else {
          await post('tickets', {...values}, token, true, 'Ticket Created')
        }

        if (1) {
          formik.values = initialValues
          // refresh()
        }
        setCreateTicket(false)

        setSubmitting(false)
        setIsLoading(false)
      } catch (error: any) {
        console.log(error)
        setSubmitting(false)
        setIsLoading(false)

        if (error.response?.data.message) {
          return setStatus(error.response.data.message)
        }
        if (error.response?.data.error) {
          return setStatus(error.response.data.error)
        } else {
          return setStatus(error.error)
        }
      }
    },
  })

  
  return (
    <>
      <div
        className='modal fade show'
        id='kt_modal_new_ticket'
        tabIndex={-1}
        aria-modal='true'
        role='dialog'
        style={{display: 'block'}}
      >
        <div className='modal-dialog modal-dialog-centered mw-750px'>
          <div className='modal-content rounded'>
            <div className='modal-header pb-0 border-0 justify-content-end'>
              <div
                onClick={() => setCreateTicket(null)}
                className='btn btn-sm btn-icon btn-active-color-primary'
                data-bs-dismiss='modal'
              >
                <i className='ki-duotone ki-cross fs-1'>
                  <span className='path1'></span>
                  <span className='path2'></span>
                </i>
              </div>
            </div>
            <div className='modal-body scroll-y px-10 px-lg-15 pt-0 pb-15'>
              <form
                onSubmit={formik.handleSubmit}
                id='kt_modal_new_ticket_form'
                className='form fv-plugins-bootstrap5 fv-plugins-framework'
              >
                <div className='mb-13 text-center'>
                  <h1 className='mb-3'>Create Ticket</h1>
                </div>
                <div className='d-flex flex-column mb-8 fv-row fv-plugins-icon-container'>
                  <label className='d-flex align-items-center fs-6 fw-semibold mb-2'>
                    <span className='required'>Subject</span>
                    <span
                      className='ms-2'
                      data-bs-toggle='tooltip'
                      aria-label='Specify a subject for your issue'
                      data-bs-original-title='Specify a subject for your issue'
                      data-kt-initialized='1'
                    >
                      <i className='ki-duotone ki-information fs-7'>
                        <span className='path1'></span>
                        <span className='path2'></span>
                        <span className='path3'></span>
                      </i>
                    </span>
                  </label>
                  <input
                    type='text'
                    className='form-control form-control-solid'
                    placeholder='Enter your ticket subject'
                    {...formik.getFieldProps('subject')}
                  />
                  {formik.touched.subject && formik.errors.subject && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.subject}</div>
                    </div>
                  )}
                </div>
                <div className='row g-9 mb-8'>
                  <div className='col-md-12 fv-row'>
                    <label className='required fs-6 fw-semibold mb-2'>Category</label>
                    <select
                      className='form-select form-select-solid select2-hidden-accessible'
                      data-control='select2'
                      data-hide-search='true'
                      data-placeholder='Select a category'
                      {...formik.getFieldProps('category')}
                      data-select2-id='select2-data-9-d4ue'
                      tabIndex={-1}
                      aria-hidden='true'
                      data-kt-initialized='1'
                    >
                      <option value='' data-select2-id='select2-data-11-7wib'>
                        Select a category...
                      </option>
                      {faqCategories?.map((cat) => (
                        <option value={cat._id}>{cat.title}</option>
                      ))}
                    </select>
                    {formik.touched.category && formik.errors.category && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.category}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className='d-flex flex-column mb-8 fv-row fv-plugins-icon-container'>
                  <label className='fs-6 fw-semibold mb-2 required'>Description</label>
                  <textarea
                    className='form-control form-control-solid'
                    rows={4}
                    {...formik.getFieldProps('description')}
                    placeholder='Type your ticket description'
                  ></textarea>
                  {formik.touched.description && formik.errors.description && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.description}</div>
                    </div>
                  )}
                </div>

                <div className='text-center'>
                  <button
                    onClick={() => setCreateTicket(null)}
                    type='reset'
                    id='kt_modal_new_ticket_cancel'
                    className='btn btn-light me-3'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    id='kt_sign_in_submit'
                    className='btn btn-primary'
                    disabled={formik.isSubmitting || !formik.isValid}
                  >
                    <i className='ki-duotone ki-badge fs-2  mx-2'>
                      <span className='path1'></span>
                      <span className='path2'></span>
                      <span className='path3'></span>
                      <span className='path4'></span>
                      <span className='path5'></span>
                    </i>
                    {!IsLoading && (
                      <span className='indicator-label'>{ticket._id ? 'Update' : 'Create'}</span>
                    )}
                    {IsLoading && (
                      <span className='indicator-progress' style={{display: 'block'}}>
                        Please wait...
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className='modal-backdrop fade show' onClick={() => setCreateTicket(false)}></div>
    </>
  )
}

export default CreateTicket
