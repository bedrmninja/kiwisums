# Setting up Google AdSense on KiwiSums

The site is ad-ready: every page has a labeled, layout-stable slot where a
real ad will appear once you're approved. Each slot currently shows a mock
ad (a plain grey "Example Co." placeholder card, clearly labelled as not a
real advertiser) so you can preview how ads sit in the layout — nothing here
is a real or paying ad, and none of it is clickable to anywhere.

## What's already in place

- **Ad slots**: a banner slot, and an in-content slot between the FAQ and
  the "keep going" links (most calculator/article pages have both; the
  homepage has only the in-content one). Both reserve their final size in
  advance so ads won't cause the page to jump around once they load — the
  mock ad fills that same reserved box, so the real ad will drop in at
  exactly the same size with no layout shift.
- **Privacy policy page** (`privacy-policy.html`) — AdSense requires this
  before it will approve any site. **You must edit the bracketed placeholders**
  in that file (`[YOUR CONTACT EMAIL]`, `[DATE]`, analytics tool name) before
  publishing — it's a starting template, not a finished legal document.
- **`ads.txt`** at the site root — required by Google to confirm you're an
  authorised seller of ad space on your own domain.
- A commented-out AdSense script tag in the `<head>` of every page, ready to
  uncomment once you have a publisher ID.

## Step-by-step

**1. Publish the site with a real domain first.**
AdSense needs to crawl a live, publicly accessible site — it won't review
`localhost`. Deploy to Netlify, Vercel, GitHub Pages, or your own host, and
point your real domain at it.

**2. Finish the privacy policy.**
Open `privacy-policy.html`, fill in your contact email, the date, and which
analytics tool (if any) you're using. Delete that line if you're not running
analytics.

**3. Apply at google.com/adsense.**
Sign up, add your site's URL, and follow Google's verification step — usually
either a meta tag or the same script snippet you'll use later. Add whichever
one they give you into the `<head>` of every page (there's already a
commented placeholder there to swap in).

**4. Wait for review.**
This can take anywhere from a day to a few weeks. Google checks for original
content (you have plenty — six working calculators with real explanations),
a working privacy policy, and reasonable navigation, all of which the site
already satisfies.

**5. Once approved, get your publisher ID.**
It looks like `pub-1234567890123456`. Update:
- `ads.txt` — replace `pub-0000000000000000` with your real ID
- The AdSense `<script>` tag in every page's `<head>` — uncomment it and
  replace `ca-pub-XXXXXXXXXXXXXXXX` with `ca-pub-` + your ID

**6. Create ad units in AdSense and drop in the codes.**
For each `<div class="ad-slot">`, delete the `<div class="mock-ad">…</div>`
mock ad inside it and replace it with the `<ins class="adsbygoogle">…</ins>`
snippet AdSense gives you for that unit — the surrounding `.ad-slot` div and
its `.ad-label` "Advertisement" text stay exactly as they are, for example:

```html
<div class="ad-wrap wrap">
  <div class="ad-slot ad-banner">
    <span class="ad-label" data-i18n="common_ad">Advertisement</span>
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-1234567890123456"
         data-ad-slot="1234567890"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
    <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
  </div>
</div>
```

Every page's ad slots share this exact markup, so a single find-and-replace
across the HTML files (swap `<div class="mock-ad">...</div>` for the `<ins>`
snippet) covers the whole site in one pass rather than editing page by page.

**7. Consider Auto ads as a simpler alternative.**
Instead of manually placing units, AdSense's "Auto ads" feature can place ads
for you automatically once the base script tag is live — less control over
exact position, but zero manual slot editing. You can still keep the manual
slots above if you want guaranteed placement in the two spots that make the
most sense for a calculator site (top banner, and after the FAQ where people
have finished the main task).

## A few practical notes

- **Don't click your own ads** once they're live, even to check they're
  working — Google can suspend accounts for invalid traffic.
- **Page speed**: the AdSense script loads asynchronously, so it shouldn't
  block the calculators from working, but do a quick check with
  [PageSpeed Insights](https://pagespeed.web.dev) after going live.
- **EEA/UK visitors**: if you get meaningful traffic from Europe or the UK,
  Google will require a consent management platform (Google offers a free
  built-in one via AdSense > Privacy & messaging) before ads can serve
  personalised content to those visitors.
