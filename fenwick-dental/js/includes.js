/* ============================================================
   Fenwick Family Dental — shared header + footer
   Injected into inner pages (pages/*.html) at the
   <div data-mount="header"> / <div data-mount="footer"> hooks.
   The homepage carries its own inline header/footer because it
   sits one directory up and uses different relative paths.
   ============================================================ */
(function () {
  'use strict';

  var PHONE_DISPLAY = '(416) 555-0134';
  var PHONE_HREF = 'tel:+14165550134';
  var here = location.pathname.split('/').pop() || 'index.html';

  // Inner pages live in /pages/ — link up one level for the homepage.
  var NAV = [
    { label: 'Home',            href: '../index.html',        match: 'index.html' },
    { label: 'Services',        href: 'services.html',        match: 'services.html' },
    { label: 'Meet the Team',   href: 'team.html',            match: 'team.html' },
    { label: 'New Patients',    href: 'new-patients.html',    match: 'new-patients.html' },
    { label: 'CDCP & Insurance',href: 'cdcp-insurance.html',  match: 'cdcp-insurance.html' },
    { label: 'Contact',         href: 'contact.html',         match: 'contact.html' }
  ];

  function navLinks() {
    return NAV.map(function (n) {
      var current = (n.match === here) ? ' aria-current="page"' : '';
      return '<li><a href="' + n.href + '"' + current + '>' + n.label + '</a></li>';
    }).join('');
  }

  var header =
    '<a class="skip-link" href="#main">Skip to content</a>' +
    '<header class="site-header">' +
      '<nav class="nav" aria-label="Primary">' +
        '<a class="brand" href="../index.html" aria-label="Fenwick Family Dental — home">' +
          '<span class="brand-mark" aria-hidden="true">' +
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none">' +
            '<path d="M12 21c-1.6-1.1-3.2-1.6-4.8-1.6C5.5 19.4 4 17.4 4 14.2 4 9 7 6.5 9.4 6.5c1.2 0 2 .5 2.6 1 .6-.5 1.4-1 2.6-1C17 6.5 20 9 20 14.2c0 3.2-1.5 5.2-3.2 5.2-1.6 0-3.2.5-4.8 1.6Z" fill="#fff"/>' +
            '</svg>' +
          '</span>' +
          '<span class="brand-name">Fenwick <span>Family Dental</span></span>' +
        '</a>' +
        '<button class="nav-toggle" aria-expanded="false" aria-controls="navmenu" aria-label="Menu"><span></span></button>' +
        '<ul class="nav-links" id="navmenu">' + navLinks() + '</ul>' +
        '<div class="nav-cta">' +
          '<a class="nav-call" href="' + PHONE_HREF + '">' + PHONE_DISPLAY + '</a>' +
          '<a class="btn btn--primary" href="contact.html#book">Book Online</a>' +
        '</div>' +
      '</nav>' +
    '</header>';

  var year = new Date().getFullYear();

  var footer =
    '<footer class="site-footer">' +
      '<div class="wrap">' +
        '<div class="footer-grid">' +
          '<div>' +
            '<a class="brand" href="../index.html" style="margin-bottom:14px">' +
              '<span class="brand-mark" aria-hidden="true">' +
                '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 21c-1.6-1.1-3.2-1.6-4.8-1.6C5.5 19.4 4 17.4 4 14.2 4 9 7 6.5 9.4 6.5c1.2 0 2 .5 2.6 1 .6-.5 1.4-1 2.6-1C17 6.5 20 9 20 14.2c0 3.2-1.5 5.2-3.2 5.2-1.6 0-3.2.5-4.8 1.6Z" fill="#fff"/></svg>' +
              '</span>' +
              '<span class="brand-name">Fenwick <span>Family Dental</span></span>' +
            '</a>' +
            '<p style="color:var(--navy-soft);max-width:34ch">Family &amp; cosmetic dentistry in Midtown Toronto — caring for our neighbours for over 20 years.</p>' +
            '<p><span class="badge">Canadian Dental Care Plan accepted</span></p>' +
          '</div>' +
          '<div>' +
            '<h4>Visit</h4>' +
            '<ul>' +
              '<li>224 Merton Street, Suite 3<br>Toronto, ON M4S 1A2</li>' +
              '<li><a href="' + PHONE_HREF + '">' + PHONE_DISPLAY + '</a></li>' +
              '<li><a href="https://maps.google.com/?q=224+Merton+Street+Suite+3+Toronto+ON" target="_blank" rel="noopener">Get directions &#8599;</a></li>' +
            '</ul>' +
          '</div>' +
          '<div>' +
            '<h4>Explore</h4>' +
            '<ul>' +
              '<li><a href="services.html">Services</a></li>' +
              '<li><a href="team.html">Meet the Team</a></li>' +
              '<li><a href="new-patients.html">New Patients</a></li>' +
              '<li><a href="cdcp-insurance.html">CDCP &amp; Insurance</a></li>' +
              '<li><a href="contact.html#book">Book Online</a></li>' +
            '</ul>' +
          '</div>' +
          '<div>' +
            '<h4>We speak your language</h4>' +
            '<div class="footer-langs">' +
              '<span lang="en">English</span><span aria-hidden="true">&middot;</span>' +
              '<span lang="ar">العربية</span><span aria-hidden="true">&middot;</span>' +
              '<span lang="es">Español</span><span aria-hidden="true">&middot;</span>' +
              '<span lang="tl">Tagalog</span><span aria-hidden="true">&middot;</span>' +
              '<span lang="ur">اردو</span><span aria-hidden="true">&middot;</span>' +
              '<span lang="pa">ਪੰਜਾਬੀ</span>' +
            '</div>' +
            '<p style="margin-top:14px">' +
              '<a href="https://www.facebook.com/fenwickfamilydental" target="_blank" rel="noopener">Facebook &#8599;</a>' +
            '</p>' +
          '</div>' +
        '</div>' +
        '<div class="footer-bar">' +
          '<span>&copy; ' + year + ' Fenwick Family Dental &middot; Dr. Nadia Kessler Professional Corporation</span>' +
          '<span>' +
            '<a href="privacy.html">Privacy</a> &nbsp;&middot;&nbsp; ' +
            '<a href="cdcp-insurance.html">CDCP info</a> &nbsp;&middot;&nbsp; ' +
            '<a href="https://patientportal.example" target="_blank" rel="noopener">Patient Portal &#8599;</a>' +
          '</span>' +
        '</div>' +
      '</div>' +
    '</footer>' +
    '<div class="mobile-cta">' +
      '<a class="btn btn--primary" href="contact.html#book">Book Online</a>' +
      '<a class="btn btn--ghost" href="' + PHONE_HREF + '">Call</a>' +
    '</div>';

  function mount(name, html) {
    var slot = document.querySelector('[data-mount="' + name + '"]');
    if (slot) slot.outerHTML = html;
  }
  mount('header', header);
  mount('footer', footer);
})();
