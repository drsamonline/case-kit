const Case = require(require("path").join(__dirname, "case-kit.js"));
let pass = 0, fail = 0;
function ok(n, c, e) { c ? (pass++, console.log("PASS  " + n + (e ? "  (" + e + ")" : ""))) : (fail++, console.log("FAIL  " + n + (e ? "  (" + e + ")" : ""))); }
const D = (s) => Date.parse(s);

const c = Case.create({ title: "Skin case 12", created: D("2026-01-01") });
ok("case has an id and title", !!c.id && c.title === "Skin case 12");

Case.section(c, "history", "Itchy since childhood");
Case.section(c, "habits", "Sweets at night");
ok("sections store and read", Case.section(c, "history") === "Itchy since childhood");
ok("missing section reads empty", Case.section(c, "mapping") === "");

Case.addSymptom(c, { note: "Itching worse at night", severity: 3, date: D("2026-01-05") });
Case.addSymptom(c, { note: "Dry patches on elbows", severity: 5, date: D("2026-01-03") });
Case.addSymptom(c, { note: "Better by warmth", severity: 9, date: D("2026-01-07") });
ok("severity is clamped to 1..5", c.symptoms[2].severity === 5);

Case.addFollowUp(c, { note: "Started Sulphur", remedy: "Sulphur", potency: "30C", date: D("2026-01-06") });

const tl = Case.timeline(c);
ok("timeline has all events", tl.length === 4);
ok("timeline is sorted by date", tl[0].date <= tl[1].date && tl[1].date <= tl[2].date && tl[2].date <= tl[3].date);
ok("timeline starts with the earliest symptom", tl[0].text === "Dry patches on elbows");

const s = Case.summary(c);
ok("summary counts symptoms", s.symptoms === 3);
ok("summary max severity", s.maxSeverity === 5);
ok("summary counts follow-ups", s.followUps === 1);
ok("summary lists filled sections", s.sections.indexOf("history") !== -1 && s.sections.length === 2);
ok("summary last event date", s.lastEvent === "2026-01-07");

const round = Case.fromJSON(Case.toJSON(c));
ok("round-trips through JSON", round.title === c.title && round.symptoms.length === 3);


/* ---- interchange record (update: case-kit) ---- */
const rec = Case.exportRecord([c], { id: "p-001", label: "S.M." });
const parsed = JSON.parse(rec);
ok("record is plain JSON with a format and version", parsed.format === "case-kit/record" && parsed.version === 1);
ok("record carries an opaque patient id + short label", parsed.patient.id === "p-001" && parsed.patient.label === "S.M.");
ok("record never carries a name field", !("name" in parsed.patient));
ok("record wraps the case in cases[]", Array.isArray(parsed.cases) && parsed.cases.length === 1);

const back = Case.importRecord(rec);
ok("import restores the case", back.cases.length === 1 && back.cases[0].title === c.title && back.cases[0].symptoms.length === 3);
ok("import restores the patient block", back.patient.id === "p-001" && back.patient.label === "S.M.");
ok("round-trip preserves symptoms and follow-ups",
   JSON.stringify(back.cases[0].symptoms) === JSON.stringify(c.symptoms) && back.cases[0].followUps.length === 1);

ok("export accepts a single case", JSON.parse(Case.exportRecord(c)).cases.length === 1);
ok("export accepts a set of cases", JSON.parse(Case.exportRecord([c, Case.create({ title: "Second" })])).cases.length === 2);
ok("patient defaults to empty (no invented id or label)", Case.patient().id === "" && Case.patient().label === "");

/* version compatibility */
const legacy = JSON.stringify({ format: "case-kit/record", cases: [{ title: "Old case", symptoms: [] }] });
const migrated = Case.importRecord(legacy);
ok("a pre-version record still imports (v0)",
   migrated.version === 0 && migrated.cases.length === 1 && migrated.cases[0].title === "Old case");

let futureRejected = false;
try { Case.importRecord(JSON.stringify({ format: "case-kit/record", version: 2, cases: [] })); }
catch (e) { futureRejected = /newer than/.test(e.message); }
ok("a newer version is refused, not guessed", futureRejected);

let foreignRejected = false;
try { Case.importRecord(JSON.stringify({ format: "something-else", cases: [] })); }
catch (e) { foreignRejected = true; }
ok("a foreign record is refused", foreignRejected);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
