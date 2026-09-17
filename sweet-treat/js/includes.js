/* ============================================================
   Sweet Treat Desserts — shared header + footer
   Injected into inner pages (pages/*.html) at the
   <div data-mount="header"> / <div data-mount="footer"> hooks.
   The homepage carries its own inline header/footer because it
   sits one directory up and uses different relative paths.
   ============================================================ */
(function () {
  'use strict';

  var PHONE_DISPLAY = '020 7946 0318';
  var PHONE_HREF = 'tel:+442079460318';
  var here = location.pathname.split('/').pop() || 'index.html';

  var NAV = [
    { label: 'Home',         href: '../index.html', match: 'index.html' },
    { label: 'Cupcakes',     href: 'cupcakes.html', match: 'cupcakes.html' },
    { label: 'Custom Cakes', href: 'cakes.html',    match: 'cakes.html' },
    { label: 'Weddings',     href: 'weddings.html', match: 'weddings.html' },
    { label: 'Desserts',     href: 'desserts.html', match: 'desserts.html' },
    { label: 'About',        href: 'about.html',    match: 'about.html' },
    { label: 'Visit',        href: 'visit.html',    match: 'visit.html' }
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
        '<a class="brand" href="../index.html" aria-label="Sweet Treat Desserts — home">' +
          '<span class="brand-name">Sweet Treat</span>' +
          '<span class="brand-dot" aria-hidden="true"></span>' +
          '<span class="brand-tag">Nut-Free Bakery</span>' +
        '</a>' +
        '<button class="nav-toggle" aria-expanded="false" aria-controls="navmenu" aria-label="Menu"><span></span></button>' +
        '<ul class="nav-links" id="navmenu">' + navLinks() + '</ul>' +
        '<div class="nav-cta">' +
          '<a class="nav-call" href="' + PHONE_HREF + '">' + PHONE_DISPLAY + '</a>' +
          '<a class="btn btn--primary" href="visit.html#order">Start a cake order</a>' +
        '</div>' +
      '</nav>' +
    '</header>';

  var year = new Date().getFullYear();

  var footer =
    '<footer class="site-footer">' +
      '<div class="wrap">' +
        '<div class="footer-inner glass">' +
          '<div class="footer-grid">' +
            '<div>' +
              '<span class="brand-name" style="font-size:1.4rem">Sweet Treat Desserts</span>' +
              '<p style="margin-top:10px;max-width:42ch">A from-scratch, 100% nut-free bakery on Lambton Row in Hackney, London. Cupcakes, custom cakes, wedding cakes &amp; desserts.</p>' +
              '<p style="margin-top:12px">' +
                '<a href="https://www.instagram.com/sweettreatdesserts/" target="_blank" rel="noopener">Instagram &#8599;</a>' +
                '&nbsp;&nbsp;&middot;&nbsp;&nbsp;' +
                '<a href="https://www.facebook.com/SweetTreatDesserts/" target="_blank" rel="noopener">Facebook &#8599;</a>' +
              '</p>' +
            '</div>' +
            '<div>' +
              '<h4>Visit</h4>' +
              '<ul>' +
                '<li>58 Lambton Row<br>London E8 3RN</li>' +
                '<li><a href="' + PHONE_HREF + '">' + PHONE_DISPLAY + '</a></li>' +
                '<li><a href="https://maps.google.com/?q=58+Lambton+Row+London+E8+3RN" target="_blank" rel="noopener">Get directions &#8599;</a></li>' +
              '</ul>' +
            '</div>' +
            '<div>' +
              '<h4>Hours <span class="confirm" style="border:0;padding:0">[CONFIRM]</span></h4>' +
              '<ul>' +
                '<li>Tue&ndash;Fri &nbsp; 9am&ndash;6pm</li>' +
                '<li>Saturday &nbsp; 9am&ndash;5pm</li>' +
                '<li>Sun &amp; Mon &nbsp; Closed</li>' +
                '<li style="margin-top:8px"><a href="visit.html#order">Start a cake order</a></li>' +
              '</ul>' +
            '</div>' +
          '</div>' +
          '<div class="footer-bar">' +
            '<span>&copy; ' + year + ' Sweet Treat Desserts</span>' +
            '<span>Also in Walthamstow &middot; A 100% nut-free bakery</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</footer>' +
    '<div class="call-bar">' +
      '<a href="' + PHONE_HREF + '">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 3h3l1.5 5-2 1.5a13 13 0 0 0 6 6l1.5-2 5 1.5v3c0 1-.8 1.9-1.9 1.8C12 23 1 12 1.7 4.9 1.6 3.8 2.5 3 3.5 3Z" fill="currentColor"/></svg>' +
        'Call ' + PHONE_DISPLAY +
      '</a>' +
    '</div>';

  function mount(name, html) {
    var slot = document.querySelector('[data-mount="' + name + '"]');
    if (slot) slot.outerHTML = html;
  }
  mount('header', header);
  mount('footer', footer);
})();
