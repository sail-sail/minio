import * as MinIO from "./mod.ts";
import { Buffer } from "https://deno.land/std@0.140.0/node/buffer.ts";
import { promises as fsPromises } from "https://deno.land/std@0.140.0/node/fs.ts";

const client = new MinIO.Client({
  endPoint: "127.0.0.1",
  port: 9000,
  useSSL: false,
  accessKey: "accessKey",
  secretKey: "secretKey",
});

client.traceOn();

const stream = await client.getObject("nest", "igtSNEhPRqOZDbGLfJvPwQ");

const buffer = await new Promise((resolve, reject) => {
  const buffers: Uint8Array[] = [ ];
  stream.on("data", (data) => {
    buffers.push(data);
  });
  stream.on("error", (err) => {
    reject(err);
  });
  stream.on("end", () => {
    resolve(Buffer.concat(buffers));
  });
});
await fsPromises.writeFile("./test.xlsx", buffer);