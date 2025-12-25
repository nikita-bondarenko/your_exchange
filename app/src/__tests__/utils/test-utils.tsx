import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore, PreloadedState } from '@reduxjs/toolkit'
import { RootState } from '@/shared/model/store'
import { uiReducer } from '@/shared/model/store/reducers/uiReducer'
import { pageDataReducer } from '@/shared/model/store/reducers/pageDataReducer'
import { featuresFlagsReducer } from '@/shared/model/store/reducers/featuresFlagsReducer'
import { userReducer } from '@/d__features/userDataDisplay/model/store/reducer/userReducer'
import { exchangeReducer } from '@/d__features/exchange/model/store/reducer/exchangeReducer'
import { transferAbroadReducer } from '@/d__features/transferAbroad/model/store/reducer/transferAbroadReducer'
import { requestDetailsReducer } from '@/shared/model/store/reducers/requestDetailsReducer'
import { userApiLoadingReducer } from '@/d__features/userDataDisplay/model/store/reducer/userApiLoadingReducer'
import { exchangeApiLoadingReducer } from '@/d__features/exchange/model/store/reducer/exchangeApiLoadingReducer'
import { transferAbroadApiLoadingReducer } from '@/d__features/transferAbroad/model/store/reducer/transferAbroadApiLoadingReducer'
import { supportApiLoadingReducer } from '@/d__features/support/model/store/store'
import { TEST_PROJECT_DATA } from '@/shared/config/project/testData'

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: PreloadedState<RootState>
  store?: ReturnType<typeof makeStore>
}

function makeStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: {
      ui: uiReducer,
      user: userReducer,
      requestDetails: requestDetailsReducer,
      exchange: exchangeReducer,
      pageData: pageDataReducer,
      featuresFlags: featuresFlagsReducer,
      transferAbroad: transferAbroadReducer,
      userApiLoading: userApiLoadingReducer,
      transferAbroadApiLoading: transferAbroadApiLoadingReducer,
      supportApiLoading: supportApiLoadingReducer,
      exchangeApiLoading: exchangeApiLoadingReducer,
    },
    preloadedState: preloadedState || {
      pageData: TEST_PROJECT_DATA.page,
      ui: {
        projectName: 'test',
        pageName: '',
        isLoading: false,
        exchangeId: null,
        isAppReady: true,
        isFirstPageLoading: false,
        hasRateNoteOpenedOnce: false,
      },
      user: {
        id: null,
        sessionId: null,
        mailRequired: false,
        agreementAccepted: true,
        initData: null,
        data: null,
      },
      featuresFlags: {
        isExchangeMode: true,
        isTransferAbroadMode: false,
      },
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }),
  })
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    store = makeStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

export * from '@testing-library/react'
export { renderWithProviders as render }

