import * as Yup from 'yup'
import post from '../../../lib/post'
import {useSelector} from 'react-redux'
import {selectToken} from '../../../redux/selectors/auth'
import {KTIcon} from '../../../_metronic/helpers'
import {useFormik} from 'formik'
import {useEffect, useState} from 'react'
import get from '../../../lib/get'
import TFaqCategories from '../../../types/faqCategories'
import put from '../../../lib/put'

type Props = {
  setFAQ: Function
  faqCategories: Array<TFaqCategories>
  refresh: Function
  faq: any
}

const initialValues = {
  category: '',
  answer: '',
  question: '',
}
const createFaqSchema = Yup.object().shape({
  question: Yup.string().required('Qestion is required'),
  answer: Yup.string().required('Answer is required'),
  category: Yup.string().required('Category is required'),
})

const CreateFaq = ({setFAQ, faqCategories, refresh, faq = null}: Props) => {
  const token = useSelector(selectToken)
  const [IsLoading, setIsLoading] = useState<boolean>(false)

  console.log(faq)
  const formik = useFormik({
    initialValues: faq._id
      ? {category: faq?.category, question: faq?.question, answer: faq?.answer}
      : initialValues,
    validationSchema: createFaqSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      setIsLoading(true)
      try {
        if (faq._id) {
          await put(`faqs/${faq._id}`, {...values}, token, true, 'FAQ Updated')
        } else {
          await post('faqs', {...values}, token, true, 'FAQ Created')
        }

        if (1) {
          formik.values = initialValues
          refresh()
        }
        setFAQ(false)

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
        className='modal fade show d-block'
        id='kt_modal_add_user'
        role='dialog'
        tabIndex={-1}
        aria-modal='true'
      >
        {/* begin::Modal dialog */}
        <div className='modal-dialog modal-dialog-centered mw-650px'>
          {/* begin::Modal content */}
          <div className='modal-content'>
            {/* end::Modal Backdrop */}
            <div className='modal-header pt-7' id='kt_chat_contacts_header'>
              <div className='modal-title'>
                <h2> {faq === 'new' && 'Create Faq'}</h2>
                <h2> {faq._id && 'Update Faq'}</h2>
              </div>
              <div
                className='btn btn-icon btn-sm btn-active-icon-primary'
                data-kt-users-modal-action='close'
                style={{cursor: 'pointer'}}
                onClick={() => setFAQ(false)}
              >
                <KTIcon iconName='cross' className='fs-1' />
              </div>
            </div>

            <div className='modal-body scroll-y mx-5 mx-xl-10 '>
              <div className='card-body'></div>
              <form
                className='form w-100 h-100'
                onSubmit={formik.handleSubmit}
                noValidate
                id='workflow_creation_form'
              >
                <div className='row mb-7 fv-plugins-icon-container'>
                  <div className='col-6'>
                    <label className='fs-6 fw-semibold form-label mt-3'>
                      <span className='required'>Question</span>
                      <span
                        className='ms-1'
                        data-bs-toggle='tooltip'
                        aria-label='FAQ question.'
                        data-bs-original-question='FAQ question.'
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
                      {...formik.getFieldProps('question')}
                      className='form-control form-control-solid'
                      placeholder='FAQ Question'
                    />
                    <div className='fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback'></div>
                  </div>
                  <div className='col-6'>
                    <label className='fs-6 fw-semibold form-label mt-3'>
                      <span className='required'>Category</span>
                      <span
                        className='ms-1'
                        data-bs-toggle='tooltip'
                        aria-label='Select category'
                        data-bs-original-title='Select the category'
                        data-kt-initialized='1'
                      >
                        <i className='ki-duotone ki-information fs-7'>
                          <span className='path1'></span>
                          <span className='path2'></span>
                          <span className='path3'></span>
                        </i>
                      </span>
                    </label>
                    <select
                      {...formik.getFieldProps('category')}
                      className='form-control form-control-solid'
                      name='category'
                      placeholder='FAQ Category'
                    >
                      <option value=''>Select Category</option>
                      {faqCategories &&
                        faqCategories?.map((cat: TFaqCategories) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.title}
                          </option>
                        ))}
                    </select>
                    <div className='fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback'></div>
                  </div>
                </div>
                <div className='row mb-7 fv-plugins-icon-container'>
                  <div className='col-12'>
                    <label className='fs-6 fw-semibold form-label mt-3'>
                      <span className='required'>Answer</span>
                      <span
                        className='ms-1'
                        data-bs-toggle='tooltip'
                        aria-label='FAQ Answer.'
                        data-bs-original-title='FAQ answer.'
                        data-kt-initialized='1'
                      >
                        <i className='ki-duotone ki-information fs-7'>
                          <span className='path1'></span>
                          <span className='path2'></span>
                          <span className='path3'></span>
                        </i>
                      </span>
                    </label>
                    <textarea
                      {...formik.getFieldProps('answer')}
                      className='form-control form-control-solid'
                      name='answer'
                      placeholder='FAQ answer'
                      cols={30}
                      rows={5}
                    ></textarea>
                    <div className='fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback'></div>
                  </div>
                </div>

                <div className='separator mb-6'></div>
                <div className='d-flex justify-content-end'>
                  <button
                    type='reset'
                    data-kt-contacts-type='cancel'
                    className='btn btn-light me-3'
                    onClick={() => setFAQ(false)}
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
                      <span className='indicator-label'>{faq._id ? 'Update' : 'Create'}</span>
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
          {/* end::Modal body */}
          {/* end::Modal content */}
        </div>
        {/* end::Modal dialog */}
      </div>
      {/* begin::Modal Backdrop */}

      <div className='modal-backdrop fade show'></div>
    </>
  )
}

export default CreateFaq
