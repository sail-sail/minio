// deno-lint-ignore-file no-explicit-any
import Credentials from "./Credentials.ts"

class CredentialProvider {
  
  credentials: Credentials|null;
  
  constructor({
    accessKey,
    secretKey,
    sessionToken
  }: {
    accessKey: string;
    secretKey: string;
    sessionToken: string;
  }) {
    this.credentials = new Credentials({
      accessKey,
      secretKey,
      sessionToken
    })
  }

  getCredentials(): any {
    return this.credentials?.get()
  }

  setCredentials(credentials: Credentials) {
    if (credentials instanceof Credentials) {
      this.credentials = credentials
    } else {
      throw new Error("Unable to set Credentials . it should be an instance of Credentials class")
    }
  }


  setAccessKey(accessKey: string) {
    this.credentials?.setAccessKey(accessKey)
  }

  getAccessKey() {
    return this.credentials?.getAccessKey()
  }

  setSecretKey(secretKey: string) {
    this.credentials?.setSecretKey(secretKey)
  }

  getSecretKey() {
    return this.credentials?.getSecretKey()
  }

  setSessionToken(sessionToken: string) {
    this.credentials?.setSessionToken(sessionToken)
  }

  getSessionToken() {
    return this.credentials?.getSessionToken()
  }


}

export default CredentialProvider