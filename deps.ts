export { Buffer } from "https://deno.land/std@0.140.0/node/buffer.ts";
export {
  Socket,
  connect,
  Stream,
} from "https://deno.land/std@0.140.0/node/net.ts";
export { EventEmitter } from "https://deno.land/std@0.140.0/node/events.ts";
export { Readable, Stream as StreamStream, Transform } from "https://deno.land/std@0.140.0/node/stream.ts";
import Https from "https://deno.land/std@0.140.0/node/https.ts";
export {
  inherits,
} from "https://deno.land/std@0.140.0/node/util.ts";
import Http from "https://deno.land/std@0.140.0/node/http.ts";
import url from "https://deno.land/std@0.140.0/node/url.ts";
import { crypto } from "https://deno.land/std@0.140.0/crypto/mod.ts";
import { ExtMapping as mimeExtMapping } from "https://deno.land/x/common_mime_types@0.1.1/mod.ts";

import { hmac } from "https://deno.land/x/hmac@v2.0.1/mod.ts";
import { createHash } from "https://deno.land/std@0.140.0/node/crypto.ts";

export { BlockStream2 } from "https://deno.land/x/block_stream2@v1.0.0/mod.ts";
export * as querystring from "https://deno.land/std@0.140.0/node/querystring.ts";
export { promisify } from "https://deno.land/std@0.140.0/node/util.ts";

export { make as through2 } from "https://deno.land/x/through2@v1.0.0/mod.ts";

import buffer_crc32 from "https://deno.land/x/buffer_crc32@v1.0.0/mod.ts";

export {
  Http,
  Https,
  url,
  crypto,
  createHash,
  hmac,
  mimeExtMapping,
  buffer_crc32,
};
