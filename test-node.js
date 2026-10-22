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

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
