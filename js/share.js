(function(){
  function drawRoundedRect(ctx, x, y, w, h, r){
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.arcTo(x+w, y, x+w, y+h, r);
    ctx.arcTo(x+w, y+h, x, y+h, r);
    ctx.arcTo(x, y+h, x, y, r);
    ctx.arcTo(x, y, x+w, y, r);
    ctx.closePath();
  }

  function loadImage(src){
    return new Promise(function(resolve){
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = function(){ resolve(img); };
      img.onerror = function(){ resolve(null); };
      img.src = src;
    });
  }

  async function renderCard(opts){
    const W = 1200, H = 430;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#F7F9F4');
    grad.addColorStop(1, '#E4F5EB');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.textBaseline = 'alphabetic';

    // Top-right brand mark, vertically aligned with the title row
    ctx.textAlign = 'right';
    ctx.font = '700 36px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillStyle = '#1F7F51';
    ctx.fillText('KiwiSums', W-64, 83);
    ctx.font = '400 25px "Inter", Arial, sans-serif';
    ctx.fillStyle = '#7C8579';
    ctx.fillText('kiwisums.com', W-64, 115);
    ctx.textAlign = 'left';

    const iconSize = 96, iconX = 64, iconY = 40;
    const iconImg = opts.iconImage ? await loadImage(opts.iconImage) : null;
    if(iconImg){
      const scale = Math.min(iconSize/iconImg.width, iconSize/iconImg.height);
      const dw = iconImg.width*scale, dh = iconImg.height*scale;
      ctx.drawImage(iconImg, iconX+(iconSize-dw)/2, iconY+(iconSize-dh)/2, dw, dh);
    } else {
      ctx.font = '64px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
      ctx.fillText(opts.icon || '💰', iconX, iconY+76);
    }

    ctx.font = '600 51px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillStyle = '#1E2A22';
    ctx.fillText(opts.title, iconX+iconSize+22, iconY+66);

    let chipX = 64, chipY = 176, chipH = 69;
    ctx.font = '600 36px "Inter", Arial, sans-serif';
    (opts.chips || []).forEach(function(chip){
      const padX = 33;
      const textW = ctx.measureText(chip).width;
      const chipW = textW + padX*2;
      ctx.fillStyle = '#FFFFFF';
      drawRoundedRect(ctx, chipX, chipY, chipW, chipH, chipH/2);
      ctx.fill();
      ctx.fillStyle = '#1E2A22';
      ctx.fillText(chip, chipX+padX, chipY+chipH/2+13);
      chipX += chipW + 16;
    });

    ctx.font = '800 84px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillStyle = '#1F7F51';
    ctx.fillText(opts.resultValue, 64, 340);

    if(opts.resultLabel){
      ctx.font = '500 34px "Inter", Arial, sans-serif';
      ctx.fillStyle = '#48544A';
      ctx.fillText(opts.resultLabel, 66, 392);
    }

    return canvas;
  }

  async function openSharePanel(opts){
    const canvas = await renderCard(opts);
    const dataUrl = canvas.toDataURL('image/png');
    const shareUrl = opts.url || location.href;
    const shareText = opts.title + ': ' + opts.resultValue;

    const ICONS = {
      native: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>',
      facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z"></path></svg>',
      whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z"></path><path d="M12.02 2C6.5 2 2.03 6.47 2.03 12c0 1.87.5 3.62 1.4 5.13L2 22l4.99-1.3A9.96 9.96 0 0 0 12.02 22C17.55 22 22 17.53 22 12S17.55 2 12.02 2Zm0 18.1c-1.66 0-3.2-.46-4.53-1.26l-.32-.19-3 .78.8-2.92-.21-.3A8.09 8.09 0 0 1 3.9 12c0-4.48 3.65-8.12 8.13-8.12A8.1 8.1 0 0 1 20.14 12c0 4.48-3.65 8.1-8.12 8.1Z"></path></svg>',
      messenger: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.15 2 11.25c0 2.9 1.44 5.49 3.7 7.19V22l3.38-1.86c.9.25 1.87.38 2.92.38 5.52 0 10-4.15 10-9.27C22 6.15 17.52 2 12 2Zm1.02 12.48-2.55-2.72-4.98 2.72 5.48-5.82 2.61 2.72 4.9-2.72-5.46 5.82Z"></path></svg>',
      copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>'
    };

    const overlay = document.createElement('div');
    overlay.className = 'share-overlay';
    overlay.innerHTML =
      '<div class="share-modal" role="dialog" aria-modal="true" aria-label="Share your result">' +
        '<button type="button" class="share-close" aria-label="Close">&times;</button>' +
        '<img class="share-card-preview" alt="Shareable result card">' +
        '<div class="share-actions">' +
          '<button type="button" class="sharepanel-btn sharepanel-native" data-action="native" hidden>' + ICONS.native + '<span>Share…</span></button>' +
          '<button type="button" class="sharepanel-btn sharepanel-fb" data-action="facebook">' + ICONS.facebook + '<span>Facebook</span></button>' +
          '<button type="button" class="sharepanel-btn sharepanel-wa" data-action="whatsapp">' + ICONS.whatsapp + '<span>WhatsApp</span></button>' +
          '<button type="button" class="sharepanel-btn sharepanel-msg" data-action="messenger">' + ICONS.messenger + '<span>Messenger</span></button>' +
          '<button type="button" class="sharepanel-btn sharepanel-copy" data-action="copy">' + ICONS.copy + '<span>Copy link</span></button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const imgEl = overlay.querySelector('.share-card-preview');
    imgEl.src = dataUrl;

    function close(){
      overlay.remove();
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e){ if(e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);
    overlay.addEventListener('click', function(e){ if(e.target === overlay) close(); });
    overlay.querySelector('.share-close').addEventListener('click', close);

    const nativeBtn = overlay.querySelector('.sharepanel-native');
    if(navigator.share){
      nativeBtn.hidden = false;
      nativeBtn.addEventListener('click', function(){
        canvas.toBlob(function(blob){
          const file = blob ? new File([blob], 'kiwisums-result.png', { type: 'image/png' }) : null;
          const shareData = { title: opts.title, text: shareText, url: shareUrl };
          if(file && navigator.canShare && navigator.canShare({ files: [file] })){
            shareData.files = [file];
          }
          navigator.share(shareData).catch(function(){});
        }, 'image/png');
      });
    }

    overlay.querySelectorAll('.sharepanel-btn[data-action]').forEach(function(btn){
      if(btn === nativeBtn) return;
      const label = btn.querySelector('span');
      btn.addEventListener('click', function(){
        const action = btn.dataset.action;
        if(action === 'facebook'){
          window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shareUrl), '_blank', 'noopener,width=600,height=520');
        } else if(action === 'whatsapp'){
          window.open('https://wa.me/?text=' + encodeURIComponent(shareText + ' ' + shareUrl), '_blank', 'noopener');
        } else if(action === 'messenger'){
          window.open('fb-messenger://share/?link=' + encodeURIComponent(shareUrl), '_blank');
        } else if(action === 'copy'){
          const done = function(){
            const original = label.textContent;
            label.textContent = 'Link copied!';
            setTimeout(function(){ label.textContent = original; }, 2000);
          };
          if(navigator.clipboard && navigator.clipboard.writeText){
            navigator.clipboard.writeText(shareUrl).then(done).catch(function(){ prompt('Copy this link:', shareUrl); });
          } else {
            prompt('Copy this link:', shareUrl);
          }
        }
      });
    });
  }

  window.KSShare = { openSharePanel: openSharePanel, renderCard: renderCard };
})();
