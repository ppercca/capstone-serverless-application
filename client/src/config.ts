// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '8ooz0pxa4g'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: 'dev-cristianpj.us.auth0.com',            // Auth0 domain
  clientId: 'fIRvEasAiaEPLXtvNrqfy0Y3QnLEcBPz',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
