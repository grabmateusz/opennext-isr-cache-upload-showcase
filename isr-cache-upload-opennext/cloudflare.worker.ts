// custom-worker.ts
 
// @ts-ignore `.open-next/worker.ts` is generated at build time
import { default as handler } from "./.open-next/worker.js";
 
export default {
  fetch: handler.fetch,
 
  async scheduled(event) {
    // ...
  },
} satisfies ExportedHandler<CloudflareEnv>;
 
// @ts-ignore `.open-next/worker.ts` is generated at build time
export { D1NextTagCache } from "./.open-next/worker.js";