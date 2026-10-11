# Architecture & integration contract

## Current foundation
- Next.js App Router + TypeScript, strict mode.
- Public pages are server-rendered; venture content is in `src/lib/ventures.ts` so it can later be replaced by a database/CMS adapter.
- Versioned API namespace: `/api/v1`.
- `GET /api/v1/health` is a public, non-sensitive health endpoint.
- `POST /api/v1/integrations` is an authenticated, validation-only webhook scaffold. It intentionally does not run bot commands or persist/forward data yet.

## Future integration path
`WhatsApp bot / internal app / partner platform -> authenticated API gateway -> schema validation -> idempotency check -> queue -> integration adapter -> audit log`.

Do not let arbitrary webhook payloads directly execute shell commands, bot commands, SQL, or privileged actions. Give each integration its own credential and permission scope; validate issuer, event type, timestamp and signature; reject replayed `eventId` values; rate-limit per integration; keep secrets server-side; log metadata rather than message contents where possible. Use a queue and retries/dead-letter handling for production reliability.

## API envelope
Success: `{ "ok": true, "data": { ... } }`
Error: `{ "ok": false, "error": { "code": "...", "message": "..." } }`

Integration event payload (strict schema):
```json
{
  "source": "nexora-whatsapp",
  "event": "message.received",
  "eventId": "unique-id-at-least-8-chars",
  "occurredAt": "2026-10-11T00:00:00.000Z",
  "data": { "example": "non-sensitive payload" }
}
```

## Adding an integration
1. Add a typed schema in `src/lib/integrations/<name>.schema.ts`.
2. Implement a provider adapter in `src/lib/integrations/<name>.adapter.ts` behind an interface.
3. Add authorization/scopes and idempotency before enabling delivery.
4. Add tests for invalid signatures, duplicate IDs, unauthorized scopes, malformed payloads and provider timeouts.
5. Document versioning and compatibility before changing the contract.

No real WhatsApp bot is connected in this version. When bot source is supplied, review its runtime, secrets, command permissions, event handlers, and hosting constraints before designing the adapter.
