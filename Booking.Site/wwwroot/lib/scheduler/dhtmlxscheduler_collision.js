/*
@license
dhtmlxScheduler v.4.3.25 Professional

This software can be used only as part of dhtmlx.com site.
You are not allowed to use it on any other site

(c) Dinamenta, UAB.


*/
Scheduler.plugin(function (e) {
    !function () {
        function t(t) { var i = e._get_section_view(); i && t && (a = e.getEvent(t)[e._get_section_property()]) } var a, i; e.config.collision_limit = 1, e.attachEvent("onBeforeDrag", function (e) { return t(e), !0 }), e.attachEvent("onBeforeLightbox", function (a) { var n = e.getEvent(a); return i = [n.start_date, n.end_date], t(a), !0 }), e.attachEvent("onEventChanged", function (t) {
            if (!t || !e.getEvent(t)) return !0; var a = e.getEvent(t); if (!e.checkCollision(a)) {
                if (!i) return !1; a.start_date = i[0], a.end_date = i[1],
                a._timed = this.isOneDayEvent(a)
            } return !0
        }), e.attachEvent("onBeforeEventChanged", function (t, a, i) { return e.checkCollision(t) }), e.attachEvent("onEventAdded", function (t, a) { var i = e.checkCollision(a); i || e.deleteEvent(t) }), e.attachEvent("onEventSave", function (t, a, i) { if (a = e._lame_clone(a), a.id = t, !a.start_date || !a.end_date) { var n = e.getEvent(t); a.start_date = new Date(n.start_date), a.end_date = new Date(n.end_date) } return a.rec_type && e._roll_back_dates(a), e.checkCollision(a) }), e._check_sections_collision = function (t, a) {
            var i = e._get_section_property(); return t[i] == a[i] && t.id != a.id ? !0 : !1
        }, e.checkCollision = function (t) {
            var i = [], n = e.config.collision_limit; if (t.rec_type) for (var l = e.getRecDates(t), r = 0; r < l.length; r++) for (var d = e.getEvents(l[r].start_date, l[r].end_date), o = 0; o < d.length; o++) (d[o].event_pid || d[o].id) != t.id && i.push(d[o]); else { i = e.getEvents(t.start_date, t.end_date); for (var s = 0; s < i.length; s++) if (i[s].id == t.id) { i.splice(s, 1); break } } var _ = e._get_section_view(), c = e._get_section_property(), u = !0; if (_) {
                for (var h = 0, s = 0; s < i.length; s++) i[s].id != t.id && this._check_sections_collision(i[s], t) && h++;
                h >= n && (u = !1)
            } else i.length >= n && (u = !1); if (!u) { var p = !e.callEvent("onEventCollision", [t, i]); return p || (t[c] = a || t[c]), p } return u
        }
    }()
});
//# sourceMappingURL=../sources/ext/dhtmlxscheduler_collision.js.map