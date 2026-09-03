/**
 * DROPDOWN MENUS
 * Handles Maps and Calendar dropdown menus.
 */

(function() {
  'use strict';

  function initDropdowns() {
    // All dropdown triggers
    const triggers = [
      { btn: 'btnOpenMaps', dropdown: 'dropdownMaps' },
      { btn: 'btnAddCalendar', dropdown: 'dropdownCalendar' },
      { btn: 'btnWeekendMaps', dropdown: 'dropdownWeekendMaps' },
      { btn: 'btnWeekendCalendar', dropdown: 'dropdownWeekendCalendar' }
    ];

    triggers.forEach(({ btn, dropdown }) => {
      const btnEl = document.getElementById(btn);
      const dropdownEl = document.getElementById(dropdown);
      if (!btnEl || !dropdownEl) return;

      btnEl.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Close all other dropdowns first
        document.querySelectorAll('.dropdown.is-open').forEach(d => {
          if (d !== dropdownEl) d.classList.remove('is-open');
        });

        // Toggle this dropdown
        const isOpen = dropdownEl.classList.toggle('is-open');
        btnEl.setAttribute('aria-expanded', isOpen);
      });
    });

    // Close dropdowns on outside click
    document.addEventListener('click', () => {
      document.querySelectorAll('.dropdown.is-open').forEach(d => {
        d.classList.remove('is-open');
      });
    });

    // Prevent dropdown clicks from closing
    document.querySelectorAll('.dropdown').forEach(d => {
      d.addEventListener('click', (e) => e.stopPropagation());
    });

    // Google Calendar link generator
    setupCalendarLinks('linkGoogleCalendar', 'linkAppleCalendar', 'ceremony');
    setupCalendarLinks('linkWeekendGCal', 'linkWeekendACal', 'weekend');
  }

  function setupCalendarLinks(googleId, appleId, type) {
    const googleBtn = document.getElementById(googleId);
    const appleBtn = document.getElementById(appleId);
    
    if (!googleBtn || !appleBtn) return;
    if (typeof WEDDING_CONFIG === 'undefined') return;

    const C = WEDDING_CONFIG;
    let title, start, end, location, description;

    if (type === 'ceremony') {
      title = `${C.couple.name1} & ${C.couple.name2}'s Wedding`;
      start = new Date(C.couple.weddingDate);
      end = new Date(start.getTime() + 6 * 60 * 60 * 1000); // +6 hours
      location = C.venue.address || '';
      description = `Wedding celebration at ${C.venue.name}`;
    } else if (type === 'weekend') {
      title = `Pre-Wedding: ${C.weekend.eventName}`;
      // Day before wedding
      const weddingDate = new Date(C.couple.weddingDate);
      start = new Date(weddingDate);
      start.setDate(start.getDate() - 1);
      start.setHours(17, 30, 0);
      end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
      location = C.weekend.address || '';
      description = `Evening dinner at ${C.weekend.eventName}`;
    }

    // Google Calendar URL
    googleBtn.addEventListener('click', () => {
      const formatDate = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatDate(start)}/${formatDate(end)}&location=${encodeURIComponent(location)}&details=${encodeURIComponent(description)}`;
      window.open(url, '_blank');
    });

    // Apple Calendar (.ics download)
    appleBtn.addEventListener('click', () => {
      const formatDate = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
      const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `DTSTART:${formatDate(start)}`,
        `DTEND:${formatDate(end)}`,
        `SUMMARY:${title}`,
        `LOCATION:${location}`,
        `DESCRIPTION:${description}`,
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([ics], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/[^a-z0-9]/gi, '_')}.ics`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDropdowns);
  } else {
    initDropdowns();
  }
})();
