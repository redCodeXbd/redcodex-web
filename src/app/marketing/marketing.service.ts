import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../api.service';
import { INTEGRATIONS, IntegrationDef, IntegrationId, TrackEvent } from './catalog';

export type Consent = 'unknown' | 'granted' | 'denied';
type LoadState = 'idle' | 'loading' | 'ok' | 'failed';
interface Connection { enabled: boolean; values: Record<string, string> }
export interface Attribution { source: string; medium: string; campaign: string; term: string; content: string; referrer: string; landing: string; clickId: string; at: string }
interface SendResult { platform: IntegrationId; platformEvent: string; status: 'sent' | 'queued' | 'failed' | 'blocked' }

// The same browser keys as the ERP app's old website, so a returning visitor keeps their choice and their source.
const CONSENT = 'encore.marketing.consent.v1';
const ATTRIB = 'encore.marketing.attrib.v1';
const VISITOR = 'encore.marketing.visitor.v1';

type AnyWin = Window & Record<string, any>;
const win = (): AnyWin => window as unknown as AnyWin;

/**
 * The visitor's side of the marketing tools connected in the ERP's Platform panel (Sync): reads which tools are on, asks for
 * consent, loads their scripts, remembers where the visitor came from, and reports every event to the backend
 * (trackMarketingEvent) so it shows in the Platform panel. No name, email or phone of a visitor is sent to any tool.
 */
@Injectable({ providedIn: 'root' })
export class MarketingService {
  private api = inject(ApiService);
  readonly connections = signal<Record<string, Connection>>({});
  readonly consent = signal<Consent>(this.read<Consent>(CONSENT, 'unknown'));
  readonly reopen = signal(false);
  private demo = false;
  private loadState: Record<string, LoadState> = {};
  private gtagFor: string[] = [];
  private config: Promise<void>;

  readonly active = computed<IntegrationDef[]>(() => INTEGRATIONS.filter((d) => d.id !== 'verify' && this.connections()[d.id]?.enabled && valid(d, this.connections()[d.id].values)));
  readonly anyActive = computed(() => this.active().length > 0);

  constructor() {
    this.captureAttribution();
    this.config = this.api.marketingConfig().then((c) => {
      this.connections.set((c['connections'] as Record<string, Connection>) ?? {});
      this.demo = c['demo'] === true;
      this.verification();
      if (this.consent() === 'granted') { this.loadAll(); }
    }, () => undefined);
  }

  setConsent(v: Consent): void {
    this.consent.set(v); this.reopen.set(false);
    try { localStorage.setItem(CONSENT, JSON.stringify(v)); } catch { /* this visit only */ }
    if (v === 'granted') { this.loadAll(); }
  }

  /** Reports something that happened. Recorded on the backend, and sent to every connected tool once the visitor agreed. Waits for the tool list first. */
  track(name: TrackEvent, params: Record<string, string> = {}): void {
    void this.config.then(() => {
      const consent = this.consent();
      const results: SendResult[] = [];
      for (const d of this.active()) {
        const pe = d.events[name];
        if (!pe) { continue; }
        results.push({ platform: d.id, platformEvent: pe, status: consent === 'granted' ? this.send(d, name, pe, params) : 'blocked' });
      }
      const ev = { id: `ev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`, at: new Date().toISOString(), name, page: location.pathname + (location.hash || ''), params, utm: this.attribution(), visitor: this.visitor(), consent, results, test: false, ...(this.demo ? { demo: true } : {}) };
      this.api.trackEvent(ev).catch(() => undefined);
    });
  }

  attribution(): Attribution | null {
    try { const s = JSON.parse(localStorage.getItem(ATTRIB) ?? 'null') as Attribution | null; return s && typeof s.source === 'string' ? s : null; } catch { return null; }
  }

  /** First look at the address: campaign tags (utm_*), ad click ids, or the site the visitor came from. */
  private captureAttribution(): void {
    try {
      const q = new URLSearchParams(location.search);
      const click = ['fbclid', 'gclid', 'ttclid', 'msclkid'].find((k) => q.get(k)) ?? '';
      const fromClick: Record<string, string> = { fbclid: 'facebook', gclid: 'google', ttclid: 'tiktok', msclkid: 'bing' };
      const ref = referrerHost();
      let a: Attribution | null = null;
      if (q.get('utm_source') || q.get('utm_medium') || q.get('utm_campaign') || click) {
        a = { source: (q.get('utm_source') || fromClick[click] || '').slice(0, 60), medium: (q.get('utm_medium') || (click ? 'paid' : '')).slice(0, 60), campaign: (q.get('utm_campaign') ?? '').slice(0, 80),
          term: (q.get('utm_term') ?? '').slice(0, 80), content: (q.get('utm_content') ?? '').slice(0, 80), referrer: ref, landing: location.pathname, clickId: click, at: new Date().toISOString() };
      } else if (!this.attribution()) {
        a = { source: ref || 'direct', medium: ref ? 'referral' : 'none', campaign: '', term: '', content: '', referrer: ref, landing: location.pathname, clickId: '', at: new Date().toISOString() };
      }
      if (a) { localStorage.setItem(ATTRIB, JSON.stringify(a)); }
    } catch { /* storage blocked */ }
  }

  private visitor(): string {
    try {
      let v = localStorage.getItem(VISITOR);
      if (!v) { v = `v-${Array.from(crypto.getRandomValues(new Uint8Array(5)), (b) => b.toString(16).padStart(2, '0')).join('')}`; localStorage.setItem(VISITOR, v); }
      return v;
    } catch { return 'v-unknown'; }
  }

  private loadAll(): void { for (const d of this.active()) { this.load1(d); } }

  private script(id: IntegrationId, src: string): void {
    const el = document.createElement('script');
    el.async = true; el.src = src;
    el.onload = () => (this.loadState[id] = 'ok');
    el.onerror = () => (this.loadState[id] = 'failed');
    document.head.appendChild(el);
  }

  private load1(d: IntegrationDef): void {
    if (this.loadState[d.id] && this.loadState[d.id] !== 'idle') { return; }
    if (this.demo) { this.loadState[d.id] = 'ok'; return; }
    const v = this.connections()[d.id].values; const w = win();
    this.loadState[d.id] = 'loading';
    try {
      switch (d.id) {
        case 'meta-pixel': {
          if (!w['fbq']) { const n: any = (w['fbq'] = function (...a: unknown[]) { n.callMethod ? n.callMethod(...a) : n.queue.push(a); }); if (!w['_fbq']) { w['_fbq'] = n; } n.push = n; n.loaded = true; n.version = '2.0'; n.queue = []; }
          this.script(d.id, 'https://connect.facebook.net/en_US/fbevents.js'); w['fbq']('init', v['pixelId']); break;
        }
        case 'ga4': case 'google-ads': this.gtag(d.id === 'ga4' ? v['measurementId'] : v['awId'], d.id); break;
        case 'gtm': w['dataLayer'] = w['dataLayer'] || []; w['dataLayer'].push({ 'gtm.start': Date.now(), event: 'gtm.js' }); this.script(d.id, `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(v['containerId'])}`); break;
        case 'tiktok': {
          w['TiktokAnalyticsObject'] = 'ttq'; const t: any = (w['ttq'] = w['ttq'] || []);
          ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie'].forEach((m) => { t[m] = (...a: unknown[]) => t.push([m, ...a]); });
          t._i = {}; t._i[v['pixelId']] = [];
          this.script(d.id, `https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${encodeURIComponent(v['pixelId'])}&lib=ttq`); break;
        }
        case 'linkedin': w['_linkedin_partner_id'] = v['partnerId']; w['_linkedin_data_partner_ids'] = [...(w['_linkedin_data_partner_ids'] ?? []), v['partnerId']]; this.script(d.id, 'https://snap.licdn.com/li.lms-analytics/insight.min.js'); break;
        case 'clarity': if (!w['clarity']) { const c: any = (w['clarity'] = (...a: unknown[]) => { (c.q = c.q || []).push(a); }); } this.script(d.id, `https://www.clarity.ms/tag/${encodeURIComponent(v['projectId'])}`); break;
      }
    } catch { this.loadState[d.id] = 'failed'; }
  }

  /** Google Analytics and Google Ads share one gtag.js. */
  private gtag(id: string, who: IntegrationId): void {
    const w = win();
    w['dataLayer'] = w['dataLayer'] || [];
    if (!w['gtag']) { w['gtag'] = function () { w['dataLayer'].push(arguments); }; w['gtag']('js', new Date()); }
    if (!this.gtagFor.length) { this.script(who, `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`); } else { this.loadState[who] = this.loadState[this.gtagFor[0]] === 'failed' ? 'failed' : 'ok'; }
    this.gtagFor.push(who);
    w['gtag']('config', id, { send_page_view: false });
  }

  private send(d: IntegrationDef, name: TrackEvent, pe: string, params: Record<string, string>): SendResult['status'] {
    if (this.demo) { return 'sent'; }
    const w = win();
    if (!this.loadState[d.id] || this.loadState[d.id] === 'idle') { this.load1(d); }
    try {
      switch (d.id) {
        case 'meta-pixel': w['fbq']?.('track', pe, params); break;
        case 'ga4': w['gtag']?.('event', pe, params); break;
        case 'google-ads': if (name === 'lead_submit') { const v = this.connections()[d.id].values; w['gtag']?.('event', 'conversion', { send_to: `${v['awId']}/${v['label']}` }); } break;
        case 'gtm': w['dataLayer']?.push({ event: pe, ...params }); break;
        case 'tiktok': name === 'page_view' ? w['ttq']?.page() : w['ttq']?.track(pe, params); break;
        case 'clarity': w['clarity']?.('event', pe); break;
      }
    } catch { return 'failed'; }
    const s = this.loadState[d.id];
    return s === 'failed' ? 'failed' : s === 'ok' ? 'sent' : 'queued';
  }

  /** Meta tags that prove the site is yours to Google, Meta and Bing. Added whatever the visitor chose: they track nobody. */
  private verification(): void {
    const c = this.connections()['verify'];
    if (!c?.enabled) { return; }
    for (const [name, content] of [['google-site-verification', c.values['google']], ['facebook-domain-verification', c.values['facebook']], ['msvalidate.01', c.values['bing']]]) {
      if (!content || document.head.querySelector(`meta[name="${name}"]`)) { continue; }
      const m = document.createElement('meta'); m.name = name; m.content = content; document.head.appendChild(m);
    }
  }

  private read<T>(key: string, empty: T): T {
    try { const s = JSON.parse(localStorage.getItem(key) ?? 'null'); return s ?? empty; } catch { return empty; }
  }
}

const valid = (d: IntegrationDef, values: Record<string, string>): boolean => d.fields.every((f) => { const v = (values[f.key] ?? '').trim(); return v ? f.pattern.test(v) : !!f.optional; });
const referrerHost = (): string => { try { const h = document.referrer ? new URL(document.referrer).hostname : ''; return h && h !== location.hostname ? h.replace(/^www\./, '') : ''; } catch { return ''; } };
