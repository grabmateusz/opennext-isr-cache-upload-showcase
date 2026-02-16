# Summary

This repository was created to make it possible to reproduce issue [[BUG] Can't upload R2 incremental cache - recurring 503 Service Unavailable #1110](https://github.com/opennextjs/opennextjs-cloudflare/issues/1110) and make it possible to implement proper solution

Most of the code was generated using Claude Sonnet 4.5, it is just a showcase of the problem.

# Key pain points

Showcase project contains 2 subprojects, deployed independently.

First project is an API (that is created only to showcase fetching huge set of data without any rate limits, to avoid external dependencies).

For it's deployment rules please visit subfolder README.md.

Second project is an OpenNext Cloudflare Adapter project, which contains key elements as follows:

- It uses Next.js 15.x / 16.x
- It uses ISR and it has 1k+ routes,
- During route generations it performs expensive HTTP requests to external API during metadata and page rendering,
- It uses https://opennext.js.org/cloudflare/howtos/custom-worker,
- It uses on-demand revalidation.

On main branch project is using code from https://github.com/opennextjs/opennextjs-cloudflare/pull/1116, as newest stable OpenNext releases fail during cache population. 

It requires variables:
- `CF_ACCOUNT_ID / CLOUDFLARE_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`

to upload R2 cache via rclone, otherwise it fallbacks to default upload which fails because of CF Account rate limit.
