/* INFINITY Endüstriyel — Konsept 2 */
(function () {
  'use strict';
  var WA = '905380469716';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Mobil menü */
  var toggle = $('.nav-toggle'), mob = $('.mobile-nav');
  if (toggle && mob) {
    var setMenu = function (open) {
      mob.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
      toggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
      $('.i-open', toggle).style.display = open ? 'none' : '';
      $('.i-close', toggle).style.display = open ? '' : 'none';
      document.body.style.overflow = open ? 'hidden' : '';
    };
    toggle.addEventListener('click', function () { setMenu(!mob.classList.contains('open')); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 980) setMenu(false); });
  }

  /* Başlık */
  var header = $('.site-header');
  var onScroll = function () { header.classList.toggle('is-stuck', window.scrollY > 24); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Otel kesiti: bölge seçimi */
  var atlas = $('.atlas');
  if (atlas) {
    var zones = $$('.zone', atlas), panels = $$('.zpanel', atlas), tabs = $$('.ztab', atlas);
    var svg = $('svg', atlas);
    var setZone = function (id, byUser) {
      zones.forEach(function (z) {
        var on = z.getAttribute('data-zone') === id;
        z.classList.toggle('is-active', on);
        z.setAttribute('aria-pressed', on);
      });
      panels.forEach(function (p) { p.classList.toggle('is-active', p.getAttribute('data-zone') === id); });
      tabs.forEach(function (t) {
        var on = t.getAttribute('data-zone') === id;
        t.setAttribute('aria-pressed', on);
        if (on && byUser && t.parentNode.scrollWidth > t.parentNode.clientWidth) {
          t.parentNode.scrollLeft = t.offsetLeft - 18;
        }
      });
      svg.classList.add('has-active');
      if (byUser) atlas.classList.add('touched');
    };
    zones.forEach(function (z) {
      var id = z.getAttribute('data-zone');
      z.addEventListener('click', function () { setZone(id, true); });
      z.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setZone(id, true); }
      });
    });
    tabs.forEach(function (t) {
      t.addEventListener('click', function () { setZone(t.getAttribute('data-zone'), true); });
    });
    setZone('oteller', false);
  }

  /* Departman sayfası: aktif menü */
  var dlinks = $$('.dept-nav a');
  if (dlinks.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (!e.isIntersecting) return;
        dlinks.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + e.target.id;
          a.classList.toggle('is-active', on);
          if (on) a.parentNode.parentNode.scrollLeft = a.parentNode.offsetLeft - 24;
        });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    $$('.dept').forEach(function (d) { spy.observe(d); });
  }

  /* Başlıklar: kelime maskeleri (<em> korunur) */
  var splitWords = function (el) {
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    var idx = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
            var o = document.createElement('span'), w = document.createElement('span');
            o.className = 'w'; o.setAttribute('aria-hidden', 'true');
            w.className = 'wi'; w.textContent = p; w.style.setProperty('--i', idx++);
            o.appendChild(w); frag.appendChild(o);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1) { walk(n); }
      });
    })(el);
    el.classList.add('spl');
  };
  var heads = $$('h1, .statement h2, .gal-head h2, .ermop h2, .talk h2, .dept h2');
  if (!reduce) heads.forEach(splitWords);
  $$('.pillar').forEach(function (p, i) { p.style.setProperty('--i', i); });
  $$('.gallery').forEach(function (g) {
    $$('.gal', g).forEach(function (c, i) { c.style.setProperty('--d', (i % 3) * 110 + 'ms'); });
  });

  /* Kesit: bölümler aşağıdan yukarı kurulur, sürekli çizimler ekran dışında durur */
  if (atlas) {
    var order = { firmalar: 0, tesisler: 1, isletmeler: 2, oteller: 3 };
    $$('.zone-art', atlas).forEach(function (a) {
      a.style.setProperty('--z', (order[a.parentNode.getAttribute('data-zone')] || 0) * 150 + 'ms');
    });
    var startLive = function () {
      atlas.classList.add('live');
      setTimeout(function () { atlas.classList.add('settled'); }, 2100);
    };
    if (reduce) startLive(); else setTimeout(startLive, 240);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        en.forEach(function (e) { atlas.classList.toggle('is-off', !e.isIntersecting); });
      }).observe(atlas);
    }
    if (!reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      var far = $('.lay-far', atlas), mid = $('.lay-mid', atlas), art = $('.atlas-art', atlas);
      art.addEventListener('pointermove', function (e) {
        var r = art.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        if (far) far.style.transform = 'translate(' + (x * -9).toFixed(1) + 'px,' + (y * -4).toFixed(1) + 'px)';
        if (mid) mid.style.transform = 'translate(' + (x * -18).toFixed(1) + 'px,' + (y * -7).toFixed(1) + 'px)';
      });
      art.addEventListener('pointerleave', function () {
        if (far) far.style.transform = '';
        if (mid) mid.style.transform = '';
      });
    }
  }

  /* Akan yazı, paralaks, ilerleme çizgisi (tek rAF) */
  var line = document.createElement('div');
  line.className = 'progress-line';
  line.setAttribute('aria-hidden', 'true');
  document.body.appendChild(line);
  var tape = $('.tape-t'), tx = 0, half = 0, lastY = window.scrollY, tv = 0, dir = 1, tapeBox = tape ? tape.parentNode : null;
  if (tape) { var measureTape = function () { half = tape.scrollWidth / 2; }; measureTape(); window.addEventListener('resize', measureTape); window.addEventListener('load', measureTape); }
  var pars = $$('.gal img, .dept-media img').map(function (im) { return { im: im, box: im.parentNode }; });
  var last = 0;
  var loop = function (now) {
    requestAnimationFrame(loop);
    var dt = Math.min(now - last, 60); last = now;
    var y = window.scrollY, vh = window.innerHeight, max = Math.max(1, document.documentElement.scrollHeight - vh);
    line.style.transform = 'scaleX(' + Math.min(1, y / max).toFixed(4) + ')';
    if (reduce) return;
    var dy = y - lastY; lastY = y;
    tv += (dy - tv) * .1;
    if (Math.abs(dy) > .5) dir = dy > 0 ? 1 : -1;
    if (tape && half) {
      var tr = tapeBox.getBoundingClientRect();
      if (tr.bottom > -40 && tr.top < vh + 40) {
        tx -= (.045 * dt + Math.abs(tv) * .35) * dir;
        if (tx <= -half) tx += half;
        if (tx > 0) tx -= half;
        tape.style.transform = 'translate3d(' + tx.toFixed(1) + 'px,0,0)';
      }
    }
    pars.forEach(function (o) {
      var r = o.box.getBoundingClientRect();
      if (r.bottom < -60 || r.top > vh + 60) return;
      o.im.style.setProperty('--py', ((r.top + r.height / 2 - vh / 2) * -.055).toFixed(1) + 'px');
    });
  };
  requestAnimationFrame(loop);

  /* Belge: fareyle hafif eğim */
  if (!reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $$('.cert').forEach(function (c) {
      var im = $('img', c);
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect();
        im.style.transform = 'perspective(1000px) rotateX(' + ((.5 - (e.clientY - r.top) / r.height) * 9).toFixed(2) + 'deg) rotateY(' + (((e.clientX - r.left) / r.width - .5) * 11).toFixed(2) + 'deg)';
      });
      c.addEventListener('pointerleave', function () { im.style.transform = ''; });
    });
  }

  /* Sayfa geçişi: kağıt perde */
  if (!reduce) {
    var veil = document.createElement('div');
    veil.className = 'veil';
    veil.setAttribute('aria-hidden', 'true');
    document.body.appendChild(veil);
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.defaultPrevented || a.target === '_blank') return;
      var h = a.getAttribute('href');
      if (!/^[^:#?]+\.html/.test(h)) return;
      var here = location.pathname.split('/').pop() || 'index.html';
      if (h.split('#')[0].split('?')[0] === here) return;
      e.preventDefault();
      document.documentElement.classList.add('leaving');
      setTimeout(function () { location.href = h; }, 430);
    });
    window.addEventListener('pageshow', function (e) { if (e.persisted) document.documentElement.classList.remove('leaving'); });
  }

  /* Belirme */
  var rev = $$('.reveal, .spl').concat($$('.gal, .dept-media'));
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    rev.forEach(function (el) { io.observe(el); });
  } else { rev.forEach(function (el) { el.classList.add('in'); }); }

  /* Sertifika */
  var lb = $('.lightbox');
  if (lb) {
    var last = null, close = $('button', lb), img = $('img', lb);
    var closeLb = function () { lb.classList.remove('open'); document.body.style.overflow = ''; if (last) last.focus(); };
    $$('[data-lightbox]').forEach(function (t) {
      t.addEventListener('click', function () {
        last = t; img.src = t.getAttribute('data-lightbox'); img.alt = t.getAttribute('data-alt') || '';
        lb.classList.add('open'); document.body.style.overflow = 'hidden'; close.focus();
      });
    });
    close.addEventListener('click', closeLb);
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lb.classList.contains('open')) closeLb(); });
  }

  /* Form */
  var form = $('#iletisim-formu');
  if (form) {
    var alan = new URLSearchParams(location.search).get('alan');
    if (alan) {
      var s = form.elements.alan;
      for (var i = 0; i < s.options.length; i++) if (s.options[i].value === alan) s.selectedIndex = i;
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements, first = null;
      ['ad', 'telefon', 'mesaj'].forEach(function (n) {
        var v = f[n].value.trim();
        var bad = !v || (n === 'telefon' && v.replace(/\D/g, '').length < 10);
        f[n].parentNode.classList.toggle('has-err', bad);
        f[n].setAttribute('aria-invalid', bad);
        if (bad && !first) first = f[n];
      });
      if (first) { first.focus(); return; }
      var t = ['Merhaba, web sitesinden yazıyorum.', '', 'Ad Soyad: ' + f.ad.value.trim()];
      if (f.isletme.value.trim()) t.push('İşletme: ' + f.isletme.value.trim());
      t.push('Telefon: ' + f.telefon.value.trim());
      if (f.alan.value) t.push('İlgilendiğim alan: ' + f.alan.value);
      t.push('', f.mesaj.value.trim());
      window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(t.join('\n')), '_blank', 'noopener');
    });
  }
})();
