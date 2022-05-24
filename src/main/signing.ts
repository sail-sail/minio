/*
 * MinIO Javascript Library for Amazon S3 Compatible Cloud Storage, (C) 2016 MinIO, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// import Crypto from 'crypto'
// import _ from 'lodash'
import { uriEscape, getScope, isString, isObject, isArray, isNumber,
  makeDateShort, makeDateLong } from './helpers.ts'
import * as errors from './errors.ts'
import {
  hmac,
  Buffer,
  createHash,
} from "../../deps.ts";

const signV4Algorithm = 'AWS4-HMAC-SHA256'

// getCanonicalRequest generate a canonical request of style.
//
// canonicalRequest =
//  <HTTPMethod>\n
//  <CanonicalURI>\n
//  <CanonicalQueryString>\n
//  <CanonicalHeaders>\n
//  <SignedHeaders>\n
//  <HashedPayload>
//
// deno-lint-ignore no-explicit-any
function getCanonicalRequest(method: string, path: string, headers: { [x: string]: any; }, signedHeaders: any[], hashedPayload: string) {
  if (!isString(method)) {
    throw new TypeError('method should be of type "string"')
  }
  if (!isString(path)) {
    throw new TypeError('path should be of type "string"')
  }
  if (!isObject(headers)) {
    throw new TypeError('headers should be of type "object"')
  }
  if (!isArray(signedHeaders)) {
    throw new TypeError('signedHeaders should be of type "array"')
  }
  if (!isString(hashedPayload)) {
    throw new TypeError('hashedPayload should be of type "string"')
  }
  const headersArray = signedHeaders.reduce((acc, i) => {
    // Trim spaces from the value (required by V4 spec)
    const val = `${headers[i]}`.replace(/ +/g, " ")
    acc.push(`${i.toLowerCase()}:${val}`)
    return acc
  }, [])

  const requestResource = path.split('?')[0]
  let requestQuery = path.split('?')[1]
  if (!requestQuery) requestQuery = ''

  if (requestQuery) {
    requestQuery = requestQuery
      .split('&')
      .sort()
      .map(element => element.indexOf('=') === -1 ? element + '=' : element)
      .join('&')
  }

  const canonical = []
  canonical.push(method.toUpperCase())
  canonical.push(requestResource)
  canonical.push(requestQuery)
  canonical.push(headersArray.join('\n') + '\n')
  canonical.push(signedHeaders.join(';').toLowerCase())
  canonical.push(hashedPayload)
  return canonical.join('\n')
}

// generate a credential string
// deno-lint-ignore no-explicit-any
function getCredential(accessKey: string, region: string, requestDate: any,serviceName="s3") {
  if (!isString(accessKey)) {
    throw new TypeError('accessKey should be of type "string"')
  }
  if (!isString(region)) {
    throw new TypeError('region should be of type "string"')
  }
  if (!isObject(requestDate)) {
    throw new TypeError('requestDate should be of type "object"')
  }
  return `${accessKey}/${getScope(region, requestDate,serviceName)}`
}

// Returns signed headers array - alphabetically sorted
// deno-lint-ignore no-explicit-any
function getSignedHeaders(headers: { [x: string]: any; }) {
  if (!isObject(headers)) {
    throw new TypeError('request should be of type "object"')
  }
  // Excerpts from @lsegal - https://github.com/aws/aws-sdk-js/issues/659#issuecomment-120477258
  //
  //  User-Agent:
  //
  //      This is ignored from signing because signing this causes problems with generating pre-signed URLs
  //      (that are executed by other agents) or when customers pass requests through proxies, which may
  //      modify the user-agent.
  //
  //  Content-Length:
  //
  //      This is ignored from signing because generating a pre-signed URL should not provide a content-length
  //      constraint, specifically when vending a S3 pre-signed PUT URL. The corollary to this is that when
  //      sending regular requests (non-pre-signed), the signature contains a checksum of the body, which
  //      implicitly validates the payload length (since changing the number of bytes would change the checksum)
  //      and therefore this header is not valuable in the signature.
  //
  //  Content-Type:
  //
  //      Signing this header causes quite a number of problems in browser environments, where browsers
  //      like to modify and normalize the content-type header in different ways. There is more information
  //      on this in https://github.com/aws/aws-sdk-js/issues/244. Avoiding this field simplifies logic
  //      and reduces the possibility of future bugs
  //
  //  Authorization:
  //
  //      Is skipped for obvious reasons

  const ignoredHeaders = ['authorization', 'content-length', 'content-type', 'user-agent']
  const signedHeaders = Object.keys(headers).filter(header => !ignoredHeaders.includes(header.toLowerCase())).sort();
  return signedHeaders;
}

// returns the key used for calculating signature
function getSigningKey(date: Date, region: string|Uint8Array|undefined, secretKey: string,serviceName="s3") {
  if (!isObject(date)) {
    throw new TypeError('date should be of type "object"')
  }
  if (!isString(region)) {
    throw new TypeError('region should be of type "string"')
  }
  if (!isString(secretKey)) {
    throw new TypeError('secretKey should be of type "string"')
  }
  const dateLine = makeDateShort(date);
  const hmac1 = hmac("sha256", 'AWS4' + secretKey, dateLine, "utf8");
  const hmac2 = hmac("sha256", hmac1, region, "utf8");
  const hmac3 = hmac("sha256", hmac2, serviceName, "utf8");
  return Buffer.from(hmac("sha256", hmac3, 'aws4_request', "utf8"));
  // let hmac1 = Crypto.createHmac('sha256', 'AWS4' + secretKey).update(dateLine).digest(),
  //   hmac2 = Crypto.createHmac('sha256', hmac1).update(region).digest(),
  //   hmac3 = Crypto.createHmac('sha256', hmac2).update(serviceName).digest()
  // return Crypto.createHmac('sha256', hmac3).update('aws4_request').digest()
}

// returns the string that needs to be signed
// deno-lint-ignore no-explicit-any
function getStringToSign(canonicalRequest: string, requestDate: any, region: string,serviceName="s3") {
  if (!isString(canonicalRequest)) {
    throw new TypeError('canonicalRequest should be of type "string"')
  }
  if (!isObject(requestDate)) {
    throw new TypeError('requestDate should be of type "object"')
  }
  if (!isString(region)) {
    throw new TypeError('region should be of type "string"')
  }
  const hash = createHash('sha256').update(canonicalRequest).digest('hex')
  const scope = getScope(region, requestDate, serviceName)
  const stringToSign = []
  stringToSign.push(signV4Algorithm)
  stringToSign.push(makeDateLong(requestDate))
  stringToSign.push(scope)
  stringToSign.push(hash)
  const signString = stringToSign.join('\n')
  return signString
}

// calculate the signature of the POST policy
// deno-lint-ignore no-explicit-any
export function postPresignSignatureV4(region: string, date: any, secretKey: string, policyBase64: string) {
  if (!isString(region)) {
    throw new TypeError('region should be of type "string"')
  }
  if (!isObject(date)) {
    throw new TypeError('date should be of type "object"')
  }
  if (!isString(secretKey)) {
    throw new TypeError('secretKey should be of type "string"')
  }
  if (!isString(policyBase64)) {
    throw new TypeError('policyBase64 should be of type "string"')
  }
  const signingKey = getSigningKey(date, region, secretKey)
  return (hmac("sha256", signingKey, policyBase64, "utf8", "hex") as string).toLowerCase();
  // return Crypto.createHmac('sha256', signingKey).update(policyBase64).digest('hex').toLowerCase()
}

// Returns the authorization header
// deno-lint-ignore no-explicit-any
export function signV4(request: any, accessKey: string, secretKey: string, region: string, requestDate: any, serviceName="s3") {
  if (!isObject(request)) {
    throw new TypeError('request should be of type "object"')
  }
  if (!isString(accessKey)) {
    throw new TypeError('accessKey should be of type "string"')
  }
  if (!isString(secretKey)) {
    throw new TypeError('secretKey should be of type "string"')
  }
  if (!isString(region)) {
    throw new TypeError('region should be of type "string"')
  }

  if (!accessKey) {
    throw new errors.AccessKeyRequiredError('accessKey is required for signing')
  }
  if (!secretKey) {
    throw new errors.SecretKeyRequiredError('secretKey is required for signing')
  }

  const sha256sum = request.headers['x-amz-content-sha256']

  const signedHeaders = getSignedHeaders(request.headers)
  const canonicalRequest = getCanonicalRequest(request.method, request.path, request.headers,
                                               signedHeaders, sha256sum)
  const serviceIdentifier = serviceName || "s3"
  const stringToSign = getStringToSign(canonicalRequest, requestDate, region,serviceIdentifier)
  const signingKey = getSigningKey(requestDate, region, secretKey,serviceIdentifier)
  const credential = getCredential(accessKey, region, requestDate, serviceIdentifier)
  
  const signature = (hmac("sha256", signingKey, stringToSign, "utf8", "hex") as string).toLowerCase()
  // const signature = Crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex').toLowerCase()
  const val = `${signV4Algorithm} Credential=${credential}, SignedHeaders=${signedHeaders.join(';').toLowerCase()}, Signature=${signature}`;
  // console.log(request, accessKey, secretKey, region, requestDate, serviceName);
  // console.log(val);
  return val;
}

// deno-lint-ignore no-explicit-any
export function signV4ByServiceName( request: any, accessKey: string, secretKey: string, region: string, requestDate: Date, serviceName="s3") {
  return signV4(request, accessKey, secretKey, region,requestDate, serviceName)
}
// returns a presigned URL string
// deno-lint-ignore no-explicit-any
export function presignSignatureV4(request: any, accessKey: string, secretKey: string, sessionToken: string, region: string, requestDate: Date, expires: number) {
  if (!isObject(request)) {
    throw new TypeError('request should be of type "object"')
  }
  if (!isString(accessKey)) {
    throw new TypeError('accessKey should be of type "string"')
  }
  if (!isString(secretKey)) {
    throw new TypeError('secretKey should be of type "string"')
  }
  if (!isString(region)) {
    throw new TypeError('region should be of type "string"')
  }

  if (!accessKey) {
    throw new errors.AccessKeyRequiredError('accessKey is required for presigning')
  }
  if (!secretKey) {
    throw new errors.SecretKeyRequiredError('secretKey is required for presigning')
  }

  if (!isNumber(expires)) {
    throw new TypeError('expires should be of type "number"')
  }
  if (expires < 1) {
    throw new errors.ExpiresParamError('expires param cannot be less than 1 seconds')
  }
  if (expires > 604800) {
    throw new errors.ExpiresParamError('expires param cannot be greater than 7 days')
  }

  const iso8601Date = makeDateLong(requestDate)
  const signedHeaders = getSignedHeaders(request.headers)
  const credential = getCredential(accessKey, region, requestDate)
  const hashedPayload = 'UNSIGNED-PAYLOAD'

  const requestQuery = []
  requestQuery.push(`X-Amz-Algorithm=${signV4Algorithm}`)
  requestQuery.push(`X-Amz-Credential=${uriEscape(credential)}`)
  requestQuery.push(`X-Amz-Date=${iso8601Date}`)
  requestQuery.push(`X-Amz-Expires=${expires}`)
  requestQuery.push(`X-Amz-SignedHeaders=${uriEscape(signedHeaders.join(';').toLowerCase())}`)
  if (sessionToken) {
    requestQuery.push(`X-Amz-Security-Token=${uriEscape(sessionToken)}`)
  }

  const resource = request.path.split('?')[0]
  let query = request.path.split('?')[1]
  if (query) {
    query = query + '&' + requestQuery.join('&')
  } else {
    query = requestQuery.join('&')
  }

  const path = resource + '?' + query

  const canonicalRequest = getCanonicalRequest(request.method, path,
                                               request.headers, signedHeaders, hashedPayload)

  const stringToSign = getStringToSign(canonicalRequest, requestDate, region)
  const signingKey = getSigningKey(requestDate, region, secretKey)
  const signature = (hmac("sha256", signingKey, stringToSign, "utf8", "hex") as string).toLowerCase()
  // const signature = Crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex').toLowerCase()
  const presignedUrl = request.protocol + '//' + request.headers.host + path + `&X-Amz-Signature=${signature}`
  return presignedUrl
}
