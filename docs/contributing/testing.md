# Testing

```bash
npm run test
```

- `test/detect-content-major.test.ts` — version detection
- `test/normalize-toc.test.ts` — TOC shape helpers
- `test/content-v3.test.ts` — e2e against content-v3 playground
- `test/content-v2.test.ts` — e2e against content-v2 playground

Run `npm run dev:prepare` before e2e so playgrounds have dependencies and the module stub.
