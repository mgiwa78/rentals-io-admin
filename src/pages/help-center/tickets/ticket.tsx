import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {selectToken, selectUser} from '../../../redux/selectors/auth'
import TTicket from '../../../types/ticket'
import get from '../../../lib/get'
import {formatDistanceToNow} from 'date-fns'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import put from '../../../lib/put'
import post from '../../../lib/post'
import TTicketResponse from '../../../types/ticket-response'

type Props = {ticket: TTicket}

const initialValues = {
  message: '',
}
const ticketResponseSchema = Yup.object().shape({
  message: Yup.string().required('Message is required'),
})

const Ticket = ({ticket}: Props) => {
  const currentUser = useSelector(selectUser)

  const token = useSelector(selectToken)
  const [IsLoading, setIsLoading] = useState<boolean>(false)

  const [tickets, setTickets] = useState<Array<TTicket>>()
  const [ticketsResponses, setTicketsResponses] = useState<Array<TTicketResponse>>()

  const getTicket = async () => {
    const RESPONSE = await get('tickets', token)

    if (RESPONSE?.data) {
      setTickets(RESPONSE.data)
    }
  }
  const getTicketResponses = async () => {
    const RESPONSE = await get(`tickets-response/${ticket._id}`, token)

    if (RESPONSE?.data) {
      setTicketsResponses(RESPONSE.data)
    }
  }

  useEffect(() => {
    getTicket()
    getTicketResponses()
  }, [token])

  const formik = useFormik({
    initialValues,
    validationSchema: ticketResponseSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      setIsLoading(true)
      try {
        await post(
          'tickets-response',
          {...values, ticketId: ticket._id},
          token,
          true,
          'Response Submitted'
        )

        if (1) {
          formik.values = initialValues
          getTicket()
        }

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
    <div className='card'>
      <div className='card-body'>
        <div className='d-flex flex-column flex-xl-row p-7'>
          <div className='flex-lg-row-fluid me-xl-15 mb-20 mb-xl-0'>
            <div className='mb-0'>
              <div className='d-flex align-items-center mb-12'>
                <i className='ki-duotone ki-file-added fs-4qx text-success ms-n2 me-3'>
                  <span className='path1'></span>
                  <span className='path2'></span>
                </i>
                <div className='d-flex flex-column'>
                  <h1 className='text-gray-800 fw-semibold'>{ticket.subject}</h1>
                  <div className=''>
                    <span className='fw-semibold text-muted me-6'>
                      Category:
                      <a href='#' className='text-muted text-hover-primary'>
                        {ticket?.category?.title}
                      </a>
                    </span>
                    <span className='fw-semibold text-muted me-6'>
                      By:
                      <a href='#' className='text-muted text-hover-primary'>
                        {ticket?.author?.fullName}
                      </a>
                    </span>
                    <span className='fw-semibold text-muted'>
                      Created:
                      <span className='fw-bold text-gray-600 me-1'>
                        {' '}
                        {formatDistanceToNow(new Date(ticket?.createdAt), {addSuffix: true})}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className='mb-15' data-select2-id='select2-data-140-7rzi'>
                <div className='mb-15 fs-5 fw-normal text-gray-800'>
                  <div className='mb-5 fs-5'>Hello,</div>
                  <div className='mb-10'>{ticket.description}</div>

                  <div className='mb-9'>
                    <h1 className='text-gray-800 fw-semibold mb-10'>Responses</h1>
                    {ticketsResponses?.map((ticketsResponse) => (
                      <div key={ticketsResponse._id} className='card card-bordered w-100 mb-10'>
                        <div className='card-body'>
                          <div className='w-100 d-flex flex-stack mb-8'>
                            <div className='d-flex align-items-center f'>
                              <div className='symbol symbol-50px me-5'>
                                <div className='symbol-label fs-1 fw-bold bg-light-success text-success'>
                                  {ticketsResponse.author.fullName[0]}
                                </div>
                              </div>
                              <div className='d-flex flex-column fw-semibold fs-5 text-gray-600 text-dark'>
                                <div className='d-flex align-items-center'>
                                  <a className='text-gray-800 fw-bold text-hover-primary fs-5 me-3'>
                                    {ticketsResponse.author.fullName +
                                      ' ' +
                                      ticketsResponse.author.fullName}
                                  </a>
                                  {ticket.author._id === ticketsResponse.author._id && (
                                    <span className='badge badge-light-danger'>Author</span>
                                  )}
                                </div>
                                <span className='text-muted fw-semibold fs-6'>
                                  {' '}
                                  {formatDistanceToNow(new Date(ticketsResponse?.createdAt), {
                                    addSuffix: true,
                                  })}
                                </span>
                              </div>
                            </div>
                            {/* <div className='m-0'>
                              <button className='btn btn-color-gray-400 btn-active-color-primary p-0 fw-bold'>
                                Reply
                              </button>
                            </div> */}
                          </div>
                          <p className='fw-normal fs-5 text-gray-700 m-0'>
                            {ticketsResponse.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className='row mb-7'>
                    <div className='col-sm-3 fv-row mb-3' data-select2-id='select2-data-155-jmvd'>
                      <label className='fs-6 fw-semibold mb-2'>Status</label>
                      <select
                        className='form-select form-select-solid select2-hidden-accessible'
                        data-control='select2'
                        data-placeholder='Status'
                        data-hide-search='true'
                        data-select2-id='select2-data-15-ycg1'
                        tabIndex={-1}
                        aria-hidden='true'
                        data-kt-initialized='1'
                      >
                        <option value='1' selected data-select2-id='select2-data-17-hr5m'>
                          Open
                        </option>
                        <option value='2' data-select2-id='select2-data-156-iw2x'>
                          Pending
                        </option>
                        <option value='3' data-select2-id='select2-data-157-y9i5'>
                          Resolved
                        </option>
                        <option value='3' data-select2-id='select2-data-158-kpjw'>
                          Closed
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className='mb-0'>
                    <form onSubmit={formik.handleSubmit}>
                      <textarea
                        className='form-control form-control-solid placeholder-gray-600 fw-bold fs-4 ps-9 pt-7'
                        rows={6}
                        {...formik.getFieldProps('message')}
                        placeholder='Share Your Knowledge'
                      ></textarea>
                      {formik.touched.message && formik.errors.message && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>
                            <span role='alert'>{formik.errors.message}</span>
                          </div>
                        </div>
                      )}
                      <button
                        type='submit'
                        id='kt_sign_in_submit'
                        className='btn btn-primary mt-5'
                        disabled={formik.isSubmitting || !formik.isValid}
                      >
                        {!IsLoading && <span className='indicator-label'>Send </span>}
                        {IsLoading && (
                          <span className='indicator-progress' style={{display: 'block'}}>
                            Please wait...
                            <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                          </span>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* <ul className='pagination'>
                <li className='page-item previous disabled'>
                  <a href='#' className='page-link'>
                    <i className='previous'></i>
                  </a>
                </li>
                <li className='page-item'>
                  <a href='#' className='page-link'>
                    1
                  </a>
                </li>
                <li className='page-item active'>
                  <a href='#' className='page-link'>
                    2
                  </a>
                </li>
                <li className='page-item'>
                  <a href='#' className='page-link'>
                    3
                  </a>
                </li>
                <li className='page-item'>
                  <a href='#' className='page-link'>
                    4
                  </a>
                </li>
                <li className='page-item'>
                  <a href='#' className='page-link'>
                    5
                  </a>
                </li>
                <li className='page-item'>
                  <a href='#' className='page-link'>
                    6
                  </a>
                </li>
                <li className='page-item next'>
                  <a href='#' className='page-link'>
                    <i className='next'></i>
                  </a>
                </li>
              </ul> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ticket
