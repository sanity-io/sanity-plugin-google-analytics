import React, {createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState} from 'react'


import { loadGoogleAPI, authGoogleAPI, GoogleAPIContainer } from '../utils/googleAPI'

const hiddenStyles = {
  opacity: 0,
  height: 0,
  overflow: 'hidden',
}

interface GoogleAnalyticsReportData {
  data: any
  isLoaded: boolean
}

export interface GoogleAnalyticsClientConfig {
  clientId: string
  propertyId: string
  query: any
}

const GoogleAnalyticsReportContext = createContext<GoogleAnalyticsReportData>({
  data: undefined,
  isLoaded: false,
})

export function useGoogleAnalyticsReportData() {
  const value = useContext(GoogleAnalyticsReportContext)
  if (!value) {
    throw new Error(
      'useGoogleAnalyticsReportData must be used from within GoogleAnalyticsReportProvider'
    )
  }
  return value
}

export function GoogleAnalyticsReportProvider({
  clientId,
  propertyId,
  query,
  children,
}: GoogleAnalyticsClientConfig & {children?: ReactNode | ReactNode[]}) {
  const [gapiClient, setGapiClient] = useState<GoogleAPIContainer | undefined>()
  const [googleAccounts, setGoogleAccounts] = useState<GoogleAPIContainer | undefined>()
  const [ready, setReady] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [data, setData] = useState<any>(undefined)
  const [isLoaded, setIsLoaded] = useState(false)

  const authButtonNode = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadGoogleAPI()
      .then(([google, gapi]) => {
        setGoogleAccounts(google.accounts)
        setGapiClient(gapi.client)
      })
  }, [])

  const loginHandler = useCallback(() => {
    if (!googleAccounts || !gapiClient || !clientId) {
      return
    }

    authGoogleAPI(googleAccounts, gapiClient, clientId)
      .then(() => {
        setReady(true)
        setLoggedIn(true)
      })
  },[googleAccounts, gapiClient, clientId])

  useEffect(() => {
    if (!gapiClient || !ready || !query) {
      return
    }

    gapiClient.analyticsdata.properties
      .runReport({property: `properties/${propertyId}`, resource: query})
      .then((response: any) => {
        setData(response.result)
        setIsLoaded(true)
      })
      .catch((err: any) => {
        console.error(err)
      })
  }, [gapiClient, ready, query])

  return (
    <GoogleAnalyticsReportContext.Provider value={{data, isLoaded}}>
      <div className="sanity-plugin-google-analytics--provider">
        {clientId && (<div style={loggedIn ? hiddenStyles : {}} onClick={loginHandler}>Authorize with Google</div>)}
        {ready && children}
      </div>
    </GoogleAnalyticsReportContext.Provider>
  )
}
