import loadScript from 'load-script'

export type GoogleAPIContainer = Record<string, any>
declare global {
  interface Window {
    gapi: GoogleAPIContainer
    google: GoogleAPIContainer
  }
}

const SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]

export function loadGoogleAPI() {
  return Promise.all([
    new Promise<GoogleAPIContainer>((resolve, reject) => {
      if (window.google) {
        return resolve(window.google)
      }

      loadScript(`https://accounts.google.com/gsi/client`, (err: any) => err ? reject(err) : resolve(window.google))
    }),
    new Promise<GoogleAPIContainer>((resolve, reject) => {
      if (window.gapi) {
        resolve(window.gapi)
      }

      loadScript(`https://apis.google.com/js/api.js`, (err: any) => {
        if (err) {
          reject(err)
          return
        }

        window.gapi.load('client', () => {
          Promise.all([
            window.gapi.client.load(
              "https://analyticsreporting.googleapis.com/$discovery/rest?version=v4"
            ),
            window.gapi.client.load(
              "https://analyticsdata.googleapis.com/$discovery/rest"
            ),
          ]).then(() => resolve(window.gapi))
            .catch(err => reject(err))
        })
      })
    })
  ])
}

export function authGoogleAPI(googleAccounts: GoogleAPIContainer, gapiClient: GoogleAPIContainer, clientId: string) {
  return new Promise<any>((resolve, _) => {
    const client = googleAccounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: SCOPES.join(' '),
      prompt: '',
      callback: (response:any) => {
        gapiClient.setToken(response)
        resolve(response)
      }
    })
    client.requestAccessToken()
  })
}