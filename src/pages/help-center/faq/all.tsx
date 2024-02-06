import React, {useEffect, useState} from 'react'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import CreateFaqCategory from './createFaqCategory'
import {RootState} from '../../../redux/store'
import {useSelector} from 'react-redux'
import TFaqCategories from '../../../types/faqCategories'
import get from '../../../lib/get'
import {selectToken} from '../../../redux/selectors/auth'
import CreateFaq from './createFaq'
import TFaq from '../../../types/faq'
import {KTIcon} from '../../../_metronic/helpers'
import withReactContent from 'sweetalert2-react-content'
import * as swal from 'sweetalert2'
import deleteReq from '../../../lib/delete'
import {Spinner} from 'react-bootstrap'
type Props = {
  setFAQ: Function
  FAQ: 'new' | 'close' | TFaq
}

const MySwal = withReactContent(swal.default)

const HelpCenterFAQ = ({setFAQ, FAQ}: Props) => {
  const [category, setCategory] = useState<'new' | TFaqCategories>(null)
  const currentUser = useSelector((state: RootState) => state.auth.user)

  const [IsLoading, setIsLoading] = useState<boolean>(false)
  const token = useSelector(selectToken)

  const [faqCategories, setFaqCategories] = useState<Array<TFaqCategories>>()
  const [faqs, setFaqs] = useState<Array<TFaq>>()

  const getFaqCategories = async () => {
    const RESPONSE = await get('faqCategories', token)
    if (RESPONSE?.data) {
      setFaqCategories(RESPONSE.data)
    }
    setIsLoading(false)
  }

  const handleDelete = (faq: TFaq) => {
    MySwal.fire({
      title: 'Are you sure, you want to delete this document?',
      text: `Document title: ${faq.question}`,
      icon: 'error',
      buttonsStyling: false,
      confirmButtonText: 'Yes Delete!',
      showCancelButton: true,
      heightAuto: false,
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-secondary',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteFaq(faq._id).then((res) => {
          if (res?.data) {
            // refreshProject()
            MySwal.fire({
              title: 'Deleted!',
              text: 'Faq has been deleted.',
              icon: 'success',
            })
          }
          // else {
          //   MySwal.fire({
          //     title: 'Error',
          //     text: res?.error,
          //     icon: 'error',
          //     confirmButtonText: 'Close!',
          //     customClass: {
          //       confirmButton: 'btn btn-danger',
          //     },
          //   })
          // }
        })
      }
    })
  }
  const handleDeleteCategory = (faqCategory: TFaqCategories) => {
    MySwal.fire({
      title: 'Are you sure, you want to delete this category?',

      text: `All faqs of ${faqCategory.title} category will be deleted!`,
      icon: 'error',
      buttonsStyling: false,
      confirmButtonText: 'Yes Delete!',
      showCancelButton: true,
      heightAuto: false,
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-secondary',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteReq(`faqCategories/${faqCategory._id}`, token).then((res) => {
          if (res?.data) {
            MySwal.fire({
              title: 'Deleted!',
              text: 'Faq category has been deleted.',
              icon: 'success',
            })
            if (res?.data) {
              setFaqCategories(res.data)
            }
          }
        })
      }
    })
  }

  const groupedFaq = faqs?.reduce((result: any, current) => {
    const category = current.category
    if (!result[category]) {
      result[category] = []
    }
    result[category].push(current)
    return result
  }, {})

  const deleteFaq = async (faqId: string) => {
    const RESPONSE = await deleteReq(`faqs/${faqId}`, token)

    if (RESPONSE?.data) {
      setFaqs(RESPONSE.data)
    }

    return RESPONSE
  }
  const getFaq = async () => {
    const RESPONSE = await get('faqs', token)

    if (RESPONSE?.data) {
      setFaqs(RESPONSE.data)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    setIsLoading(true)
    getFaqCategories()
    getFaq()
  }, [token])

  return (
    <>
      <div className='row mt-5' style={{maxHeight: '400px', overflowY: 'scroll'}}>
        {faqCategories && groupedFaq ? (
          faqCategories?.map((cat) => {
            const c = cat
            return (
              <div className='col-6 ' key={cat._id}>
                <div key={c?._id} className='card mb-15 h-100 card-stretch flex-grow'>
                  <div className='m-0 card-body'>
                    <h3 className='text-gray-800 w-bolder mb-4'>{c?.title}</h3>
                    {groupedFaq[c?._id] ? (
                      groupedFaq[c?._id]?.map((faq: TFaq) => (
                        <div key={faq._id}>
                          <div
                            style={{position: 'relative'}}
                            key={faq._id + 'question'}
                            className='d-flex align-items-center collapsible py-3 toggle mb-0 collapsed'
                            data-bs-toggle='collapse'
                            data-bs-target={`#faq_${faq._id}`}
                            aria-expanded='false'
                          >
                            <div className='btn btn-sm btn-icon mw-20px btn-active-color-primary me-5'>
                              <i className='ki-duotone ki-minus-square toggle-on text-primary fs-1'>
                                <span className='path1'></span>
                                <span className='path2'></span>
                              </i>
                              <i className='ki-duotone ki-plus-square toggle-off fs-1'>
                                <span className='path1'></span>
                                <span className='path2'></span>
                                <span className='path3'></span>
                              </i>
                            </div>
                            <h4 className='text-gray-700 fw-bold cursor-pointer mb-0'>
                              {faq.question}
                            </h4>
                            <div>
                              {currentUser?.roles.some((role) => role.name === 'superadmin') && (
                                <>
                                  <button
                                    type='button'
                                    onClick={() => setFAQ(faq)}
                                    className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary mb-2'
                                    data-kt-menu-trigger='click'
                                    data-kt-menu-placement='bottom-end'
                                    data-kt-menu-flip='top-end'
                                    title='Delete'
                                    style={{
                                      position: 'absolute',
                                      right: '50px',
                                      top: '10px',
                                    }}
                                  >
                                    <KTIcon iconName='pencil' className='fs-2' />
                                  </button>
                                  <button
                                    type='button'
                                    onClick={() => handleDelete(faq)}
                                    className='btn btn-sm btn-icon btn-color-danger btn-active-light-danger mb-2'
                                    data-kt-menu-trigger='click'
                                    data-kt-menu-placement='bottom-end'
                                    data-kt-menu-flip='top-end'
                                    title='Delete'
                                    style={{
                                      position: 'absolute',
                                      right: '10px',
                                      top: '10px',
                                    }}
                                  >
                                    <KTIcon iconName='trash' className='fs-2' />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                          <div
                            key={faq._id + 'answer'}
                            id={`faq_${faq._id}`}
                            className='fs-6 ms-1 collapse'
                          >
                            <div className='mb-4 text-gray-600 fw-semibold fs-6 ps-10'>
                              {faq.answer}
                            </div>
                            <div className='separator separator-dashed'></div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <h4 className=' text-muted cursor-pointer mb-0 '>No Faq</h4>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <Spinner animation='grow' />
        )}
      </div>
      {/* {faqs &&
                        faqs.map((faq) => (
                          <div key={faq._id} className='m-0'>
                            <div
                              style={{position: 'relative'}}
                              key={faq._id + 'question'}
                              className='d-flex align-items-center collapsible py-3 toggle mb-0 collapsed'
                              data-bs-toggle='collapse'
                              data-bs-target={`#faq_${faq._id}`}
                              aria-expanded='false'
                            >
                              <div className='btn btn-sm btn-icon mw-20px btn-active-color-primary me-5'>
                                <i className='ki-duotone ki-minus-square toggle-on text-primary fs-1'>
                                  <span className='path1'></span>
                                  <span className='path2'></span>
                                </i>
                                <i className='ki-duotone ki-plus-square toggle-off fs-1'>
                                  <span className='path1'></span>
                                  <span className='path2'></span>
                                  <span className='path3'></span>
                                </i>
                              </div>
                              <h4 className='text-gray-700 fw-bold cursor-pointer mb-0'>
                                {faq.question}
                              </h4>
                              <div>
                                <button
                                  type='button'
                                  onClick={() => setFAQ(faq)}
                                  className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary mb-2'
                                  data-kt-menu-trigger='click'
                                  data-kt-menu-placement='bottom-end'
                                  data-kt-menu-flip='top-end'
                                  title='Delete'
                                  style={{
                                    position: 'absolute',
                                    right: '50px',
                                    top: '10px',
                                  }}
                                >
                                  <KTIcon iconName='pencil' className='fs-2' />
                                </button>
                                <button
                                  type='button'
                                  onClick={() => handleDelete(faq)}
                                  className='btn btn-sm btn-icon btn-color-danger btn-active-light-danger mb-2'
                                  data-kt-menu-trigger='click'
                                  data-kt-menu-placement='bottom-end'
                                  data-kt-menu-flip='top-end'
                                  title='Delete'
                                  style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '10px',
                                  }}
                                >
                                  <KTIcon iconName='trash' className='fs-2' />
                                </button>
                              </div>
                            </div>{' '}
                            <div
                              key={faq._id + 'answer'}
                              id={`faq_${faq._id}`}
                              className='fs-6 ms-1 collapse'
                            >
                              <div className='mb-4 text-gray-600 fw-semibold fs-6 ps-10'>
                                {faq.answer}
                              </div>
                            </div>
                            <div className='separator separator-dashed'></div>
                          </div>
                        ))} */}

      {currentUser?.roles.some((role) => role.name === 'superadmin') && category && (
        <CreateFaqCategory
          category={category}
          setCategory={setCategory}
          refresh={getFaqCategories}
        />
      )}
      {currentUser?.roles.some((role) => role.name === 'superadmin') && FAQ && (
        <CreateFaq faq={FAQ} faqCategories={faqCategories} setFAQ={setFAQ} refresh={getFaq} />
      )}
    </>
  )
}

export default HelpCenterFAQ
