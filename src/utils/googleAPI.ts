export type GoogleAPIContainer = Record<string, any>
declare global {
  interface Window {
    gapi: GoogleAPIContainer
  }
}

export function initGoogleAPI() {
  return new Promise<GoogleAPIContainer>((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('global window not found'))
      return
    }

    if (window.gapi) {
      resolve(window.gapi)
      return
    }

    window.gapi = {}

    const gapiScript = document.createElement('script')
    gapiScript.addEventListener('load', () => resolve(window.gapi))

    const firstJSScript = document.getElementsByTagName('script')[0]
    gapiScript.src = 'https://apis.google.com/js/platform.js'
    firstJSScript.parentNode!.insertBefore(gapiScript, firstJSScript)
  })
}

export function loadGoogleAnalytics(gapi: GoogleAPIContainer) {
  return new Promise<GoogleAPIContainer>((resolve, reject) => {
    if (!gapi) {
      reject(new Error('gapi not found'))
      return
    }

    gapi.analytics = {
      q: [],
      ready(cb: any) {
        this.q.push(cb)
      },
    }
    // load the analytics portion of the google API and resolve the promise when ready
    gapi.analytics.ready(() => resolve(gapi))
    gapi.load('analytics')
  })
}

export function authGoogleAnalytics(
  gapi: GoogleAPIContainer,
  clientId: string,
  authButtonNode: React.RefObject<HTMLDivElement>
) {
  return new Promise<GoogleAPIContainer>((resolve, reject) => {
    if (!gapi?.analytics) {
      reject(new Error('gapi not found or gapi.analytics not loaded'))
      return
    } else if (!clientId) {
      reject(new Error('clientId not found'))
      return
    } else if (!authButtonNode) {
      reject(new Error('authButtonNode not found'))
      return
    }

    const authResponse = gapi.analytics.auth.getAuthResponse()
    if (authResponse) {
      resolve(gapi)
      return
    }

    gapi.analytics.auth.on('success', () => resolve(gapi))
    gapi.analytics.auth.on('error', (result: any) => reject(result.error))
    gapi.analytics.auth.authorize({
      clientid: clientId,
      container: authButtonNode.current,
    })
  })
}

