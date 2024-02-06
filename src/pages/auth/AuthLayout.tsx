/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect} from 'react'
import {Outlet, Link} from 'react-router-dom'
import {toAbsoluteUrl} from '../../_metronic/helpers'

const AuthLayout = () => {
  useEffect(() => {
    const root = document.getElementById('root')
    if (root) {
      root.style.height = '100%'
    }
    return () => {
      if (root) {
        root.style.height = 'auto'
      }
    }
  }, [])

  return (
    <div
      className='d-flex flex-column flex-lg-row flex-column-fluid'
      style={{height: 'max-content'}}
    >
      {/* begin::Body */}
      <div className='d-flex flex-column flex-lg-row-fluid w-md-80  w-lg-50 p-10 order-2 order-lg-1'>
        {/* begin::Form */}
        <div className='d-flex flex-center flex-column flex-lg-row-fluid'>
          {/* begin::Wrapper */}
          <div className='w-lg-500px w-100 w-md-50 p-10'>
            <Outlet />
          </div>
          {/* end::Wrapper */}
        </div>
        {/* end::Form */}

        {/* begin::Footer */}
        <div className='d-flex flex-center flex-wrap px-5'>
          {/* begin::Links */}
          <div className='d-flex fw-semibold text-primary fs-base'>
            <a href='#' className='px-5' target='_blank'>
              Terms
            </a>
            <a href='#' className='px-5' target='_blank'>
              Contact Us
            </a>
          </div>
          {/* end::Links */}
        </div>
        {/* end::Footer */}
      </div>
      {/* end::Body */}

      {/* begin::Aside */}
      <div
        className='d-flex flex-lg-row-fluid w-lg-50  bgi-size-cover bgi-position-center order-1 order-lg-2'
        style={{
          backgroundColor: '#f2f2f2',
          height: '100%',
        }}
      >
        {/* begin::Content */}
        <div className='d-flex flex-column flex-center py-15 px-5 px-md-15 w-100'>
          {/* begin::Logo */}
          <Link to='/' className='mb-12'>
            {/* <img
              alt='Logo'
              src={toAbsoluteUrl('/media/logos/supervised_01.png')}
              className='h-75px'
            /> */}
          </Link>
          {/* end::Logo */}

          {/* begin::Title */}
          <h1 className='text-black fs-3qx fw-bolder text-center  mb-7'>Welcome to RentSphere</h1>
          <h4 className='fs-5 text-center mb-7 text-muted'>
            Bringing Rentals Together, Making Every Choice Count.
          </h4>
          {/* end::Title */}

          {/* begin::Text */}
          <div className='text-black fs-base text-center'>
            {/* Unlock the future of academic research with SuperVised™, the platform designed to
            revolutionize the way students and advisors collaborate. Experience real-time feedback,
            secure document management, and streamlined approval processes, all in one intuitive
            interface. Say goodbye to manual tracking and hello to a seamless research journey. Join
            us in the pursuit of knowledge, powered by technology." */}
          </div>
          {/* end::Text */}
        </div>
        {/* end::Content */}
      </div>
      {/* end::Aside */}
    </div>
  )
}

export {AuthLayout}
