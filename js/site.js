// KiwiSums — shared site behaviour
(function(){
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if(toggle && links){
    toggle.addEventListener('click', function(){
      links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', links.classList.contains('open'));
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(function(item){
    var btn = item.querySelector('.faq-q');
    if(!btn) return;
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function(){
      var wasOpen = item.classList.contains('open');
      item.closest('.faq-list').querySelectorAll('.faq-item').forEach(function(i){
        i.classList.remove('open');
        var b = i.querySelector('.faq-q');
        if(b) b.setAttribute('aria-expanded', 'false');
      });
      if(!wasOpen){
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
  // Primary nav dropdown groups (Housing, Car, etc.)
  function closeAllGroups(){
    document.querySelectorAll('.nav-group.open').forEach(function(g){
      g.classList.remove('open');
      var b = g.querySelector('.nav-group-btn');
      if(b) b.setAttribute('aria-expanded', 'false');
    });
  }
  document.querySelectorAll('.nav-group-btn').forEach(function(btn){
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      var group = btn.closest('.nav-group');
      var wasOpen = group.classList.contains('open');
      closeAllGroups();
      if(!wasOpen){
        group.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
  document.addEventListener('click', closeAllGroups);
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeAllGroups();
  });

  // Number inputs: replace native up/down spinner with -/+ stepper buttons
  document.querySelectorAll('.field input[type=number]').forEach(function(input){
    if(input.closest('.number-stepper')) return;
    var wrap = document.createElement('div');
    wrap.className = 'number-stepper';
    input.parentNode.insertBefore(wrap, input);

    var minusBtn = document.createElement('button');
    minusBtn.type = 'button';
    minusBtn.className = 'num-step num-step-minus';
    minusBtn.setAttribute('aria-label', 'Decrease');
    minusBtn.textContent = '−';

    var plusBtn = document.createElement('button');
    plusBtn.type = 'button';
    plusBtn.className = 'num-step num-step-plus';
    plusBtn.setAttribute('aria-label', 'Increase');
    plusBtn.textContent = '+';

    wrap.appendChild(input);
    wrap.appendChild(minusBtn);
    wrap.appendChild(plusBtn);

    function stepValue(dir){
      var stepAmt = parseFloat(input.step) || 1;
      var minVal = input.min !== '' ? parseFloat(input.min) : -Infinity;
      var maxVal = input.max !== '' ? parseFloat(input.max) : Infinity;
      var cur = parseFloat(input.value);
      if(!isFinite(cur)) cur = 0;
      var next = cur + dir * stepAmt;
      next = Math.min(maxVal, Math.max(minVal, next));
      next = Math.round(next * 1e6) / 1e6;
      input.value = next;
      input.dispatchEvent(new Event('input', { bubbles:true }));
      input.dispatchEvent(new Event('change', { bubbles:true }));
    }
    minusBtn.addEventListener('click', function(){ stepValue(-1); });
    plusBtn.addEventListener('click', function(){ stepValue(1); });
  });

  // ---- Micro-animations (skipped entirely for prefers-reduced-motion) ----
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll reveal: cards and panels fade up gently as they enter the viewport.
  // Classes are added by JS only, so nothing is hidden when JS is unavailable.
  if(!reduceMotion && 'IntersectionObserver' in window){
    var revealSelector = '.calc-card, .panel, .receipt, .chart-card, .insight-panel, .compare-card, .compare-summary, .meth-item, .source-item, .assumptions-panel, .compare-table-wrap';
    var revealEls = Array.prototype.slice.call(document.querySelectorAll(revealSelector));
    var staggerIndex = 0;
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          var delay = Math.min(staggerIndex++ % 6, 5) * 45;
          entry.target.style.transitionDelay = delay + 'ms';
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    revealEls.forEach(function(el){
      var rect = el.getBoundingClientRect();
      // Elements already well within the first viewport appear instantly
      if(rect.top < window.innerHeight * 0.85){ return; }
      el.classList.add('will-reveal');
      io.observe(el);
    });
  }

  // Result pulse: when a headline number changes, give it a soft scale pulse.
  if(!reduceMotion && 'MutationObserver' in window){
    document.querySelectorAll('.receipt-total').forEach(function(el){
      var pulseTimer = null;
      var mo = new MutationObserver(function(){
        if(pulseTimer) return; // throttle rapid input
        el.classList.remove('updating');
        void el.offsetWidth; // restart animation
        el.classList.add('updating');
        pulseTimer = setTimeout(function(){
          el.classList.remove('updating');
          pulseTimer = null;
        }, 360);
      });
      mo.observe(el, { childList:true, characterData:true, subtree:true });
    });
  }

  // Dark mode toggle — delegated so it works for any number of instances
  // (e.g. header + mobile menu), regardless of when they're added to the DOM.
  document.addEventListener('click', function(e){
    if(!e.target.closest('.theme-toggle')) return;
    var current = document.documentElement.getAttribute('data-theme') || 'light';
    var next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('kiwisums_theme', next); } catch(e){}
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
  });
})();

// ---- Formatting helpers used by every calculator page ----
const NZD = new Intl.NumberFormat('en-NZ', { style:'currency', currency:'NZD', maximumFractionDigits:0 });
const NZD2 = new Intl.NumberFormat('en-NZ', { style:'currency', currency:'NZD', maximumFractionDigits:2 });
function fmt(n){ if(!isFinite(n)) return '$0'; return NZD.format(Math.round(n)); }
function fmt2(n){ if(!isFinite(n)) return '$0.00'; return NZD2.format(n); }
function pct(n, dp){ dp = dp===undefined?1:dp; return (isFinite(n)?n:0).toFixed(dp) + '%'; }
function clamp(n,min,max){ return Math.max(min, Math.min(max, n)); }
function num(v, fallback){ const n = parseFloat(v); return isFinite(n) ? n : (fallback||0); }

// ---- Shared line-chart renderer (theme-aware SVG, 1-4 series, optional vertical marker, hover tooltip) ----
// Usage: renderLineChart(containerEl, config)
// config: { years:[...], series:[{label,color,darkColor,values:[...],width}], yFormatFn, xLabelFn, xLabelEvery, markerIndex, step }
function renderLineChart(container, config){
  const W = 680, H = 300, padL = 58, padR = 16, padT = 16, padB = 32;
  const chartW = W - padL - padR, chartH = H - padT - padB;
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  const gridColor = dark ? '#2A332C' : '#E4E9E1';
  const textColor = dark ? '#8A9A8F' : '#8A968D';

  const years = config.years;
  const n = years.length - 1;
  const yFormatFn = config.yFormatFn || fmt;
  const xLabelFn = config.xLabelFn || function(y){ return y; };
  const step = config.step || 5000;

  const allVals = config.series.reduce((a,s)=>a.concat(s.values), []);
  const maxVal = Math.max.apply(null, allVals.concat([1]));
  const minVal = config.niceMin !== undefined ? config.niceMin : Math.min(0, Math.min.apply(null, allVals));
  const niceMax = config.niceMax || (Math.ceil(maxVal/step)*step) || step;

  function xPos(i){ return padL + (n>0 ? i/n : 0) * chartW; }
  function yPos(val){ return padT + chartH - ((val-minVal)/(niceMax-minVal)) * chartH; }

  let gridlines = '';
  for(let i=0;i<=4;i++){
    const val = minVal + (niceMax-minVal)*i/4;
    const y = yPos(val);
    gridlines += `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${W-padR}" y2="${y.toFixed(1)}" stroke="${gridColor}" stroke-width="1"/>`;
    gridlines += `<text x="${padL-8}" y="${(y+4).toFixed(1)}" text-anchor="end" font-size="11" fill="${textColor}" font-family="Inter,sans-serif">${yFormatFn(val)}</text>`;
  }

  let xlabels = '';
  years.forEach((yr,i)=>{
    if(config.xLabelEvery && i % config.xLabelEvery !== 0 && i !== n) return;
    xlabels += `<text x="${xPos(i).toFixed(1)}" y="${H-8}" text-anchor="middle" font-size="11" fill="${textColor}" font-family="Inter,sans-serif">${xLabelFn(yr)}</text>`;
  });

  let markerLine = '';
  if(config.markerIndex != null && config.markerIndex <= n && config.markerIndex >= 0){
    const x = xPos(config.markerIndex).toFixed(1);
    markerLine = `<line x1="${x}" y1="${padT}" x2="${x}" y2="${padT+chartH}" stroke="${textColor}" stroke-width="1.5" stroke-dasharray="4,3"/>`;
  }

  let paths = '', dots = '', hoverDots = '';
  config.series.forEach((s,si)=>{
    const color = dark && s.darkColor ? s.darkColor : s.color;
    const width = s.width || 2.5;
    const pathD = s.values.map((v,i)=>(i===0?'M':'L')+xPos(i).toFixed(1)+','+yPos(v).toFixed(1)).join(' ');
    paths += `<path d="${pathD}" fill="none" stroke="${color}" stroke-width="${width}"/>`;
    dots += s.values.map((v,i)=>{
      const cx=xPos(i).toFixed(1), cy=yPos(v).toFixed(1);
      return `<circle cx="${cx}" cy="${cy}" r="3" fill="${color}" opacity="0.85"/>`;
    }).join('');
    hoverDots += `<circle class="chart-hover-dot" data-series="${si}" r="5" fill="${color}" stroke="${dark?'#101512':'#fff'}" stroke-width="2" opacity="0"/>`;
  });

  const svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    ${gridlines}
    ${markerLine}
    ${paths}
    ${dots}
    <line class="chart-hover-line" x1="0" y1="${padT}" x2="0" y2="${padT+chartH}" stroke="${textColor}" stroke-width="1" opacity="0"/>
    ${hoverDots}
    ${xlabels}
    <rect class="chart-hit-area" x="${padL}" y="0" width="${chartW}" height="${H}" fill="transparent"/>
  </svg><div class="chart-tooltip"></div>`;

  container.innerHTML = svg;

  const svgEl = container.querySelector('svg');
  const hitArea = container.querySelector('.chart-hit-area');
  const hoverLine = container.querySelector('.chart-hover-line');
  const hoverDotEls = container.querySelectorAll('.chart-hover-dot');
  const tooltipEl = container.querySelector('.chart-tooltip');

  function showAt(clientX, clientY){
    const rect = svgEl.getBoundingClientRect();
    if(rect.width===0) return;
    const svgX = (clientX - rect.left) * (W/rect.width);
    let idx = Math.round((svgX - padL) / chartW * n);
    idx = clamp(idx, 0, n);

    const px = xPos(idx);
    hoverLine.setAttribute('x1', px); hoverLine.setAttribute('x2', px); hoverLine.setAttribute('opacity', '1');

    let rowsHtml = '';
    config.series.forEach((s,si)=>{
      const v = s.values[idx];
      const color = dark && s.darkColor ? s.darkColor : s.color;
      hoverDotEls[si].setAttribute('cx', px);
      hoverDotEls[si].setAttribute('cy', yPos(v).toFixed(1));
      hoverDotEls[si].setAttribute('opacity', '1');
      rowsHtml += `<div class="chart-tooltip-row"><span class="chart-tooltip-swatch" style="background:${color};"></span>${s.label}: <strong>${yFormatFn(v)}</strong></div>`;
    });
    tooltipEl.innerHTML = `<div class="chart-tooltip-x">${xLabelFn(years[idx])}</div>${rowsHtml}`;
    tooltipEl.classList.add('visible');

    const containerRect = container.getBoundingClientRect();
    const cursorLeft = clientX - containerRect.left;
    const tipWidth = tooltipEl.offsetWidth || 150;
    let left = cursorLeft + 14;
    if(left + tipWidth > containerRect.width) left = cursorLeft - tipWidth - 14;
    tooltipEl.style.left = Math.max(0, left) + 'px';
    tooltipEl.style.top = '6px';
  }

  function hide(){
    hoverLine.setAttribute('opacity', '0');
    hoverDotEls.forEach(d=>d.setAttribute('opacity','0'));
    tooltipEl.classList.remove('visible');
  }

  hitArea.addEventListener('mousemove', function(e){ showAt(e.clientX, e.clientY); });
  hitArea.addEventListener('mouseleave', hide);
  hitArea.addEventListener('touchstart', function(e){ if(e.touches[0]) showAt(e.touches[0].clientX, e.touches[0].clientY); }, {passive:true});
  hitArea.addEventListener('touchmove', function(e){ if(e.touches[0]){ showAt(e.touches[0].clientX, e.touches[0].clientY); e.preventDefault(); } }, {passive:false});
  hitArea.addEventListener('touchend', hide);
}
