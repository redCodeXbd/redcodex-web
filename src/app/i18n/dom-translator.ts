/** English text on the left, the same text in Bangla on the right. A `{0}` in an entry stands for any text (a name, a number). */
export type Dictionary = Record<string, string>;

const ATTRS = ['placeholder', 'aria-label', 'title', 'alt'];
const SKIP = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'NOSCRIPT', 'CODE']);
const DIGITS = '০১২৩৪৫৬৭৮৯';

const MONTHS: Record<string, string> = { January: 'জানুয়ারি', February: 'ফেব্রুয়ারি', March: 'মার্চ', April: 'এপ্রিল', May: 'মে', June: 'জুন', July: 'জুলাই', August: 'আগস্ট', September: 'সেপ্টেম্বর', October: 'অক্টোবর', November: 'নভেম্বর', December: 'ডিসেম্বর',
    Jan: 'জানু', Feb: 'ফেব্রু', Mar: 'মার্চ', Apr: 'এপ্রিল', Jun: 'জুন', Jul: 'জুলাই', Aug: 'আগস্ট', Sep: 'সেপ্টে', Sept: 'সেপ্টে', Oct: 'অক্টো', Nov: 'নভে', Dec: 'ডিসে' };
const DAYS: Record<string, string> = { Monday: 'সোমবার', Tuesday: 'মঙ্গলবার', Wednesday: 'বুধবার', Thursday: 'বৃহস্পতিবার', Friday: 'শুক্রবার', Saturday: 'শনিবার', Sunday: 'রবিবার',
    Mon: 'সোম', Tue: 'মঙ্গল', Wed: 'বুধ', Thu: 'বৃহ', Fri: 'শুক্র', Sat: 'শনি', Sun: 'রবি' };
const WORDS = new RegExp('\\b(' + [...Object.keys(MONTHS), ...Object.keys(DAYS)].sort((a, b) => b.length - a.length).join('|') + ')\\b', 'g');

/** A number followed by one of these words: "3 projects" becomes "3টি প্রকল্প". */
const UNITS: Record<string, string> = {
    expense: 'টি খরচ', expenses: 'টি খরচ', fund: 'টি তহবিল', funds: 'টি তহবিল', product: 'টি পণ্য', products: 'টি পণ্য', login: 'টি লগইন', logins: 'টি লগইন',
    role: 'টি ভূমিকা', roles: 'টি ভূমিকা', client: ' জন ক্লায়েন্ট', clients: ' জন ক্লায়েন্ট', vendor: ' জন ভেন্ডর', vendors: ' জন ভেন্ডর', project: 'টি প্রকল্প', projects: 'টি প্রকল্প',
    warehouse: 'টি গুদাম', warehouses: 'টি গুদাম', employee: ' জন কর্মী', employees: ' জন কর্মী', person: ' জন', people: ' জন', request: 'টি অনুরোধ', requests: 'টি অনুরোধ',
    transaction: 'টি লেনদেন', transactions: 'টি লেনদেন', return: 'টি ফেরত', returns: 'টি ফেরত', action: 'টি কার্যক্রম', actions: 'টি কার্যক্রম', movement: 'টি স্থানান্তর', movements: 'টি স্থানান্তর',
    payment: 'টি পেমেন্ট', payments: 'টি পেমেন্ট', month: ' মাস', months: ' মাস', day: ' দিন', days: ' দিন', hour: ' ঘণ্টা', hours: ' ঘণ্টা', minute: ' মিনিট', minutes: ' মিনিট', min: ' মিনিট', mins: ' মিনিট',
    pcs: ' পিস', pc: ' পিস', set: ' সেট', sets: ' সেট', ream: ' রিম', roll: ' রোল', rolls: ' রোল', unit: 'টি একক', units: 'টি একক', step: 'টি ধাপ', steps: 'টি ধাপ', loan: 'টি ঋণ', loans: 'টি ঋণ',
    order: 'টি অর্ডার', orders: 'টি অর্ডার', invoice: 'টি ইনভয়েস', invoices: 'টি ইনভয়েস', device: 'টি ডিভাইস', devices: 'টি ডিভাইস', shift: 'টি শিফট', shifts: 'টি শিফট', holiday: 'টি ছুটির দিন',
    holidays: 'টি ছুটির দিন', item: 'টি পণ্য', items: 'টি পণ্য', record: 'টি রেকর্ড', records: 'টি রেকর্ড', branch: 'টি শাখা', branches: 'টি শাখা', department: 'টি বিভাগ', departments: 'টি বিভাগ',
    team: 'টি দল', teams: 'টি দল', company: 'টি কোম্পানি', companies: 'টি কোম্পানি', payslip: 'টি পে-স্লিপ', payslips: 'টি পে-স্লিপ', category: 'টি ক্যাটাগরি', categories: 'টি ক্যাটাগরি',
    low: 'টি কম', waiting: 'টি অপেক্ষায়', percent: ' শতাংশ', lines: 'টি লাইন', line: 'টি লাইন', approvals: 'টি অনুমোদন', applications: 'টি আবেদন', imports: 'টি আমদানি',
};

interface Rec { src: string; out: string }

/**
 * Swaps the words on the screen between English and Bangla. It reads every text node and a few attributes
 * (placeholder, label, title), looks the text up in the dictionary and writes the Bangla. The English is remembered
 * so switching back puts it exactly as it was. A MutationObserver keeps it up to date as pages change.
 */
export class DomTranslator {
    private _dict: Dictionary = {};
    private _patterns: { re: RegExp; to: string; order: number[]; max: number }[] = [];
    private _cache = new Map<string, string>();
    private _text = new WeakMap<Node, Rec>();
    private _attr = new WeakMap<Element, Record<string, Rec>>();
    private _observer: MutationObserver | null = null;
    private _queue = new Set<Node>();
    private _scheduled = false;

    setDictionary(d: Dictionary): void {
        // An entry may end in a full stop; it is found with or without one.
        const all: Dictionary = { ...d };
        for (const k of Object.keys(d)) {
            if (k.endsWith('.') && !k.endsWith('..') && all[k.slice(0, -1)] === undefined) { all[k.slice(0, -1)] = d[k].replace(/[.।]$/, ''); }
        }
        this._dict = all;
        this._cache.clear();
        this._patterns = Object.keys(all).filter((k) => /\{\d\}/.test(k)).map((k) => {
            const literal = k.replace(/\{\d\}/g, '').length;
            return {
                re: new RegExp('^' + k.split(/\{\d\}/).map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('(.+?)') + '$'),
                to: all[k],
                order: [...k.matchAll(/\{(\d)\}/g)].map((m) => +m[1]),
                // A pattern made of little more than placeholders must not swallow a long sentence.
                max: literal * 6 + 28,
            };
        }).sort((a, b) => b.re.source.length - a.re.source.length);
    }

    start(): void {
        this._walk(document.body, true);
        if (this._observer) { return; }
        this._observer = new MutationObserver((list) => {
            for (const m of list) {
                if (m.type === 'characterData') { this._queue.add(m.target); }
                else if (m.type === 'attributes') { this._queue.add(m.target); }
                else { m.addedNodes.forEach((n) => this._queue.add(n)); }
            }
            this._schedule();
        });
        this._observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    }

    stop(): void {
        this._observer?.disconnect();
        this._observer = null;
        this._queue.clear();
        this._walk(document.body, false);
    }

    /** One text in Bangla. Texts that are not in the dictionary stay English; only digits and dates are converted. */
    translate(text: string): string {
        const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(text)!;
        const core = m[2].replace(/\s+/g, ' ');
        if (!core) { return text; }
        return m[1] + this._core(core) + m[3];
    }

    private _core(core: string): string {
        const hit = this._cache.get(core);
        if (hit !== undefined) { return hit; }
        let out = this._lookup(core);
        out = out.replace(/\bBDT\b/g, '৳').replace(/\d/g, (d) => DIGITS[+d]);
        if (this._cache.size > 5000) { this._cache.clear(); }
        this._cache.set(core, out);
        return out;
    }

    private _lookup(core: string): string {
        // A sentence may end in a full stop that the dictionary entry leaves out.
        if (core.length > 3 && core.endsWith('.') && !core.endsWith('..') && this._dict[core] === undefined && !/\{\d\}/.test(core)) {
            const bare = core.slice(0, -1);
            const t = this._lookup(bare);
            if (t !== bare) { return t + '।'; }
        }
        const exact = this._dict[core];
        if (exact !== undefined) { return exact; }
        // Several sentences: each is translated on its own, so a pattern cannot run across them.
        if (core.includes('. ') && !/^\d+\.\s/.test(core)) {
            const sentences = core.split('. ');
            const out = sentences.map((x) => this._lookup(x));
            if (out.some((x, i) => x !== sentences[i])) { return out.join('। '); }
        }
        for (const p of this._patterns) {
            const m = core.length <= p.max ? p.re.exec(core) : null;
            // A placeholder stands for a short thing (a name, a number, an amount), never for a stretch of prose.
            if (m && m.slice(1).every((x) => x.length <= 48 && x.split(' ').length <= 5)) {
                const parts: string[] = [];
                p.order.forEach((n, i) => { parts[n] = this._lookup(m[i + 1]); });
                return p.to.replace(/\{(\d)\}/g, (_x, n) => parts[+n] ?? '');
            }
        }
        const unit = /^(\d[\d,]*(?:\.\d+)?)\s+([A-Za-z]+)$/.exec(core);
        if (unit && UNITS[unit[2].toLowerCase()]) { return unit[1] + UNITS[unit[2].toLowerCase()]; }
        // Parts of a line: "A · B", "A: B" translate piece by piece when at least one piece is known.
        for (const sep of [' · ', ' | ', ': ', ' + ', ' / ', ' - ']) {
            if (core.includes(sep)) {
                const parts = core.split(sep);
                const out = parts.map((x) => this._lookup(x));
                if (out.some((x, i) => x !== parts[i])) { return out.join(sep); }
            }
        }
        return core.replace(WORDS, (w) => MONTHS[w] ?? DAYS[w] ?? w).replace(/\bAM\b/g, 'এএম').replace(/\bPM\b/g, 'পিএম');
    }

    // -----------------------------------------------------------------------------------------------------

    private _schedule(): void {
        if (this._scheduled) { return; }
        this._scheduled = true;
        requestAnimationFrame(() => {
            this._scheduled = false;
            const nodes = [...this._queue];
            this._queue.clear();
            for (const n of nodes) { if (n.isConnected) { this._walk(n, true); } }
        });
    }

    private _walk(root: Node, toBangla: boolean): void {
        if (root.nodeType === Node.TEXT_NODE) { this._textNode(root as Text, toBangla); return; }
        if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) { return; }
        if (root.nodeType === Node.ELEMENT_NODE) { this._attrs(root as Element, toBangla); }
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
        let n: Node | null = walker.nextNode();
        while (n) {
            if (n.nodeType === Node.TEXT_NODE) { this._textNode(n as Text, toBangla); }
            else { this._attrs(n as Element, toBangla); }
            n = walker.nextNode();
        }
    }

    private _textNode(node: Text, toBangla: boolean): void {
        const parent = node.parentElement;
        if (parent && (SKIP.has(parent.tagName) || parent.isContentEditable || parent.closest('[data-no-i18n]'))) { return; }
        const v = node.nodeValue ?? '';
        const rec = this._text.get(node);
        if (!toBangla) {
            if (rec && v === rec.out) { node.nodeValue = rec.src; }
            this._text.delete(node);
            return;
        }
        if (rec && v === rec.out) { return; }
        if (!v.trim()) { return; }
        const out = this.translate(v);
        this._text.set(node, { src: v, out });
        if (out !== v) { node.nodeValue = out; }
    }

    private _attrs(el: Element, toBangla: boolean): void {
        if (el.closest('[data-no-i18n]')) { return; }
        let recs = this._attr.get(el);
        for (const a of ATTRS) {
            const v = el.getAttribute(a);
            if (v === null) { continue; }
            const rec = recs?.[a];
            if (!toBangla) {
                if (rec && v === rec.out) { el.setAttribute(a, rec.src); }
                if (recs) { delete recs[a]; }
                continue;
            }
            if (rec && v === rec.out) { continue; }
            const out = this.translate(v);
            if (!recs) { recs = {}; this._attr.set(el, recs); }
            recs[a] = { src: v, out };
            if (out !== v) { el.setAttribute(a, out); }
        }
    }
}
