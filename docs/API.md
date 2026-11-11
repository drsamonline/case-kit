# case-kit — API reference

**Version 1.0.0.** **Clinical case tracking.** Zero dependencies. One file. Sections, dated symptoms, follow-ups, a timeline and a summary — the shared logic extracted from the drsamonline apps that repeat it.

Generated from the source in this repository: every name, argument and
note below is read out of the kit file, so it cannot describe a function
that is not there.

```js
<script src="case-kit.js"></script>
Case.create(...)
// or: const Case = require('./case-kit.js')
```

## The surface (11 entries)

| Name | Arguments | What it does |
|---|---|---|
| `Case.create` | `(opts)` | — |
| `Case.section` | `(c, name, value)` | — |
| `Case.addSymptom` | `(c, s)` | — |
| `Case.addFollowUp` | `(c, f)` | — |
| `Case.timeline` | `(c)` | — |
| `Case.summary` | `(c)` | — |
| `Case.toJSON` | `(c)` | — |
| `Case.fromJSON` | `(text)` | — |
| `Case.patient` | `(p)` | Normalise a patient block: an opaque id plus a short label. Never a name. |
| `Case.exportRecord` | `(cases, patient, opts)` | Export one case, or a set of cases, as a single interchange record (a JSON string). |
| `Case.importRecord` | `(text)` | Read an interchange record back. Accepts a JSON string or an object. Older versions are migrated; a NEWER version is refused, never guessed. |

## Notes

- Zero dependencies, one file, no build step: it works from `file://`, from a
  `<script>` tag and from Node.
- The version above is the `VERSION` file in this repository; a pinned copy is
  what an app vendors.
