import { Component, OnInit, signal } from '@angular/core';
import { Download, Fingerprint, LucideAngularModule, ScanFace, Smartphone } from 'lucide-angular';
import { RevealDirective } from '../reveal.directive';

interface Manifest { versionName?: string; apkUrl?: string; notes?: string }
interface AppCard { id: string; name: string; text: string; manifest: string; apk: string; logo?: string; icon?: typeof Fingerprint; version: string; notes: string }

/**
 * The Android apps, ERP first, then the attendance sync app. Each card reads the app's own update.json (the one the app uses to
 * update itself) for the newest version and its direct download. If the browser cannot read it (the file host must allow this site
 * with CORS), the card still works: it links to the build that was current when this page was made.
 */
@Component({
  selector: 'rcx-apps',
  standalone: true,
  imports: [LucideAngularModule, RevealDirective],
  template: `
    <section id="apps" class="section" aria-label="Mobile apps">
      <div class="wrap">
        <div rv class="max-w-2xl">
          <span class="eyebrow">Mobile apps</span>
          <h2 class="h2">Take it with you.</h2>
          <p class="lead">Download the Android apps straight to your phone. Once installed, they offer each new version inside the app.</p>
        </div>

        <div class="mt-12 grid gap-4 md:grid-cols-2">
          @for (a of apps(); track a.id; let i = $index) {
            <article rv [rv]="i" class="flex flex-col rounded-3xl p-6 hairline sm:p-8">
              <div class="flex items-center gap-4">
                <span class="flex h-16 w-16 flex-none items-center justify-center rounded-2xl bg-soft p-2.5">
                  @if (a.logo) { <img [src]="a.logo" [alt]="a.name" class="max-h-full max-w-full object-contain" loading="lazy" /> }
                  @else { <lucide-icon [img]="a.icon!" [size]="28" class="text-brand" /> }
                </span>
                <div class="min-w-0">
                  <h3 class="text-lg font-semibold">{{ a.name }}</h3>
                  <p class="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400"><lucide-icon [img]="Phone" [size]="13" /> Android{{ a.version ? ' · version ' + a.version : '' }}</p>
                </div>
              </div>
              <p class="mt-5 flex-1 text-sm leading-relaxed text-slate-500">{{ a.text }}</p>
              @if (a.notes) { <p class="mt-3 text-xs text-slate-400">Latest: {{ a.notes }}</p> }
              <div class="mt-6"><a [href]="a.apk" rel="noopener" download class="btn btn-red"><lucide-icon [img]="Down" [size]="16" /> Download APK</a></div>
            </article>
          }
        </div>

        <p rv class="mt-6 max-w-2xl text-xs leading-relaxed text-slate-400">The first time, Android asks you to allow installing from your browser or file manager: allow it, open the downloaded file and tap Install. iPhone: use the website in Safari and choose Add to Home Screen.</p>
      </div>
    </section>
  `,
})
export class AppsComponent implements OnInit {
  readonly Down = Download; readonly Phone = Smartphone;
  readonly apps = signal<AppCard[]>([
    { id: 'erpx', name: 'Red CodeX ERP', text: 'The whole company in your pocket: your own dashboard, approvals, attendance and requests. Sign in with your ERP account; fingerprint unlock is built in.',
      manifest: 'https://redspace.sgp1.cdn.digitaloceanspaces.com/redcodex/erpx-mobile/update.json',
      apk: 'https://sgp1.digitaloceanspaces.com/redspace/redcodex/erpx-mobile/erpx-v1.0.5.apk', logo: 'images/redcodex/logo-square.png', version: '1.0.5', notes: '' },
    { id: 'hrmx-sync', name: 'HRMX Sync', text: 'Face attendance for the office and the field. Register people, verify a face and punch in or out, then sync with HrmX.',
      manifest: 'https://redspace.sgp1.cdn.digitaloceanspaces.com/aenrivercruise/production/hrmx-sync/update.json',
      apk: 'https://sgp1.digitaloceanspaces.com/redspace/aenrivercruise/production/hrmx-sync/hrmx-sync-109.apk', icon: ScanFace, version: '1.2.0', notes: '' },
  ]);

  ngOnInit(): void { for (const a of this.apps()) { void this.refresh(a); } }

  private async refresh(a: AppCard): Promise<void> {
    // The website's own address first (a function reads the manifest on the server, so no CORS is needed), then the file host itself.
    for (const url of [`api/app/${a.id}`, a.manifest]) {
      try {
        const res = await fetch(`${url}?_=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) { continue; }
        const m = (await res.json()) as Manifest;
        // Only a download from the file host is trusted.
        if (!m.apkUrl || !/^https:\/\/([\w-]+\.)*digitaloceanspaces\.com\//.test(m.apkUrl)) { continue; }
        this.apps.update((list) => list.map((x) => (x.id === a.id ? { ...x, apk: m.apkUrl!, version: m.versionName || x.version, notes: (m.notes || '').slice(0, 140) } : x)));
        return;
      } catch { /* try the next one; the built-in link stays if none works */ }
    }
  }
}
