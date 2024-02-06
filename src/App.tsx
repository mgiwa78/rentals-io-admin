import {Suspense} from 'react'
import {Outlet} from 'react-router-dom'
import {I18nProvider} from './_metronic/i18n/i18nProvider'
import {LayoutProvider, LayoutSplashScreen} from './_metronic/layout/core'
import {MasterInit} from './_metronic/layout/MasterInit'
import {ThemeModeProvider} from './_metronic/partials'
import {Provider} from 'react-redux'
import store, {persistor} from './redux/store'
import {PersistGate} from 'redux-persist/integration/react'
import {AuthInit} from './pages/auth'
const App = () => {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <I18nProvider>
        <LayoutProvider>
          <ThemeModeProvider>
            <AuthInit>
              <Outlet />
              <MasterInit />
            </AuthInit>
          </ThemeModeProvider>
        </LayoutProvider>
      </I18nProvider>
    </Suspense>
  )
}

export {App}
