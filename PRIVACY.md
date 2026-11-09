# Privacy

Version: 1.0 (draft for review)
Effective: on publication
Owner: Dr Sohil Momin — sohilmomin2000@gmail.com
Changes: Initial version.

## What case-kit is

`case-kit` is a JavaScript library. It holds the shared clinical-case logic — sections, dated symptoms, follow-ups, a timeline and a summary — that the drsamonline apps repeat.

It is a library, not an app. Nothing in it runs on its own.

## What the library itself does

**Nothing with your data.** `case-kit.js` is pure logic: it takes an object in, gives an object back. It does not store anything, does not read the browser's storage, makes no network request, and carries no telemetry. You can confirm this by reading the file — it is one dependency-free source file, and there is no `fetch`, no `XMLHttpRequest` and no storage call in it.

## What the app that embeds it does

That depends entirely on the app. `case-kit` hands the case data back to whatever called it, and the caller decides where it goes: memory, `localStorage`, IndexedDB, a file, or a server.

**If you build with `case-kit`, you are the Data Fiduciary for the data your app holds**, not the author of this library. Clinical case data about an identified patient is personal data under the Digital Personal Data Protection Act, 2023, and health data is sensitive personal data under the SPDI Rules, 2011.

A minimum set for any app built on this library:

- a privacy notice in your app that says what is stored, where, and how to erase it;
- a named contact for a patient's access, correction and erasure requests;
- a retention rule — how long a case is kept, and what happens when it is not;
- a decision about encryption at rest, and honesty in the notice if you chose not to.

`app-encrypted-case-log` in this fleet is one worked example: it encrypts on the device with a passphrase and says so.

## Reporting a problem

If you find a privacy defect in the library itself — anything that stores, transmits or logs case data when it should not — report it to sohilmomin2000@gmail.com. That would be a bug, and it would be fixed as one.

Contact: Dr Sohil Momin — sohilmomin2000@gmail.com
