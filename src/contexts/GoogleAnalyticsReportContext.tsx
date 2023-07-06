import React, {createContext, ReactNode, useContext, useEffect, useRef, useState} from 'react'

import {
  authGoogleAnalytics,
  GoogleAPIContainer,
  initGoogleAPI,
  loadGoogleAnalytics,
} from '../utils/googleAPI'

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
  query,
  children,
}: GoogleAnalyticsClientConfig & {children?: ReactNode | ReactNode[]}) {
  const [gapi, setGapi] = useState<GoogleAPIContainer | undefined>()
  const [ready, setReady] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [data, setData] = useState<any>(undefined)
  const [isLoaded, setIsLoaded] = useState(false)

  const authButtonNode = useRef<HTMLDivElement>(null)

  useEffect(() => {
    initGoogleAPI()
      .then(loadGoogleAnalytics)
      .then((newGapi) => setGapi(newGapi))
  }, [])

  useEffect(() => {
    if (!gapi || loggedIn) {
      return
    }

    authGoogleAnalytics(gapi, clientId, authButtonNode).then(() => {
      setLoggedIn(true)
      setReady(true)
    })
  }, [gapi, clientId, loggedIn, ready])

  useEffect(() => {
    if (!gapi || !ready || isLoaded) {
      return
    }

    const report = new gapi.analytics.report.Data({query})
    report.on('succes', (res: any) => {
      if (isLoaded) {
        return
      }

      setData(res.dataTable)
      setIsLoaded(true)
    })
    report.execute()
  }, [gapi, ready, isLoaded, query])

  return (
    <GoogleAnalyticsReportContext.Provider value={{data, isLoaded}}>
      <div className="sanity-plugin-google-analytics--provider">
        {clientId && <div style={loggedIn ? hiddenStyles : {}} ref={authButtonNode} />}
        {ready && children}
      </div>
    </GoogleAnalyticsReportContext.Provider>
  )
}
