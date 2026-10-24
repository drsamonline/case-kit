# case-kit

[![live](https://img.shields.io/badge/live-online-22c55e)](https://drsamonline.github.io/case-kit/)
[![test](https://github.com/drsamonline/case-kit/actions/workflows/test.yml/badge.svg)](https://github.com/drsamonline/case-kit/actions/workflows/test.yml)
[![license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

**Clinical case tracking.** Zero dependencies. One file. Sections, dated symptoms, follow-ups, a timeline and a summary — the shared logic
extracted from the drsamonline apps that repeat it.

## Use it

See `case-kit.js` for the full API and `test-node.js` for worked examples.

## What it does

- sections (history / habits / mapping)
- dated symptoms with severity
- follow-ups (remedy / potency / response)
- timeline + summary + JSON
- a plain-JSON interchange record (patient + version + cases)

## Interchange record

A case (or a set of cases) can be handed to another app in the family as **one
plain-JSON file** — no server, no network:

```json
{
  "format": "case-kit/record",
  "version": 1,
  "exported": "2026-01-07T10:00:00.000Z",
  "patient": { "id": "p-001", "label": "S.M." },
  "cases": [ { "id": "c…", "title": "Skin case 12", "sections": { … }, "symptoms": [ … ], "followUps": [ … ] } ]
}
```

```js
var text = Case.exportRecord(caseOrCases, { id: "p-001", label: "S.M." });
var rec  = Case.importRecord(text);   // { version, patient, cases: [...] }
```

- **`patient`** is an opaque `id` and a short `label` (initials or a code) —
  **never a name**. Nothing identifying is carried by default.
- **`version`** lets the shape evolve: older records still import (migrated at
  `importRecord`), and a *newer* version is refused rather than guessed.
- The family mapping: a case's `followUps` are the **encounters**, and its
  `symptoms` / `sections` are the **notes** — a case-kit record expresses both.
- Where a record is encrypted (the **Encrypted Case Log**), encrypt the whole
  envelope — the interchange file must be the encrypted archive, not plaintext.

## Verified

```
node test-node.js
26 passed, 0 failed
```

## Consumers

skin-case-tracker, HMS, whispering-body-first-aid, gentle-pediatrics-companion

## Licence

MIT. (c) 2026 Dr Sohil Momin. Part of the Forge system — kits open, orchestrator licensed.
