/** The marketing tools that can be connected to the public website. Each loads its own script, in the visitor's browser, after consent. */
export type IntegrationId = 'meta-pixel' | 'ga4' | 'gtm' | 'google-ads' | 'tiktok' | 'linkedin' | 'clarity' | 'verify';

export interface IntegrationField { key: string; label: string; placeholder: string; pattern: RegExp; hint: string; optional?: boolean }

export interface IntegrationDef {
    id: IntegrationId;
    name: string;
    category: 'Ads' | 'Analytics' | 'Tag manager' | 'Heatmaps' | 'Site verification';
    blurb: string;
    /** What it gives the business. */
    uses: string[];
    fields: IntegrationField[];
    /** Where the data is read. */
    dashboard: { label: string; url: string };
    howTo: string;
    /** The names of the events as this platform knows them. */
    events: Partial<Record<TrackEvent, string>>;
    icon: string;
    color: string;
}

/** What the website reports. No name, email or phone of a visitor is ever sent to any platform. */
export type TrackEvent = 'page_view' | 'view_section' | 'click_sign_in' | 'click_request_demo' | 'click_phone' | 'click_whatsapp' | 'click_email' | 'select_plan' | 'lead_submit' | 'outbound_click' | 'language_switch' | 'test_event';

export const TRACK_EVENTS: { id: TrackEvent; label: string; when: string; params: string[] }[] = [
    { id: 'page_view', label: 'Page view', when: 'A page of the website opens', params: ['page', 'title'] },
    { id: 'view_section', label: 'Section viewed', when: 'A visitor scrolls to Our software, ERP, Pricing, Custom software, Sister concerns or Contact (once each)', params: ['section'] },
    { id: 'click_sign_in', label: 'Sign in clicked', when: 'The Sign in button is pressed', params: ['where'] },
    { id: 'click_request_demo', label: 'Request a demo clicked', when: 'A "Request a demo" button is pressed', params: ['where'] },
    { id: 'click_phone', label: 'Phone clicked', when: 'The phone number is pressed', params: [] },
    { id: 'click_whatsapp', label: 'WhatsApp clicked', when: 'A WhatsApp button is pressed', params: [] },
    { id: 'click_email', label: 'Email clicked', when: 'The email address is pressed', params: [] },
    { id: 'select_plan', label: 'Plan chosen', when: 'A plan\'s "Ask for a demo" button is pressed', params: ['plan'] },
    { id: 'lead_submit', label: 'Demo request sent', when: 'The demo request form is sent (the main conversion)', params: ['interest', 'team_size'] },
    { id: 'outbound_click', label: 'Outbound link', when: 'HRMX, Aen River Cruise or Encore Engineering is opened', params: ['destination'] },
    { id: 'language_switch', label: 'Language changed', when: 'The language switch is used', params: ['language'] },
    { id: 'test_event', label: 'Test event', when: 'Sent from the Sync page to check a connection', params: ['note'] },
];

const num = /^\d{8,20}$/;

export const INTEGRATIONS: IntegrationDef[] = [
    {
        id: 'meta-pixel', name: 'Meta (Facebook) Pixel', category: 'Ads', icon: 'heroicons_outline:megaphone', color: '#1877f2',
        blurb: 'Measures what people do after they click your Facebook or Instagram ad, builds audiences for retargeting, and lets Meta find more people like your demo requests.',
        uses: ['Count demo requests that came from Facebook and Instagram ads', 'Retarget people who looked at pricing but did not ask for a demo', 'Build lookalike audiences from people who asked for a demo'],
        fields: [{ key: 'pixelId', label: 'Pixel ID', placeholder: '123456789012345', pattern: num, hint: 'Events Manager > Data sources > your Pixel. 15 or 16 digits.' }],
        dashboard: { label: 'Open Meta Events Manager', url: 'https://business.facebook.com/events_manager2' },
        howTo: 'In Events Manager open your Pixel and choose "Test events" to watch events arrive live while you use the website in this browser.',
        events: { page_view: 'PageView', click_request_demo: 'InitiateCheckout', click_phone: 'Contact', click_whatsapp: 'Contact', click_email: 'Contact', select_plan: 'AddToCart', lead_submit: 'Lead', view_section: 'ViewContent', test_event: 'CustomEvent: TestEvent' },
    },
    {
        id: 'ga4', name: 'Google Analytics 4', category: 'Analytics', icon: 'heroicons_outline:chart-bar', color: '#e37400',
        blurb: 'Shows how many people visit, where they come from, which pages they read and how many ask for a demo.',
        uses: ['Visitors by source, campaign, country and device', 'Which sections people read and where they leave', 'Demo requests counted as conversions'],
        fields: [{ key: 'measurementId', label: 'Measurement ID', placeholder: 'G-XXXXXXXXXX', pattern: /^G-[A-Z0-9]{6,12}$/, hint: 'Analytics > Admin > Data streams > your web stream.' }],
        dashboard: { label: 'Open Google Analytics', url: 'https://analytics.google.com/' },
        howTo: 'In Analytics open Admin > DebugView to watch events from this browser as they happen.',
        events: { page_view: 'page_view', view_section: 'view_item', click_sign_in: 'login_click', click_request_demo: 'begin_checkout', click_phone: 'contact', click_whatsapp: 'contact', click_email: 'contact', select_plan: 'select_item', lead_submit: 'generate_lead', outbound_click: 'click', language_switch: 'language_switch', test_event: 'test_event' },
    },
    {
        id: 'gtm', name: 'Google Tag Manager', category: 'Tag manager', icon: 'heroicons_outline:tag', color: '#246fdb',
        blurb: 'One container that lets marketing add or change tags (Ads, Analytics, others) without touching the website. Every event is also pushed to the data layer.',
        uses: ['Add or remove tracking tags without a developer', 'Use the data layer events as triggers', 'Keep all tags in one place'],
        fields: [{ key: 'containerId', label: 'Container ID', placeholder: 'GTM-XXXXXXX', pattern: /^GTM-[A-Z0-9]{5,9}$/, hint: 'Tag Manager > your container (top right).' }],
        dashboard: { label: 'Open Tag Manager', url: 'https://tagmanager.google.com/' },
        howTo: 'In Tag Manager press Preview and enter this website\'s address to see every tag and data layer event.',
        events: { page_view: 'page_view', view_section: 'view_section', click_sign_in: 'click_sign_in', click_request_demo: 'click_request_demo', click_phone: 'click_phone', click_whatsapp: 'click_whatsapp', click_email: 'click_email', select_plan: 'select_plan', lead_submit: 'lead_submit', outbound_click: 'outbound_click', language_switch: 'language_switch', test_event: 'test_event' },
    },
    {
        id: 'google-ads', name: 'Google Ads conversions', category: 'Ads', icon: 'heroicons_outline:cursor-arrow-rays', color: '#4285f4',
        blurb: 'Tells Google Ads which clicks turned into a demo request, so campaigns can be judged by cost per request and can bid for more of them.',
        uses: ['Cost per demo request from search and display ads', 'Automatic bidding toward demo requests'],
        fields: [{ key: 'awId', label: 'Conversion ID', placeholder: 'AW-123456789', pattern: /^AW-\d{6,12}$/, hint: 'Google Ads > Goals > Conversions > your conversion > Tag setup.' }, { key: 'label', label: 'Conversion label', placeholder: 'AbC-D_efGhIjKlMnOpQr', pattern: /^[A-Za-z0-9_-]{6,40}$/, hint: 'The label shown with the Conversion ID.' }],
        dashboard: { label: 'Open Google Ads', url: 'https://ads.google.com/' },
        howTo: 'In Google Ads open the conversion and check that its status becomes "Recording conversions" after a test request.',
        events: { page_view: 'page_view', lead_submit: 'conversion' },
    },
    {
        id: 'tiktok', name: 'TikTok Pixel', category: 'Ads', icon: 'heroicons_outline:play-circle', color: '#111827',
        blurb: 'Measures results of TikTok ads and builds audiences from visitors.',
        uses: ['Demo requests from TikTok ads', 'Retargeting visitors on TikTok'],
        fields: [{ key: 'pixelId', label: 'Pixel code', placeholder: 'C1ABCDEFGHIJ23KLMNOP', pattern: /^[A-Z0-9]{12,24}$/, hint: 'TikTok Ads Manager > Assets > Events > Web events.' }],
        dashboard: { label: 'Open TikTok Events Manager', url: 'https://ads.tiktok.com/' },
        howTo: 'In TikTok Events Manager open "Test events" to watch events from this browser.',
        events: { page_view: 'Pageview', click_phone: 'Contact', click_whatsapp: 'Contact', click_email: 'Contact', select_plan: 'AddToCart', lead_submit: 'SubmitForm', view_section: 'ViewContent' },
    },
    {
        id: 'linkedin', name: 'LinkedIn Insight Tag', category: 'Ads', icon: 'heroicons_outline:briefcase', color: '#0a66c2',
        blurb: 'Shows the companies and job titles of people who visit, and measures LinkedIn ads aimed at business owners.',
        uses: ['Which companies and roles visit the website', 'Retargeting visitors with LinkedIn ads'],
        fields: [{ key: 'partnerId', label: 'Partner ID', placeholder: '1234567', pattern: /^\d{5,9}$/, hint: 'Campaign Manager > Analyze > Insight tag.' }],
        dashboard: { label: 'Open LinkedIn Campaign Manager', url: 'https://www.linkedin.com/campaignmanager/' },
        howTo: 'In Campaign Manager open Insight Tag and wait for the status "Active". Page views are reported; conversions are made in Campaign Manager.',
        events: { page_view: 'page view' },
    },
    {
        id: 'clarity', name: 'Microsoft Clarity', category: 'Heatmaps', icon: 'heroicons_outline:cursor-arrow-ripple', color: '#0078d4',
        blurb: 'Free heatmaps and screen recordings that show where visitors click, scroll and get stuck.',
        uses: ['Heatmaps of the home page and the form', 'Recordings of real visits', 'Find buttons nobody sees'],
        fields: [{ key: 'projectId', label: 'Project ID', placeholder: 'abcd1efg23', pattern: /^[a-z0-9]{8,12}$/, hint: 'Clarity > Settings > Overview.' }],
        dashboard: { label: 'Open Microsoft Clarity', url: 'https://clarity.microsoft.com/' },
        howTo: 'In Clarity open Recordings a few minutes after a visit.',
        events: { page_view: 'pageview', lead_submit: 'lead_submit' },
    },
    {
        id: 'verify', name: 'Site verification', category: 'Site verification', icon: 'heroicons_outline:check-badge', color: '#16a34a',
        blurb: 'Proves to Google, Meta and Bing that this website is yours, so you can use Search Console, verify the domain for ads and see search data.',
        uses: ['Google Search Console (search ranking and keywords)', 'Meta domain verification (needed for conversion events)', 'Bing Webmaster Tools'],
        fields: [
            { key: 'google', label: 'Google Search Console code', placeholder: 'content value of google-site-verification', pattern: /^[A-Za-z0-9_-]{20,80}$/, hint: 'Search Console > Settings > Ownership verification > HTML tag. Copy only the content value.', optional: true },
            { key: 'facebook', label: 'Meta domain verification code', placeholder: 'content value of facebook-domain-verification', pattern: /^[a-z0-9]{20,40}$/, hint: 'Business Settings > Brand Safety > Domains.', optional: true },
            { key: 'bing', label: 'Bing code', placeholder: 'content value of msvalidate.01', pattern: /^[A-Za-z0-9]{20,40}$/, hint: 'Bing Webmaster Tools > Verify ownership.', optional: true },
        ],
        dashboard: { label: 'Open Google Search Console', url: 'https://search.google.com/search-console' },
        howTo: 'Save the code here, open the website, then press Verify in the tool. The tags are added to every page of the website.',
        events: {},
    },
];

export function integration(id: string): IntegrationDef | undefined { return INTEGRATIONS.find((i) => i.id === id); }

/** Other online tools that help sell the platform, with what each is for. */
export interface MarketingTool { id: string; name: string; tag: 'Ads' | 'Analytics' | 'SEO' | 'Email and chat' | 'Social' | 'CRM' | 'Design' | 'Automation' | 'Trust'; free: string; what: string; why: string; url: string; connect?: IntegrationId }

export const MARKETING_TOOLS: MarketingTool[] = [
    { id: 'meta-suite', name: 'Meta Business Suite', tag: 'Social', free: 'Free', what: 'Post, schedule and answer messages for the Facebook page and Instagram in one place.', why: 'A steady page with answered messages is what people check before asking for a demo.', url: 'https://business.facebook.com/' },
    { id: 'meta-ads', name: 'Meta Ads Manager', tag: 'Ads', free: 'Pay per click', what: 'Run Facebook and Instagram ads aimed at business owners in Bangladesh, with the Pixel measuring the results.', why: 'The cheapest way to reach company owners and managers by city, job title and interest.', url: 'https://www.facebook.com/adsmanager', connect: 'meta-pixel' },
    { id: 'ga4', name: 'Google Analytics 4', tag: 'Analytics', free: 'Free', what: 'Visitors, sources, pages and conversions.', why: 'Shows which channel brings demo requests, not only visits.', url: 'https://analytics.google.com/', connect: 'ga4' },
    { id: 'gtm', name: 'Google Tag Manager', tag: 'Analytics', free: 'Free', what: 'Add and change tracking tags without changing the website.', why: 'Marketing can try a new tool the same day.', url: 'https://tagmanager.google.com/', connect: 'gtm' },
    { id: 'gsc', name: 'Google Search Console', tag: 'SEO', free: 'Free', what: 'The words people search before they reach the site, and which pages Google shows.', why: 'Finds the searches that already bring people, such as "ERP software Bangladesh".', url: 'https://search.google.com/search-console', connect: 'verify' },
    { id: 'gbp', name: 'Google Business Profile', tag: 'SEO', free: 'Free', what: 'The company listing on Google Search and Maps, with reviews, photos and a call button.', why: 'People searching for the office in Mohakhali find the phone number at once.', url: 'https://business.google.com/' },
    { id: 'gads', name: 'Google Ads', tag: 'Ads', free: 'Pay per click', what: 'Ads that appear when someone searches for ERP, HR or payroll software.', why: 'Reaches people who are already looking to buy.', url: 'https://ads.google.com/', connect: 'google-ads' },
    { id: 'linkedin', name: 'LinkedIn Campaign Manager', tag: 'Ads', free: 'Pay per click', what: 'Ads and posts aimed at owners and managers by company size and job title.', why: 'The best place to reach decision makers of larger companies.', url: 'https://www.linkedin.com/campaignmanager/', connect: 'linkedin' },
    { id: 'tiktok', name: 'TikTok Ads', tag: 'Ads', free: 'Pay per click', what: 'Short video ads that show the ERP in use.', why: 'Cheap reach for short demo clips of the dashboards.', url: 'https://ads.tiktok.com/', connect: 'tiktok' },
    { id: 'clarity', name: 'Microsoft Clarity', tag: 'Analytics', free: 'Free', what: 'Heatmaps and recordings of real visits.', why: 'Shows where the form or the pricing confuses people.', url: 'https://clarity.microsoft.com/', connect: 'clarity' },
    { id: 'wa', name: 'WhatsApp Business', tag: 'Email and chat', free: 'Free', what: 'A business profile, quick replies, labels and a catalog on WhatsApp.', why: 'In Bangladesh many leads prefer to chat first. Quick replies answer the common questions.', url: 'https://business.whatsapp.com/' },
    { id: 'brevo', name: 'Brevo (email marketing)', tag: 'Email and chat', free: 'Free plan', what: 'Send newsletters and automatic follow-up emails to leads, with open and click reports.', why: 'Mail written in Platform > Mail can be copied here for large lists.', url: 'https://www.brevo.com/' },
    { id: 'mailchimp', name: 'Mailchimp', tag: 'Email and chat', free: 'Free plan', what: 'Email campaigns, sign-up forms and simple automation.', why: 'An alternative to Brevo with ready templates.', url: 'https://mailchimp.com/' },
    { id: 'hubspot', name: 'HubSpot CRM', tag: 'CRM', free: 'Free', what: 'Keeps every lead, call and note in one place with a pipeline.', why: 'Useful once demo requests outgrow the list in Demo requests.', url: 'https://www.hubspot.com/products/crm' },
    { id: 'canva', name: 'Canva', tag: 'Design', free: 'Free plan', what: 'Posts, stories, banners and flyers from templates.', why: 'For designs beyond the banner and flyer maker in Documents.', url: 'https://www.canva.com/' },
    { id: 'bitly', name: 'Bitly', tag: 'Social', free: 'Free plan', what: 'Short links and QR codes that count clicks.', why: 'Put a short campaign link (made on the Campaign links page) on posters and in WhatsApp.', url: 'https://bitly.com/' },
    { id: 'zapier', name: 'Zapier or Make', tag: 'Automation', free: 'Free plan', what: 'Send each new demo request to Google Sheets, Slack or email automatically.', why: 'Saves copying leads by hand once a server is in place.', url: 'https://zapier.com/' },
    { id: 'seo', name: 'Ubersuggest or Ahrefs Webmaster Tools', tag: 'SEO', free: 'Free tier', what: 'Finds keywords and shows who links to the site.', why: 'Plans the words to write about on the website and blog.', url: 'https://ahrefs.com/webmaster-tools' },
    { id: 'reviews', name: 'Customer reviews', tag: 'Trust', free: 'Free', what: 'Ask happy customers for a Google or Facebook review.', why: 'Reviews and a customer story help a new visitor trust a software company.', url: 'https://support.google.com/business/answer/3474122' },
];
