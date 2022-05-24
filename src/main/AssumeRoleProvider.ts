// deno-lint-ignore-file no-explicit-any
// import Http from 'http'
// import Https from 'https'
import {
  makeDateLong,
  parseXml,
  toSha256,
} from "./helpers.ts";
import {signV4ByServiceName} from "./signing.ts"
import CredentialProvider from "./CredentialProvider.ts"
import Credentials from "./Credentials.ts"

import {
  Http,
  Https,
  url as nodeUrl,
  Buffer,
} from "../../deps.ts";

const {URLSearchParams, URL} = nodeUrl;

class AssumeRoleProvider extends CredentialProvider {
  
  stsEndpoint: any;
  accessKey: any;
  secretKey: any;
  durationSeconds: any;
  policy: any;
  sessionToken: any;
  action: any;
  webIdentityToken: any;
  token: any;
  externalId: any;
  roleSessionName: any;
  roleArn: any;
  region: any;
  expirySeconds: number|null;
  accessExpiresAt: null;
  
  constructor({
    stsEndpoint,
    accessKey,
    secretKey,
    durationSeconds = 900,
    sessionToken,
    policy,
    region = '',
    roleArn,
    roleSessionName,
    externalId,
    token,
    webIdentityToken,
    action = "AssumeRole"
  }: any) {
    super({} as any)

    this.stsEndpoint = stsEndpoint
    this.accessKey = accessKey
    this.secretKey = secretKey
    this.durationSeconds = durationSeconds
    this.policy = policy
    this.region = region
    this.roleArn = roleArn
    this.roleSessionName = roleSessionName
    this.externalId = externalId
    this.token = token
    this.webIdentityToken = webIdentityToken
    this.action = action
    this.sessionToken = sessionToken

    /**
         * Internal Tracking variables
         */
    this.credentials = null
    this.expirySeconds = null
    this.accessExpiresAt = null

  }


  getRequestConfig() {
    const url = new URL(this.stsEndpoint)
    const hostValue = url.hostname
    const portValue = url.port
    const isHttp = url.protocol.includes("http:")
    const qryParams = new URLSearchParams()
    qryParams.set("Action", this.action)
    qryParams.set("Version", "2011-06-15")

    const defaultExpiry = 900
    let expirySeconds = parseInt(this.durationSeconds)
    if (expirySeconds < defaultExpiry) {
      expirySeconds = defaultExpiry
    }
    this.expirySeconds = expirySeconds // for calculating refresh of credentials.

    qryParams.set("DurationSeconds", this.expirySeconds as any)

    if (this.policy) {
      qryParams.set("Policy", this.policy)
    }
    if (this.roleArn) {
      qryParams.set("RoleArn", this.roleArn)
    }

    if (this.roleSessionName != null) {
      qryParams.set("RoleSessionName", this.roleSessionName)
    }
    if (this.token != null) {
      qryParams.set("Token", this.token)
    }

    if (this.webIdentityToken) {
      qryParams.set("WebIdentityToken", this.webIdentityToken)
    }

    if (this.externalId) {
      qryParams.set("ExternalId", this.externalId)
    }


    const urlParams = qryParams.toString()
    const contentSha256 = toSha256(urlParams)

    const date = new Date()

    /**
         * Nodejs's Request Configuration.
         */
    const requestOptions: any = {
      hostname: hostValue,
      port: portValue,
      path: "/",
      protocol: url.protocol,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "content-length": urlParams.length,
        "host": hostValue,
        "x-amz-date": makeDateLong(date),
        'x-amz-content-sha256': contentSha256
      }
    }

    const authorization = signV4ByServiceName(requestOptions, this.accessKey, this.secretKey, this.region, date, "sts")
    requestOptions.headers.authorization = authorization

    return {
      requestOptions,
      requestData: urlParams,
      isHttp: isHttp
    }
  }

  async performRequest() {
    const reqObj = this.getRequestConfig()
    const requestOptions = reqObj.requestOptions
    const requestData = reqObj.requestData

    const isHttp = reqObj.isHttp
    const Transport = isHttp ? Http : Https

    const promise = await new Promise((resolve, reject) => {
      const requestObj = Transport.request(requestOptions, (resp: any) => {
        let resChunks: any = []
        resp.on('data', (rChunk: any) => {
          resChunks.push(rChunk)
        })
        resp.on('end', () => {
          let body = Buffer.concat(resChunks).toString()
          const xmlobj = parseXml(body)
          resolve(xmlobj)
        })
        resp.on('error', (err: any) => {
          reject(err)
        })
      })
      requestObj.on('error', (e) => {
        reject(e)
      })
      requestObj.write(requestData)
      requestObj.end()
    })
    return promise

  }

  parseCredentials(respObj: any={}) {
    if(respObj.ErrorResponse){
      throw new Error("Unable to obtain credentials:", respObj)
    }
    const {
      AssumeRoleResponse: {
        AssumeRoleResult: {
          Credentials: {
            AccessKeyId: accessKey = undefined,
            SecretAccessKey: secretKey = undefined,
            SessionToken: sessionToken = undefined,
            Expiration: expiresAt = undefined
          } = {}
        } = {}
      } = {}
    } = respObj as any;


    this.accessExpiresAt = expiresAt

    const newCreds = new Credentials({
      accessKey,
      secretKey,
      sessionToken
    })

    this.setCredentials(newCreds)
    return this.credentials

  }


  async refreshCredentials() {
    try {
      const assumeRoleCredentials = await this.performRequest()
      this.credentials = this.parseCredentials(assumeRoleCredentials)
    } catch (_err: any) {
      this.credentials = null
    }
    return this.credentials
  }

  async getCredentials() {
    let credConfig
    if (!this.credentials || (this.credentials && this.isAboutToExpire())) {
      credConfig = await this.refreshCredentials()
    } else {
      credConfig = this.credentials
    }
    return credConfig
  }

  isAboutToExpire() {
    const expiresAt = new Date(this.accessExpiresAt as any)
    const provisionalExpiry = new Date(Date.now() + 1000 * 10) // check before 10 seconds.
    const isAboutToExpire = provisionalExpiry > expiresAt
    return isAboutToExpire
  }
}

export default AssumeRoleProvider