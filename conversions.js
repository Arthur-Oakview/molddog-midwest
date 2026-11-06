/* =====================================================================
   Google Ads conversion tracking — Mold Dog Midwest
   Loaded on every page (after the Google tag in <head>).

   >>> PASTE YOUR TWO send_to VALUES BELOW once you create the conversion
       actions in Google Ads (Goals → Conversions → + New conversion action).
       Each looks like 'AW-18360911914/AbC-D_efG-h12'.
       Until they're filled in, nothing is sent (no errors either). <<<
   ===================================================================== */
(function () {
  var CALL_SEND_TO = 'AW-18360911914/lnlnCKSYw7MdEKqQlbNE'; // Phone calls → clicks on your number
  var FORM_SEND_TO = 'AW-18360911914/x9CfCIn4w7MdEKqQlbNE'; // Website → Submit lead form

  function ready(sendTo) {
    return sendTo.indexOf('_HERE') === -1;
  }

  function fire(sendTo, extra) {
    if (!ready(sendTo) || typeof window.gtag !== 'function') return;
    var params = { send_to: sendTo };
    if (extra) for (var k in extra) params[k] = extra[k];
    window.gtag('event', 'conversion', params);
  }

  /* ---- CALLS: every tel: link on any page (nav, hero, pricing,
     sticky mobile bar, footer…) is caught by this one listener. ---- */
  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a[href^="tel:"]');
    if (link) fire(CALL_SEND_TO);
  }, true);

  /* ---- FORM: the Tally popup/embed runs in an iframe and tells the page
     when it's submitted via postMessage ("Tally.FormSubmitted").
     That fires only on a SUCCESSFUL submit, not on opening the form. ---- */
  var lastSubmissionId = null;
  window.addEventListener('message', function (e) {
    if (!e.origin || e.origin.indexOf('tally.so') === -1) return;
    var data = e.data;
    if (typeof data === 'string') {
      if (data.indexOf('Tally.FormSubmitted') === -1) return;
      try { data = JSON.parse(data); } catch (err) { return; }
    }
    if (!data || data.event !== 'Tally.FormSubmitted') return;

    var payload = data.payload || {};
    var id = payload.id || payload.respondentId || null;
    if (id && id === lastSubmissionId) return; // guard against duplicate messages
    lastSubmissionId = id;

    fire(FORM_SEND_TO, id ? { transaction_id: id } : null);
  });
})();
