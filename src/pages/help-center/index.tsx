import React, {useState} from 'react'
import {PageLink, PageTitle} from '../../_metronic/layout/core'
import HelpCenterOverview from './overveiw'
import HelpCenterFAQ from './faq/all'
import HelpCenterTickets from './tickets'
import CreateTicket from './tickets/createTicket'
import {RootState} from '../../redux/store'
import {useSelector} from 'react-redux'
import TFaq from '../../types/faq'
import Ticket from './tickets/ticket'
import TTicket from '../../types/ticket'
import CreateTicketCategory from './tickets/createTicketCategory'

const HelpCenter = () => {
  const [FAQ, setFAQ] = useState<'new' | 'close' | TFaq>(null)
  const [TICKET, setTICKET] = useState<null | TTicket>(null)

  const handleViewTicket = (ticket: TTicket) => {
    setPage('ticket')
    setTICKET(ticket)
  }

  const currentUser = useSelector((state: RootState) => state.auth.user)
  const [page, setPage] = useState<'overview' | 'faq' | 'tickets' | 'ticket'>('overview')
  const faqBreadcrumbs: Array<PageLink> = [
    {
      title: 'Home',
      path: '/',
      isSeparator: false,
      isActive: false,
    },
    {
      title: '',
      path: '/',
      isSeparator: true,
      isActive: false,
    },
  ]
  const [createTicket, setCreateTicket] = useState<'new' | 'close' | TFaq>(null)
  const [createCatTicket, setCreateTicketCategory] = useState<'new' | 'close' | TFaq>(null)

  // const handleUpdate = (type: 'ticket' | 'faq', state: 'new' | 'close' | TFaq | TTicket) => {
  //   if (type === 'ticket') {
  //     setCreateTicket(state)
  //   }
  //   if (type === 'faq') {
  //     setCreateTicket(state)
  //   }
  // }
  return (
    <>
      <PageTitle breadcrumbs={faqBreadcrumbs}>Help Center</PageTitle>
      <div className='card mb-12'>
        <div className='card-body flex-column p-5'>
          <div className='card-rounded bg-light d-flex flex-stack flex-wrap p-5'>
            <ul className='nav flex-wrap border-transparent fw-bold'>
              <li className='nav-item my-1'>
                <button
                  type='button'
                  onClick={() => setPage('overview')}
                  className={`btn btn-color-gray-600 btn-active-secondary btn-active-color-primary fw-bolder fs-8 fs-lg-base nav-link px-3 px-lg-8 mx-1 text-uppercase ${
                    page === 'overview' && 'active'
                  }`}
                >
                  Overview
                </button>
              </li>
              <li className='nav-item my-1'>
                <button
                  type='button'
                  onClick={() => setPage('tickets')}
                  className={`btn btn-color-gray-600 btn-active-secondary btn-active-color-primary fw-bolder fs-8 fs-lg-base nav-link px-3 px-lg-8 mx-1 text-uppercase  ${
                    page === 'tickets' && 'active'
                  }`}
                >
                  tickets
                </button>
              </li>
              <li className='nav-item my-1'>
                <button
                  type='button'
                  onClick={() => setPage('faq')}
                  className={`btn btn-color-gray-600 btn-active-secondary btn-active-color-primary fw-bolder fs-8 fs-lg-base nav-link px-3 px-lg-8 mx-1 text-uppercase  ${
                    page === 'faq' && 'active'
                  }`}
                >
                  FAQ
                </button>
              </li>
              {/* <li className='nav-item my-1'>
                <button
                  type='button'
                  onClick={() => setPage('ticket')}
                  className={`btn btn-color-gray-600 btn-active-secondary btn-active-color-primary fw-bolder fs-8 fs-lg-base nav-link px-3 px-lg-8 mx-1 text-uppercase  ${
                    page === 'ticket' && 'active'
                  }`}
                >
                  Ticket
                </button>
              </li> */}
            </ul>
            <div className='d-flex gap-3'>
              {page === 'tickets' && (
                <>
                  <button
                    className='btn btn-primary fw-bold fs-8 fs-lg-base'
                    onClick={() => setCreateTicket('new')}
                  >
                    Create Ticket
                  </button>

                  {currentUser?.roles.some((role) => role.name === 'superadmin') && (
                    <button
                      className='btn btn-primary fw-bold fs-8 fs-lg-base'
                      onClick={() => setCreateTicketCategory('new')}
                    >
                      Create Category
                    </button>
                  )}
                </>
              )}
              {currentUser?.roles.some((role) => role.name === 'superadmin') && page === 'faq' && (
                <button
                  type='button'
                  onClick={() => setFAQ('new')}
                  className='btn btn-primary mr-5 fw-bold fs-8 fs-lg-base'
                >
                  <i className='ki-duotone ki-badge fs-2  mx-2'>
                    <span className='path1'></span>
                    <span className='path2'></span>
                    <span className='path3'></span>
                    <span className='path4'></span>
                    <span className='path5'></span>
                  </i>
                  <span className='indicator-label'>Create FAQ</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {page === 'overview' && <HelpCenterOverview setPage={setPage} />}
      {page === 'faq' && <HelpCenterFAQ FAQ={FAQ} setFAQ={setFAQ} />}
      {page === 'tickets' && <HelpCenterTickets handleViewTicket={handleViewTicket} />}
      {page === 'ticket' && <Ticket ticket={TICKET} />}
      {createTicket && <CreateTicket ticket={createTicket} setCreateTicket={setCreateTicket} />}
      {createCatTicket && (
        <CreateTicketCategory
          ticketCategory={createCatTicket}
          setCreateTicketCategory={setCreateTicketCategory}
        />
      )}
    </>
  )
}

export default HelpCenter
