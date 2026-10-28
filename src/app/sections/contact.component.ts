import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ArrowRight, Check, LucideAngularModule, Mail, MapPin, MessageCircle, Phone } from 'lucide-angular';
import { ApiService, DemoForm } from '../api.service';
import { INTERESTS, TEAM_SIZES } from '../content';
import { MarketingService } from '../marketing/marketing.service';
import { SiteService } from '../site.service';
import { RevealDirective } from '../reveal.directive';

type Field = 'name' | 'company' | 'email' | 'phone' | 'teamSize';

/** The demo request. Choices are chips, mistakes are shown on the field itself, and it posts to the ERP backend (submitDemoRequest). */
@Component({
  selector: 'rcx-contact',
  standalone: true,
  imports: [FormsModule, LucideAngularModule, RevealDirective],
  template: `
    <section id="demo" class="section bg-soft" aria-label="Request a demo">
      <div class="wrap grid gap-16 lg:grid-cols-12">
        <div rv class="lg:col-span-5">
          <span class="eyebrow">Contact</span>
          <h2 class="h2">See it with your own business in mind</h2>
          <p class="lead">A free 30 minute demo, online or at your office. We will show you what fits.</p>
          <ul class="mt-10 divide-y divide-black/[0.06] border-y border-black/[0.06]">
            <li><a [href]="tel" class="group flex items-center gap-4 py-4"><lucide-icon [img]="Phone" [size]="17" class="text-slate-400 transition group-hover:text-brand" /><span class="flex-1"><span class="block text-xs text-slate-400">Phone</span><span class="text-sm font-medium">{{ site.phone }}</span></span></a></li>
            <li><a [href]="'mailto:' + site.email" class="group flex items-center gap-4 py-4"><lucide-icon [img]="Mail" [size]="17" class="text-slate-400 transition group-hover:text-brand" /><span class="flex-1"><span class="block text-xs text-slate-400">Email</span><span class="text-sm font-medium">{{ site.email }}</span></span></a></li>
            <li><a [href]="map" target="_blank" rel="noopener" class="group flex items-center gap-4 py-4"><lucide-icon [img]="Pin" [size]="17" class="text-slate-400 transition group-hover:text-brand" /><span class="flex-1"><span class="block text-xs text-slate-400">Office</span><span class="text-sm font-medium">{{ site.address }}</span></span></a></li>
            <li><a [href]="'https://wa.me/' + site.whatsapp" target="_blank" rel="noopener" class="group flex items-center gap-4 py-4"><lucide-icon [img]="Chat" [size]="17" class="text-slate-400 transition group-hover:text-[#25d366]" /><span class="flex-1"><span class="block text-xs text-slate-400">WhatsApp</span><span class="text-sm font-medium">Chat on WhatsApp</span></span></a></li>
          </ul>
        </div>

        <div rv [rv]="1" class="lg:col-span-7">
          @if (done(); as n) {
            <div class="flex min-h-[28rem] flex-col items-center justify-center rounded-3xl bg-white p-10 text-center hairline" role="status">
              <span class="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white"><lucide-icon [img]="Check" [size]="26" /></span>
              <h3 class="mt-6 text-2xl font-semibold">Thank you. We have your request.</h3>
              <p class="mt-2 max-w-sm text-slate-500">Your reference is <b class="text-ink" data-no-i18n>{{ n }}</b>. We will contact you soon. In a hurry? Call {{ site.phone }}.</p>
            </div>
          } @else {
            <form class="rounded-3xl bg-white p-6 hairline sm:p-9" (ngSubmit)="send()" novalidate aria-label="Demo request form">
              <fieldset>
                <legend class="text-sm font-medium">I am interested in</legend>
                <div class="mt-3 flex flex-wrap gap-2">@for (o of interests; track o) { <button type="button" class="chip" [class.on]="interest === o" [attr.aria-pressed]="interest === o" (click)="interest = o">{{ o }}</button> }</div>
              </fieldset>

              <div class="mt-8 grid gap-5 sm:grid-cols-2">
                <label class="block min-w-0"><span class="text-sm font-medium">Your name *</span><input class="field" [class.bad]="bad('name')" name="name" autocomplete="name" [(ngModel)]="f.name" (input)="clear('name')" />
                  @if (bad('name')) { <span class="mt-1 block text-xs text-red-600">Please enter your name.</span> }</label>
                <label class="block min-w-0"><span class="text-sm font-medium">Company *</span><input class="field" [class.bad]="bad('company')" name="company" autocomplete="organization" [(ngModel)]="f.company" (input)="clear('company')" />
                  @if (bad('company')) { <span class="mt-1 block text-xs text-red-600">Please enter your company.</span> }</label>
                <label class="block min-w-0"><span class="text-sm font-medium">Work email *</span><input type="email" class="field" [class.bad]="bad('email')" name="email" autocomplete="email" placeholder="you@company.com" [(ngModel)]="f.email" (input)="clear('email')" />
                  @if (bad('email')) { <span class="mt-1 block text-xs text-red-600">Please enter a valid email address.</span> }</label>
                <label class="block min-w-0"><span class="text-sm font-medium">Phone *</span><input type="tel" class="field" [class.bad]="bad('phone')" name="phone" autocomplete="tel" placeholder="+880" [(ngModel)]="f.phone" (input)="clear('phone')" />
                  @if (bad('phone')) { <span class="mt-1 block text-xs text-red-600">Please enter a phone number.</span> }</label>
              </div>

              <fieldset class="mt-7">
                <legend class="text-sm font-medium">People in your company *</legend>
                <div class="mt-3 flex flex-wrap gap-2">@for (t of sizes; track t) { <button type="button" class="chip" [class.on]="f.teamSize === t" [attr.aria-pressed]="f.teamSize === t" (click)="f.teamSize = t; clear('teamSize')">{{ t }}</button> }</div>
                @if (bad('teamSize')) { <span class="mt-2 block text-xs text-red-600">Please choose one.</span> }
              </fieldset>

              <div class="mt-7 grid gap-5">
                <label class="block min-w-0"><span class="text-sm font-medium">Kind of business</span><input class="field" name="industry" placeholder="Construction, trading, restaurant…" [(ngModel)]="f.industry" /></label>
                <label class="block min-w-0"><span class="text-sm font-medium">Tell us what you need</span><textarea rows="3" class="field !h-auto resize-none py-3" name="message" [(ngModel)]="f.message"></textarea></label>
              </div>

              <input type="text" class="absolute -left-[9999px] h-0 w-0 opacity-0" tabindex="-1" autocomplete="off" aria-hidden="true" name="website" [(ngModel)]="trap" />
              @if (error()) { <p class="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{{ error() }}</p> }
              <div class="mt-8 flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
                <p class="text-xs text-slate-400">We use these details only to contact you.</p>
                <button type="submit" class="btn btn-red w-full !py-3.5 disabled:opacity-60 sm:w-auto sm:!px-8" [disabled]="sending()">
                  @if (sending()) { <span class="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>Sending… } @else { Send my request<lucide-icon [img]="Arrow" [size]="16" class="arrow" /> }
                </button>
              </div>
            </form>
          }
        </div>
      </div>
    </section>
  `,
})
export class ContactComponent {
  private api = inject(ApiService);
  private mk = inject(MarketingService);
  private siteSvc = inject(SiteService);
  get site() { return this.siteSvc.content(); }
  get tel() { return this.siteSvc.tel(); }
  get map() { return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(this.site.address); }
  readonly interests = INTERESTS; readonly sizes = TEAM_SIZES;
  readonly Phone = Phone; readonly Mail = Mail; readonly Pin = MapPin; readonly Chat = MessageCircle; readonly Check = Check; readonly Arrow = ArrowRight;
  f: DemoForm = { name: '', company: '', email: '', phone: '', message: '', role: '', industry: '', teamSize: '', interests: [] };
  interest = INTERESTS[0]; trap = '';
  error = signal(''); sending = signal(false); done = signal('');
  private invalid = signal(new Set<Field>());
  bad = (k: Field): boolean => this.invalid().has(k);
  clear(k: Field): void { if (this.bad(k)) { const s = new Set(this.invalid()); s.delete(k); this.invalid.set(s); } }

  async send(): Promise<void> {
    const f = this.f;
    if (this.trap) { this.done.set('RCX'); return; } // a bot filled the hidden field: pretend it worked
    const missing = new Set<Field>();
    if (!f.name.trim()) { missing.add('name'); }
    if (!f.company.trim()) { missing.add('company'); }
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) { missing.add('email'); }
    if (!f.phone.trim()) { missing.add('phone'); }
    if (!f.teamSize) { missing.add('teamSize'); }
    this.invalid.set(missing);
    if (missing.size) { this.error.set('Please fill in all the fields marked *.'); return; }
    this.error.set(''); this.sending.set(true);
    try {
      this.done.set((await this.api.submitDemo({ ...f, interests: [this.interest] }, this.mk.attribution())).number);
      this.mk.track('lead_submit', { interest: this.interest, team_size: f.teamSize });
    }
    catch (e) { this.error.set((e as Error).message || 'The request could not be sent. Please call us instead.'); }
    finally { this.sending.set(false); }
  }
}
