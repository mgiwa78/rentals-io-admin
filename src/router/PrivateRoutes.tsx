import {FC, Suspense} from 'react'
import {Route, Routes, Navigate, useLocation} from 'react-router-dom'
import {MasterLayout} from '../_metronic/layout/MasterLayout'

import {MenuTestPage} from '../pages/MenuTestPage'
import {getCSSVariableValue} from '../_metronic/assets/ts/_utils'
import {WithChildren} from '../_metronic/helpers'
import BuilderPageWrapper from '../pages/layout-builder/BuilderPageWrapper'
import Users from '../pages/users/users'
import Roles from '../pages/users/roles'
import AccountOverview from '../pages/account/overview'
import EditAccount from '../pages/account/edit'
import {AdminDashboard} from '../pages/dashboard/AdminDashboard'
import Permissions from '../pages/users/permissions'
import HelpCenter from '../pages/help-center'
import {AllRentals} from '../pages/rentals/all'
import {AllCategories} from '../pages/rentals/allCategories'
import {ApproveRentals} from '../pages/rentals/approve'
import {CreateRentals} from '../pages/rentals/create'
import {FinanceReport} from '../pages/finance/report'
import {FinanceOverview} from '../pages/finance/overview'
import {Setting} from '../pages/settings/settings'
import {CreateCategories} from '../pages/rentals/createCategories'

const PrivateRoutes = () => {
  const location = useLocation()

  const printRoute = () => {
    console.log(location)
  }
  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        {/* Pages */}
        <Route path='dashboard' element={<AdminDashboard />} />
        <Route path='builder' element={<BuilderPageWrapper />} />
        <Route path='menu-test' element={<MenuTestPage />} />

        {/*  */}
        {/*  */}
        {/* Asset based routes */}
        {/* Asset based routes */}
        {/*  */}
        {/*  */}

        <Route path='/users'>
          <Route index element={<Navigate to='/users/all' />} />
          <Route path='all' element={<Users />} />
          <Route path='vendors' element={<Users role='vendor' />} />
          <Route path='customers' element={<Users role='customer' />} />
          <Route path='roles' element={<Roles />} />
          <Route path='permissions' element={<Permissions />} />
        </Route>

        <Route path='/rentals'>
          <Route index element={<Navigate to='all' />} />
          <Route path='all' element={<AllRentals />} />
          <Route path='categories/create' element={<CreateCategories />} />
          <Route path='categories/all' element={<AllCategories />} />
          <Route path='approve' element={<ApproveRentals />} />
          <Route path='create' element={<CreateRentals />} />
        </Route>

        <Route path='/account'>
          <Route path='overview' element={<AccountOverview />} />
          <Route path='edit' element={<EditAccount />} />
        </Route>

        <Route path='/finance'>
          <Route path='overview' element={<FinanceReport />} />
          <Route path='report' element={<FinanceOverview />} />
        </Route>
        <Route path='settings' element={<Setting />} />
        <Route
          path='*'
          element={
            <>
              {printRoute()}
              <Navigate to='/error/404' />
            </>
          }
        />

        <Route path='help-center' element={<HelpCenter />} />
      </Route>
    </Routes>
  )
}

// const SuspensedView: FC<WithChildren> = ({children}) => {
//   const baseColor = getCSSVariableValue('--bs-primary')
//   TopBarProgress.config({
//     barColors: {
//       '0': baseColor,
//     },
//     barThickness: 1,
//     shadowBlur: 5,
//   })
//   return <Suspense fallback={<TopBarProgrees />}>{children}</Suspense>
// }

export {PrivateRoutes}
