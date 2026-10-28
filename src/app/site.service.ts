import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { SISTERS, SITE, SLIDES } from './content';

export interface SiteClient { id: string; name: string; logo: string; url: string; visible: boolean }
export interface SiteSister { id: string; name: string; tagline: string; blurb: string; logo: string; url: string; buttonLabel: string; visible: boolean }

/** The defaults, as written in content.ts. Anything the platform owner saves in the Platform panel (Website) replaces them. */
const DEFAULTS = {
  brandLogo: 'images/redcodex/logo-wide.png',
  heroBadge: 'Software company · Dhaka, Bangladesh',
  heroLead: 'One ERP, ', heroHighlight: 'a screen for everyone', heroTail: ' in your company.',
  heroText: 'Red CodeX ERP gives each person their own dashboard: the admin, the manager, the accountant, the employee, the client and the vendor. Money, projects, stock and people, all in one place.',
  ...SITE,
  clientsTitle: 'Trusted by growing businesses',
  clientsText: 'Companies that run their work on Red CodeX ERP and our software.',
  clients: [] as SiteClient[],
  sisters: SISTERS.map((s, i) => ({ id: `default-${i}`, name: s.name, tagline: s.tagline, blurb: s.blurb, logo: s.logo, url: s.url, buttonLabel: s.cta, visible: true })) as SiteSister[],
  screens: {} as Record<string, string>,
};
export type SiteContent = typeof DEFAULTS;

/** The website's editable text, logos and pictures, read from the ERP backend (siteContent). Until it answers, the defaults show. */
@Injectable({ providedIn: 'root' })
export class SiteService {
  private api = inject(ApiService);
  readonly content = signal<SiteContent>(DEFAULTS);

  constructor() { void this.load(); }

  /** A slide's picture: the one uploaded in the Platform panel, or the built-in one. */
  screen(id: string): string { return this.content().screens[id] || SLIDES.find((s) => s.id === id)?.img || ''; }
  tel(): string { return 'tel:' + this.content().phone.replace(/[^\d+]/g, ''); }

  private async load(): Promise<void> {
    try {
      const rows = await this.api.siteContent();
      if (!rows.length) { return; }
      const next: SiteContent = { ...DEFAULTS, screens: {} };
      const clients: SiteClient[] = []; const sisters: SiteSister[] = [];
      for (const { key, value } of rows) {
        if (key === 'home') { for (const [k, v] of Object.entries(value)) { if (typeof v === 'string' && v.trim() && k in DEFAULTS) { (next as Record<string, unknown>)[k] = v; } } }
        else if (key === 'brand' && value['brandLogo']) { next.brandLogo = String(value['brandLogo']); }
        else if (key.startsWith('client.')) { clients.push(value as unknown as SiteClient); }
        else if (key.startsWith('sister.')) { sisters.push(value as unknown as SiteSister); }
        else if (key.startsWith('screen.') && value['src']) { next.screens[key.slice(7)] = String(value['src']); }
      }
      const order = (k: string) => rows.find((x) => x.key === k)?.value['ids'];
      if (clients.length || order('clients_order')) { next.clients = ordered(clients, order('clients_order')).filter((c) => c.visible && c.logo); }
      if (sisters.length || order('sisters_order')) { next.sisters = ordered(sisters, order('sisters_order')).filter((s) => s.visible && s.name.trim()); }
      this.content.set(next);
    } catch { /* the defaults stay */ }
  }
}

function ordered<T extends { id: string }>(items: T[], ids: unknown): T[] {
  const want = Array.isArray(ids) ? (ids as string[]) : [];
  return [...items].sort((a, b) => (want.indexOf(a.id) + 1 || 999) - (want.indexOf(b.id) + 1 || 999));
}
