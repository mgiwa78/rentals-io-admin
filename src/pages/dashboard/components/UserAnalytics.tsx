/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {KTIcon} from '../../../_metronic/helpers'
import {getCSSVariableValue} from '../../../_metronic/assets/ts/_utils'
import {Dropdown1} from '../../../_metronic/partials/content/dropdown/Dropdown1'
import {useThemeMode} from '../../../_metronic/partials/layout/theme-mode/ThemeModeProvider'
import Role from '../../../types/Role'

type Props = {
  className: string
  chartColor: string
  chartHeight: string
  data: Array<{
    role: Role
    countUsers: number
  }>
}
const UserAnalytics: React.FC<Props> = ({className, chartColor, chartHeight, data}) => {
  const {mode} = useThemeMode()
  console.log(data)
  return (
    <div className={`card ${className}`}>
      <div className='card-header border-0 py-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>User Analytics</span>
          <span className='text-muted fw-semibold fs-7'>Recent user analytics</span>
        </h3>
        {/* 
        <div className='card-toolbar'>
          <button
            type='button'
            className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='top-end'
          >
            <KTIcon iconName='category' className='fs-2' />
          </button>
          <Dropdown1 />
        </div> */}
      </div>

      <div className='card-body p-0 d-flex flex-column'>
        <div className='card-px pt-5 pb-10 flex-grow-1'>
          {data.length > 0 ? (
            <>
              <div className='row g-0 mt-5 mb-10'>
                {data[0] ? (
                  <div className='col'>
                    <div className='d-flex align-items-center me-2'>
                      <div className='symbol symbol-50px me-3'>
                        <div className='symbol-label bg-light-info'>
                          <KTIcon iconName='bucket' className='fs-1 text-info' />
                        </div>
                      </div>

                      <div>
                        <div className='fs-4 text-dark fw-bold'>{data[0].countUsers}</div>
                        <div className='fs-7 text-muted fw-semibold'>{data[0].role.name}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ''
                )}
                {data[1] ? (
                  <div className='col'>
                    <div className='d-flex align-items-center me-2'>
                      <div className='symbol symbol-50px me-3'>
                        <div className='symbol-label bg-light-danger'>
                          <KTIcon iconName='abstract-26' className='fs-1 text-danger' />
                        </div>
                      </div>

                      <div>
                        <div className='fs-4 text-dark fw-bold'>{data[1].countUsers}</div>
                        <div className='fs-7 text-muted fw-semibold'>{data[1].role.name}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ''
                )}
              </div>

              <div className='row g-0'>
                {data[2] ? (
                  <div className='col'>
                    <div className='d-flex align-items-center me-2'>
                      <div className='symbol symbol-50px me-3'>
                        <div className='symbol-label bg-light-success'>
                          <KTIcon iconName='basket' className='fs-1 text-success' />
                        </div>
                      </div>

                      <div>
                        <div className='fs-4 text-dark fw-bold'>{data[2].countUsers}</div>
                        <div className='fs-7 text-muted fw-semibold'>{data[2].role.name}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ''
                )}
              </div>
            </>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  )
}

export {UserAnalytics}
