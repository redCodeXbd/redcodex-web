import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Mail, MapPin, Phone, LucideAngularModule } from 'lucide-angular';
import { ApiService, DemoForm } from '../api.service';
import { INTERESTS, SITE, TEAM_SIZES } from '../content';
import { RevealDirective } from '../reveal.directive';

@Component({
  selector: 'rcx-contact',
  standalone: true,
  imports: [FormsModule, LucideAngularModule, RevealDirective],
  template: `
    <section id="demo" class="bg-soft py-20 lg:py-32" aria-label="Request a demo">
      <div class="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-5">
        <div rv class="lg:col-span-2">
          <span class="eyebrow">Contact</span>
          <h2 class="mt-3 text-3xl font-semibold sm:text-4xl">See it with your own business in mind</h2>
          <p class="mt-4 text-lg text-slate-600">A free 30 minute demo, online or at your office. We will show you what fits.</p>
          <ul class="mt-8 space-y-5">
            <li class="flex gap-4"><span class="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-brand-tint text-brand"><lucide-icon [img]="Phone" [size]="18" /></span><span><span class="block text-sm text-slate-500">Phone</span><a [href]="'tel:' + tel" class="font-medium hover:text-brand">{{ site.phone }}</a></span></li>
            <li class="flex gap-4"><span class="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-brand-tint text-brand"><lucide-icon [img]="Mail" [size]="18" /></span><span><span class="block text-sm text-slate-500">Email</span><a [href]="'mailto:' + site.email" class="font-medium hover:text-brand">{{ site.email }}</a></span></li>
            <li class="flex gap-4"><span class="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-brand-tint text-brand"><lucide-icon [img]="Pin" [size]="18" /></span><span><span class="block text-sm text-slate-500">Office</span><span class="block font-medium">{{ site.address }}</span><a [href]="map" target="_blank" rel="noopener" class="text-sm font-medium text-brand hover:underline">Open in Google Maps</a></span></li>
          </ul>
        </div>
        <div rv class="lg:col-span-3">
          @if (done(); as n) {
            <div class="card p-8" role="status">
              <span class="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl text-green-700">✓</span>
              <h3 class="mt-4 text-2xl font-semibold">Thank you. We have your request.</h3>
              <p class="mt-2 text-slate-600">Your reference is <b>{{ n }}</b>. We will contact you soon. In a hurry? Call {{ site.phone }}.</p>
            </div>
          } @else {
            <form class="card p-6 sm:p-8" (ngSubmit)="send()" aria-label="Demo request form">
              <h3 class="text-xl font-semibold">Request a demo</h3>
              <p class="text-sm text-slate-500">Fields marked * are needed.</p>
              <div class="mt-5 grid gap-4 sm:grid-cols-2">
                <label class="block sm:col-span-2"><span class="text-sm font-medium">I am interested in *</span><select class="input" name="interest" [(ngModel)]="interest">@for (o of interests; track o) { <option [value]="o">{{ o }}</option> }</select></label>
                <label class="block"><span class="text-sm font-medium">Your name *</span><input class="input" name="name" autocomplete="name" [(ngModel)]="f.name" /></label>
                <label class="block"><span class="text-sm font-medium">Company *</span><input class="input" name="company" autocomplete="organization" [(ngModel)]="f.company" /></label>
                <label class="block"><span class="text-sm font-medium">Work email *</span><input type="email" class="input" name="email" autocomplete="email" [(ngModel)]="f.email" /></label>
                <label class="block"><span class="text-sm font-medium">Phone *</span><input type="tel" class="input" name="phone" autocomplete="tel" [(ngModel)]="f.phone" /></label>
                <label class="block"><span class="text-sm font-medium">People in your company *</span><select class="input" name="size" [(ngModel)]="f.teamSize"><option value="">Choose</option>@for (t of sizes; track t) { <option [value]="t">{{ t }}</option> }</select></label>
                <label class="block"><span class="text-sm font-medium">Kind of business</span><input class="input" name="industry" [(ngModel)]="f.industry" /></label>
                <label class="block sm:col-span-2"><span class="text-sm font-medium">Tell us what you need</span><textarea rows="3" class="input !h-auto py-2" name="message" [(ngModel)]="f.message"></textarea></label>
              </div>
              <input type="text" class="absolute -left-[9999px] h-0 w-0 opacity-0" tabindex="-1" autocomplete="off" aria-hidden="true" name="website" [(ngModel)]="trap" />
              @if (error()) { <p class="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{{ error() }}</p> }
              <button type="submit" class="btn btn-red mt-5 !h-12 w-full disabled:opacity-60" [disabled]="sending()">{{ sending() ? 'Sending…' : 'Send my request' }}</button>
              <p class="mt-3 text-center text-xs text-slate-500">We use these details only to contact you.</p>
            </form>
          }
        </div>
      </div>
    </section>
  `,
})
export class ContactComponent {
  private api = inject(ApiService);
  readonly site = SITE; readonly interests = INTERESTS; readonly sizes = TEAM_SIZES; readonly Phone = Phone; readonly Mail = Mail; readonly Pin = MapPin;
  readonly tel = SITE.phone.replace(/[^\d+]/g, '');
  readonly map = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(SITE.address);
  f: DemoForm = { name: '', company: '', email: '', phone: '', message: '', role: '', industry: '', teamSize: '', interests: [] };
  interest = INTERESTS[0]; trap = '';
  error = signal(''); sending = signal(false); done = signal('');

  async send(): Promise<void> {
    const f = this.f;
    if (this.trap) { this.done.set('RCX'); return; } // a bot filled the hidden field: pretend it worked
    if (!f.name.trim() || !f.company.trim() || !f.phone.trim() || !f.teamSize) { this.error.set('Please fill in all the fields marked *.'); return; }
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) { this.error.set('Please enter a valid email address.'); return; }
    this.error.set(''); this.sending.set(true);
    try { this.done.set((await this.api.submitDemo({ ...f, interests: [this.interest] })).number); }
    catch (e) { this.error.set((e as Error).message || 'The request could not be sent. Please call us instead.'); }
    finally { this.sending.set(false); }
  }
}
