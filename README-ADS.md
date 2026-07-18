# Setting up Google AdSense on KiwiSums

The site is now ad-ready: every page has a labeled, layout-stable placeholder
where an ad will appear once you're approved. Nothing will show yet — the
placeholders are just visible dashed boxes so you can see where ads will sit.

## What's already in place

- **Ad slots**: a banner slot near the top of every page, and an in-content
  slot between the FAQ and the "keep going" links. Both reserve their final
  size in advance so ads won't cause the page to jump around once they load.
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
For each `<div class="ad-slot">` placeholder in the HTML, replace its
contents with the `<ins class="adsbygoogle">…</ins>` snippet AdSense gives
you for that unit, for example:

```html
<div class="ad-wrap wrap">
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-1234567890123456"
       data-ad-slot="1234567890"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
  <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
</div>
```

Do this for each of the 14 ad slots across the 7 pages (banner + in-content
on each of the 6 calculators, plus banner + in-content on the homepage).

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
