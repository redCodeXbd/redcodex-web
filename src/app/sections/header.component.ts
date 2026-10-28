import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { ChevronDown, LucideAngularModule, Menu, X } from 'lucide-angular';
import { appUrl } from '../config';
import { SiteService } from '../site.service';
import { LanguageSwitchComponent } from '../i18n/language-switch.component';
import { LINKS, MENU } from '../content';

/** White bar. From xl up: two dropdowns (open on hover or click, close on Escape or an outside click) and two links. Below that a burger opens a stacked menu. */
@Component({
  selector: 'rcx-header',
  standalone: true,
  imports: [LucideAngularModule, LanguageSwitchComponent],
  template: `
    <header class="sticky top-0 z-40 border-b transition-colors duration-300" [class]="scrolled() || mobile() ? 'border-black/[0.06] bg-white/80 backdrop-blur-xl backdrop-saturate-150' : 'border-transparent bg-white'">
      <div class="wrap flex h-16 items-center justify-between gap-4">
        <a href="#top" aria-label="Red Codex home" class="flex-none"><img [src]="site.content().brandLogo" alt="Red Codex" class="h-8 w-auto" /></a>

        <nav class="hidden items-center gap-1 text-sm text-slate-600 xl:flex" aria-label="Main">
          @for (g of menu; track g.label) {
            <div class="relative" (mouseenter)="open.set(g.label)" (mouseleave)="open.set(null)">
              <button type="button" class="flex items-center gap-1 rounded-full px-3.5 py-2 transition hover:text-ink" [class.text-ink]="open() === g.label" [attr.aria-expanded]="open() === g.label" aria-haspopup="true" (click)="open.set(open() === g.label ? null : g.label)">
                {{ g.label }}<lucide-icon [img]="Down" [size]="14" class="transition" [class.rotate-180]="open() === g.label" />
              </button>
              @if (open() === g.label) {
                <div class="pop absolute left-0 top-full w-[22rem] pt-2">
                  <ul class="rounded-2xl bg-white p-1.5 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.18)] ring-1 ring-black/[0.06]" role="menu">
                    @for (i of g.items; track i.label) {
                      <li role="none"><a role="menuitem" [href]="i.href" [attr.target]="i.href.startsWith('http') ? '_blank' : null" rel="noopener" class="group flex gap-3 rounded-xl p-2.5 transition hover:bg-soft" (click)="open.set(null)">
                        <span class="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-soft text-slate-500 transition group-hover:bg-brand-tint group-hover:text-brand"><lucide-icon [img]="i.icon" [size]="17" /></span>
                        <span><span class="block font-medium text-ink">{{ i.label }}</span><span class="block text-xs font-normal text-slate-500">{{ i.text }}</span></span>
                      </a></li>
                    }
                  </ul>
                </div>
              }
            </div>
          }
          @for (l of links; track l.label) { <a [href]="l.href" class="rounded-full px-3.5 py-2 transition hover:text-ink">{{ l.label }}</a> }
        </nav>

        <div class="flex items-center gap-3 whitespace-nowrap sm:gap-4">
          <rcx-lang />
          <a [href]="app" data-sign-in class="hidden text-sm text-slate-600 transition hover:text-ink sm:inline">Sign in</a>
          <a href="#demo" class="btn btn-red hidden !py-2 sm:inline-flex">Request a demo</a>
          <button type="button" class="flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-black/10 xl:hidden" [attr.aria-expanded]="mobile()" aria-label="Menu" (click)="mobile.set(!mobile())">
            <lucide-icon [img]="mobile() ? X : Menu" [size]="20" />
          </button>
        </div>
      </div>

      @if (mobile()) {
        <nav class="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-black/5 bg-white px-4 pb-6 pt-3 xl:hidden" aria-label="Mobile">
          @for (g of menu; track g.label) {
            <div class="py-2">
              <div class="px-1 pb-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">{{ g.label }}</div>
              @for (i of g.items; track i.label) {
                <a [href]="i.href" [attr.target]="i.href.startsWith('http') ? '_blank' : null" rel="noopener" class="flex items-center gap-3 rounded-xl p-2 active:bg-soft" (click)="mobile.set(false)">
                  <span class="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-brand-tint text-brand"><lucide-icon [img]="i.icon" [size]="18" /></span>
                  <span><span class="block font-semibold">{{ i.label }}</span><span class="block text-xs text-slate-500">{{ i.text }}</span></span>
                </a>
              }
            </div>
          }
          <div class="mt-1 border-t border-black/5 pt-2">
            @for (l of links; track l.label) { <a [href]="l.href" class="block rounded-xl px-1 py-3 text-base font-medium" (click)="mobile.set(false)">{{ l.label }}</a> }
          </div>
          <div class="mt-3 grid grid-cols-2 gap-3">
            <a [href]="app" data-sign-in class="btn btn-line">Sign in</a>
            <a href="#demo" class="btn btn-red" (click)="mobile.set(false)">Request a demo</a>
          </div>
        </nav>
      }
    </header>
  `,
})
export class HeaderComponent {
  readonly menu = MENU; readonly links = LINKS; readonly app = appUrl();
  readonly Menu = Menu; readonly X = X; readonly Down = ChevronDown;
  open = signal<string | null>(null); mobile = signal(false); scrolled = signal(false);

  @HostListener('window:scroll') onScroll(): void { this.scrolled.set(window.scrollY > 8); }
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly site = inject(SiteService);

  @HostListener('document:keydown.escape') onEsc(): void { this.open.set(null); this.mobile.set(false); }
  @HostListener('document:click', ['$event']) onDoc(e: Event): void { if (!this.host.nativeElement.contains(e.target as Node)) { this.open.set(null); } }
}
