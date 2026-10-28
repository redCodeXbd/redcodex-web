import { LucideIconData, Globe, Smartphone, CalendarCheck, Store, PieChart, Plug, Info, MapPin, Languages, HeartHandshake, Layers, LayoutGrid, Sparkles, Ticket, Code, Building2, Banknote, Receipt, Briefcase, Archive, Clock, Wallet, Users, BarChart3, MessageSquare, Zap, Camera, Mic, ShieldCheck, SlidersHorizontal } from 'lucide-angular';

export const SITE = {
  phone: '+880 1806 419601',
  whatsapp: '8801806419601',
  email: 'sync@redcodex.net',
  address: 'H376/A, 3rd Floor, Road 28, Mohakhali DOHS, Dhaka',
};

/** The top menu: two dropdowns and two plain links. */
export interface MenuItem { label: string; text: string; href: string; icon: LucideIconData }
export const MENU: { label: string; items: MenuItem[] }[] = [
  {
    label: 'Products', items: [
      { label: 'ErpX', text: 'Money, projects, stock and people in one place', href: '#erp', icon: LayoutGrid },
      { label: 'Electro AI', text: 'The assistant built into the ERP', href: '#electro', icon: Sparkles },
      { label: 'HrmX', text: 'Employee records, attendance and payroll', href: 'https://hrmx.redcodex.net', icon: Users },
      { label: 'Aen River Cruise', text: 'Tickets and restaurant for river cruises', href: 'https://aenrivercruise.com', icon: Ticket },
    ]
  },
  {
    label: 'Company', items: [
      { label: 'About Us', text: 'Who we are and how we work', href: '#about', icon: Info },
      { label: 'Custom software', text: 'Built around the way you work', href: '#custom', icon: Code },
      { label: 'Sister concerns', text: 'The family behind Red Codex', href: '#sisters', icon: Building2 },
    ]
  },
];
export const LINKS = [{ label: 'Pricing', href: '#pricing' }, { label: 'Contact', href: '#demo' }];

export const SLIDES = [
  { id: 'admin', role: 'Admin', title: 'Company control room', text: 'Money, projects, people and approvals at a glance.' },
  { id: 'manager', role: 'Manager', title: 'Team board', text: 'Who is in, requests to decide and projects in motion.' },
  { id: 'accountant', role: 'Accountant', title: 'Money desk', text: 'What to approve, what to pay and what to follow up.' },
  { id: 'desk', role: 'Data entry', title: 'Entry desk', text: 'Big buttons to add what you are allowed to enter.' },
  { id: 'employee', role: 'Employee', title: 'My day', text: 'Punch in, attendance, leave, payslip and loans.' },
  { id: 'client', role: 'Client', title: 'Client portal', text: 'Their own projects, progress, documents and news.' },
  { id: 'vendor', role: 'Vendor', title: 'Vendor account', text: 'Invoices, orders and payments in one statement.' },
].map((s) => ({ ...s, img: `images/erp/dash-${s.id}.jpg` }));

export const AUDIENCE = ['Contractors', 'Suppliers', 'Engineering firms', 'Restaurants', 'River cruises', 'Trading companies', 'Factories', 'Service teams', 'Retail shops', 'Agencies'];

export const PRODUCTS = [
  { name: 'Red CodeX ERP', host: 'For companies that run projects and supply work', blurb: 'One web app for company money, projects, stock and people, with approvals that follow your own rules.', points: ['Treasury, expenses and approvals', 'Projects with cost and profit', 'Inventory, attendance and payroll', 'Reports, English and Bangla'], flagship: true, href: '#erp', cta: 'Explore the ERP' },
  { name: 'HRMX', host: 'hrmx.redcodex.net', blurb: 'Human resource management for growing teams: employee records, attendance, leave and payroll in one place.', points: ['Employee records', 'Attendance and leave', 'Payroll and payslips'], flagship: false, href: 'https://hrmx.redcodex.net', cta: 'Visit HRMX' },
  { name: 'Aen River Cruise', host: 'aenrivercruise.com', blurb: 'Online ticket and restaurant management for river cruises: sell tickets online and run the restaurant on board.', points: ['Online ticket booking', 'Restaurant and menu management', 'Orders, billing and daily sales'], flagship: false, href: 'https://aenrivercruise.com', cta: 'Visit Aen River Cruise' },
];

export const ERP_FEATURES = [
  { i: Banknote, t: 'Treasury', d: 'Fund requests, organization funds and transactions, with approval steps by amount.' },
  { i: Receipt, t: 'Expenses', d: 'Enter, approve and pay costs, with a vendor account and categories.' },
  { i: Briefcase, t: 'Projects', d: 'Contract value, advance, cost and profit for every project and client.' },
  { i: Archive, t: 'Inventory', d: 'Warehouses, products, stock moves, counts and price-list import.' },
  { i: Clock, t: 'Attendance', d: 'Punches from machines and the app, shifts, rosters, holidays and bonus.' },
  { i: Wallet, t: 'Payroll', d: 'Monthly payroll, rules, online payslips and employee loans.' },
  { i: Users, t: 'Clients and vendors', d: 'Their own logins, documents shared both ways, invoices and statements.' },
  { i: BarChart3, t: 'Reports', d: 'Ten reports with charts, ready to download or share.' },
];
export const ROLES = ['Admin', 'Manager', 'Accountant', 'Data entry', 'Employee', 'Client', 'Vendor'];
export const PERKS = ['English and Bangla, switch any time', 'Roles and approval rules you set', 'Works on phone and computer', 'Every change confirmed before it is saved', 'Many businesses on one platform', 'Plans, limits and invoices built in'];

export const AI_POINTS = [
  { i: MessageSquare, t: 'Ask anything', d: 'Chat like with ChatGPT, Claude or Gemini, or ask for your business data and it finds it.' },
  { i: Zap, t: 'It does the work', d: 'Adds expenses and purchases, punches you in, asks for leave, approves requests.' },
  { i: Camera, t: 'Reads a cash memo', d: 'Snap the photo. Items, prices and the shop are filled in for you to check.' },
  { i: Mic, t: 'Speak, in Bangla too', d: 'Press the microphone and say what you need.' },
  { i: ShieldCheck, t: 'Safe by design', d: 'Follows each person\'s role and your plan, and asks before it changes anything.' },
  { i: SlidersHorizontal, t: 'Volts you control', d: 'Free volts with every plan, packs to buy, and a cap for each person.' },
];
export const CHAT = [
  { me: true, text: 'Attendance report for today' },
  { me: false, text: 'Today: 42 present (5 late), 3 absent, 2 on leave. Want the late list?' },
  { me: true, text: 'Purchased 10 pcs copper cable at 200 each from Rahman Store' },
  { me: false, text: 'I prepared the purchase: 10 cable, BDT 2,000. Check it and press Add purchase.' },
  { me: true, text: 'Write a polite reminder to a client about a late payment' },
  { me: false, text: 'Of course. “Dear Mr Rahman, I hope you are well. This is a gentle reminder that invoice 1042 is now due…”' },
];

/** What we build to order: an icon, the kind of software, and one line on what it gives a business. */
export const SERVICES = [
  { i: Globe, t: 'Web applications and portals', d: 'Internal tools and customer portals that work in any browser.' },
  { i: Smartphone, t: 'Mobile apps', d: 'Android and iPhone apps for your staff in the field or your customers.' },
  { i: CalendarCheck, t: 'Online booking and ticketing', d: 'Seats, tables, trips or appointments, sold and paid for online.' },
  { i: Store, t: 'Restaurant and shop systems', d: 'Orders, menus, counters and daily sales in one place.' },
  { i: PieChart, t: 'Dashboards and reports', d: 'The numbers you check every morning, live and on one screen.' },
  { i: Plug, t: 'Links to your other systems', d: 'Connect accounting, payment, SMS or the tools you already use.' },
];
export const STEPS = [
  { t: 'We listen', d: 'A call or visit to understand how you work today and what hurts.' },
  { t: 'Plan and quote', d: 'A clear scope, screens to look at, a timeline and a price before we start.' },
  { t: 'Build in steps', d: 'You see working software every few weeks and steer as we go.' },
  { t: 'Launch and stay', d: 'We train your team, go live with you and keep supporting it.' },
];

export const SISTERS = [
  { name: 'Encore Engineering Limited', tagline: 'encore.com.bd', blurb: 'Electrical engineering, and the first business to run on Red CodeX ERP.', logo: 'images/encore-logo.png', url: 'https://encore.com.bd', cta: 'Visit encore.com.bd' },
  { name: 'Redwan Engineering', tagline: 'Sister concern of Red Codex', blurb: 'An engineering company of the same family as Red Codex and Encore Engineering Limited.', logo: 'images/redwan-engineering.png', url: '#demo', cta: 'Get in touch' },
];

export const INTERESTS = ['Red CodeX ERP demo', 'HRMX', 'Aen River Cruise', 'Custom software', 'Something else'];
export const TEAM_SIZES = ['1 to 10', '11 to 50', '51 to 200', '201 to 500', 'More than 500'];

/** Plan modules as people read them; an unknown id shows as written. */
export const MODULE_LABELS: Record<string, string> = {
  treasury: 'Treasury', expenses: 'Expenses', clients: 'Clients', vendors: 'Vendors', projects: 'Projects', store: 'Inventory', attendance: 'Attendance',
  devices: 'Devices', payroll: 'Payroll and payslips', loans: 'Loans', requests: 'Requests', reports: 'Reports', idcards: 'ID cards', activity: 'Activity log',
  exports: 'Download and share', portals: 'Client and vendor portals', scheduling: 'Shift, holiday and bonus setup', costing: 'Cost and profit figures',
  idtemplates: 'ID card templates', emailtemplates: 'Email templates', webmail: 'Webmail', electro: 'Electro assistant',
};

export const ABOUT_VALUES = [
  { t: 'Built here, for here', d: 'We work from Dhaka with businesses in Bangladesh, so the software speaks Bangla, counts in Taka and follows how approvals really happen.' },
  { t: 'Small steps, real software', d: 'We show working screens early and often. You steer while we build, so there are no surprises at the end.' },
  { t: 'We stay after launch', d: 'The people who build your software are the people who support it, train your team and keep improving it.' },
];
export const ABOUT_FACTS = [
  { i: MapPin, t: 'Dhaka, Bangladesh', d: 'Mohakhali DOHS office' },
  { i: Layers, t: 'Ready-made and custom', d: 'ERP, HRMX, Aen River Cruise and more' },
  { i: Languages, t: 'English and Bangla', d: 'In every screen we ship' },
  { i: HeartHandshake, t: 'One family', d: 'With Encore Engineering and Redwan Engineering' },
];
