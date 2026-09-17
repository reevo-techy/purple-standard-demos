/* ============================================================
   Lantern Art Cafe — shared header + footer
   Injected into inner pages (pages/*.html) at the
   <div data-mount="header"> / <div data-mount="footer"> hooks.
   The homepage carries its own inline header/footer because it
   sits one directory up and uses different relative paths.
   ============================================================ */
(function () {
  'use strict';

  var PHONE_DISPLAY = '(416) 555-0148';
  var PHONE_HREF = 'tel:+14165550148';

  var here = location.pathname.split('/').pop() || 'index.html';

  var NAV = [
    { label: 'Home',    href: '../index.html', match: 'index.html' },
    { label: 'Gallery', href: 'gallery.html',  match: 'gallery.html' },
    { label: 'Events',  href: 'events.html',   match: 'events.html' },
    { label: 'Menu',    href: 'menu.html',     match: 'menu.html' },
    { label: 'About',   href: 'about.html',    match: 'about.html' },
    { label: 'Visit',   href: 'visit.html',    match: 'visit.html' }
  ];

  function navLinks() {
    return NAV.map(function (n) {
      var cur = (n.match === here) ? ' aria-current="page"' : '';
      return '<li><a href="' + n.href + '"' + cur + '>' + n.label + '</a></li>';
    }).join('');
  }

  var header =
    '<a class="skip-link" href="#main">Skip to content</a>' +
    '<header class="site-header">' +
      '<nav class="nav" aria-label="Primary">' +
        '<a class="brand" href="../index.html" aria-label="Lantern Art Cafe — home">' +
          '<span class="brand-name">Lantern</span>' +
          '<span class="brand-tag">art cafe</span>' +
        '</a>' +
        '<button class="nav-toggle" aria-expanded="false" aria-controls="navmenu" aria-label="Menu"><span></span></button>' +
        '<ul class="nav-links" id="navmenu">' + navLinks() + '</ul>' +
        '<div class="nav-cta">' +
                    '<a class="btn btn--primary" href="visit.html#book">Book the space</a>' +
        '</div>' +
      '</nav>' +
    '</header>';

  var year = new Date().getFullYear();

  var footer =
    '<footer class="site-footer">' +
      '<div class="wrap">' +
        '<div class="footer-grid">' +
          '<div class="footer-brand">' +
            '<span class="brand-name" style="font-family:var(--serif);font-size:1.4rem;color:var(--paper)">Lantern <em style="font-style:italic;color:var(--saffron)">art cafe</em></span>' +
            '<p style="margin-top:10px;max-width:40ch;color:rgba(246,242,236,0.78)">A cafe and a gallery, sharing the same long table on Geary Avenue in Toronto. <em>Lantern</em> — the light left on.</p>' +
            '<p style="margin-top:14px">' +
              '<a href="https://www.instagram.com/lanternartcafe/" target="_blank" rel="noopener">Instagram &#8599;</a>' +
              '&nbsp;&nbsp;&middot;&nbsp;&nbsp;' +
              '<a href="https://www.facebook.com/lanternartcafe/" target="_blank" rel="noopener">Facebook &#8599;</a>' +
              ' <span class="confirm" style="border-color:var(--saffron);color:var(--saffron)">CONFIRM handles</span>' +
            '</p>' +
          '</div>' +
          '<div>' +
            '<h4>Visit</h4>' +
            '<ul>' +
              '<li>118 Geary Avenue<br>Toronto, ON</li>' +
                            '<li><a href="https://maps.google.com/?q=118+Geary+Avenue+Toronto+ON" target="_blank" rel="noopener">Get directions &#8599;</a></li>' +
            '</ul>' +
          '</div>' +
          '<div>' +
            '<h4>Hours</h4>' +
            '<ul>' +
              '<li>Open daily</li>' +
              '<li>til 8pm</li>' +
              '<li style="color:rgba(246,242,236,0.6);font-size:0.85rem">Opening time <span class="confirm" style="border-color:var(--saffron);color:var(--saffron)">CONFIRM</span></li>' +
            '</ul>' +
          '</div>' +
          '<div>' +
            '<h4>The room</h4>' +
            '<ul>' +
              '<li><a href="gallery.html">Now showing</a></li>' +
              '<li><a href="events.html">What\'s on</a></li>' +
              '<li><a href="visit.html#book">Book the space</a></li>' +
              '<li><a href="gallery.html#submit">Show your work</a></li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
        '<div class="footer-bar">' +
          '<span>&copy; ' + year + ' Lantern Art Cafe</span>' +
          '<span>118 Geary Avenue, Toronto ON &middot; site by <a href="https://purplestandard.ca" style="color:rgba(246,242,236,0.7)">Purple Standard</a></span>' +
        '</div>' +
      '</div>' +
    '</footer>' +
    '<nav class="call-bar" aria-label="Quick actions">' +
      '<ul>' +
        '<li><a href="' + PHONE_HREF + '">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 3h3l1.5 5-2 1.5a13 13 0 0 0 6 6l1.5-2 5 1.5v3c0 1-.8 1.9-1.9 1.8C12 23 1 12 1.7 4.9 1.6 3.8 2.5 3 3.5 3Z" fill="currentColor"/></svg>' +
          'Call' +
        '</a></li>' +
        '<li><a href="https://maps.google.com/?q=118+Geary+Avenue+Toronto+ON" target="_blank" rel="noopener">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 21s-7-4.5-7-10a7 7 0 0 1 14 0c0 5.5-7 10-7 10z" stroke-linejoin="round"/><circle cx="12" cy="11" r="2.5"/></svg>' +
          'Directions' +
        '</a></li>' +
        '<li><a href="gallery.html">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="14" rx="1"/><path d="M3 14l5-4 5 4 3-2 5 4"/></svg>' +
          'Now showing' +
        '</a></li>' +
      '</ul>' +
    '</nav>';

  function mount(name, html) {
    var slot = document.querySelector('[data-mount="' + name + '"]');
    if (slot) slot.outerHTML = html;
  }
  mount('header', header);
  mount('footer', footer);
})();
