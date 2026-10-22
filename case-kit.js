/* case-kit — clinical case tracking. Zero dependencies.
 *
 * The shared record behind the case-taking apps (skin cases, hospital records,
 * first-aid logs): a case has sections, dated symptoms, and follow-ups, with a
 * timeline and a summary.
 *
 *   var c = Case.create({ title: "Skin case 12" });
 *   Case.addSymptom(c, { note: "Itching worse at night", severity: 3 });
 *   Case.summary(c);
 *
 * No patient-identifying data is modelled — the app owns that, and should keep
 * it local. MIT License. (c) 2026 Dr Sohil Momin.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Case = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  var C = { version: "0.1.0" };
  var uid = 0;
  function id() { uid++; return "c" + Date.now().toString(36) + "-" + uid.toString(36); }
  function day(ts) { return new Date(ts == null ? Date.now() : ts).toISOString().slice(0, 10); }

  C.create = function (opts) {
    opts = opts || {};
    return {
      id: opts.id || id(),
      title: opts.title || "Untitled case",
      created: opts.created || Date.now(),
      sections: opts.sections || {},   // history, habits, mapping, ...
      symptoms: opts.symptoms || [],   // {id, note, severity, tags, date}
      followUps: opts.followUps || []  // {id, date, note, remedy, potency, response}
    };
  };

  C.section = function (c, name, value) {
    if (value === undefined) return c.sections[name] || "";
    c.sections[name] = value; return c;
  };

  C.addSymptom = function (c, s) {
    s = s || {};
    var rec = { id: s.id || id(), note: s.note || "", severity: s.severity == null ? 1 : Math.max(1, Math.min(5, s.severity | 0)),
                tags: s.tags || [], date: s.date || Date.now() };
    c.symptoms.push(rec);
    return rec;
  };

  C.addFollowUp = function (c, f) {
    f = f || {};
    var rec = { id: f.id || id(), date: f.date || Date.now(), note: f.note || "",
                remedy: f.remedy || "", potency: f.potency || "", response: f.response || "" };
    c.followUps.push(rec);
    return rec;
  };

  C.timeline = function (c) {
    var ev = [];
    c.symptoms.forEach(function (s) { ev.push({ kind: "symptom", date: s.date, text: s.note, severity: s.severity, tags: s.tags }); });
    c.followUps.forEach(function (f) { ev.push({ kind: "follow-up", date: f.date, text: f.note, remedy: f.remedy, potency: f.potency, response: f.response }); });
    ev.sort(function (a, b) { return a.date - b.date; });
    return ev;
  };

  C.summary = function (c) {
    var sev = c.symptoms.map(function (s) { return s.severity; });
    var tl = C.timeline(c);
    return {
      title: c.title,
      created: day(c.created),
      symptoms: c.symptoms.length,
      maxSeverity: sev.length ? Math.max.apply(null, sev) : 0,
      avgSeverity: sev.length ? Math.round((sev.reduce(function (a, b) { return a + b; }, 0) / sev.length) * 10) / 10 : 0,
      followUps: c.followUps.length,
      sections: Object.keys(c.sections).filter(function (k) { return c.sections[k]; }),
      lastEvent: tl.length ? day(tl[tl.length - 1].date) : null
    };
  };

  C.toJSON = function (c) { return JSON.stringify(c, null, 2); };
  C.fromJSON = function (text) {
    var o = typeof text === "string" ? JSON.parse(text) : text;
    return C.create(o);
  };

  return C;
});
