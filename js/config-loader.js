/**
 * CONFIG LOADER
 * Reads WEDDING_CONFIG and injects all values into the DOM.
 * Also applies theme colors as CSS custom properties.
 */

(function() {
  'use strict';

  function loadConfig() {
    let C = typeof WEDDING_CONFIG !== 'undefined' ? JSON.parse(JSON.stringify(WEDDING_CONFIG)) : {};

    // Check localStorage for customizations saved from admin.html
    const saved = localStorage.getItem('wedding_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.version === WEDDING_CONFIG.version && parsed?.couple?.name1 === "Abdul Basit") {
          C = Object.assign({}, C, parsed);
        } else {
          localStorage.removeItem('wedding_config');
        }
        window.WEDDING_CONFIG = C;
      } catch (e) {
        console.warn('Could not parse saved wedding_config from localStorage', e);
      }
    }

    // ─── Apply Theme Colors ───
    if (C.theme) {
      const root = document.documentElement;
      if (C.theme.primaryColor) root.style.setProperty('--color-primary', C.theme.primaryColor);
      if (C.theme.accentColor) root.style.setProperty('--color-accent', C.theme.accentColor);
      if (C.theme.backgroundColor) root.style.setProperty('--color-bg', C.theme.backgroundColor);

      // Cleanse outer background: ensure it seamlessly matches background and never falls back to maroon
      const bg = C.theme.backgroundColor || '#FCF6F7';
      const outer = (C.theme.outerBackground && !C.theme.outerBackground.toLowerCase().includes('4a1d24'))
        ? C.theme.outerBackground
        : bg;
      root.style.setProperty('--color-outer-bg', outer);

      if (C.theme.goldAccent) root.style.setProperty('--color-gold', C.theme.goldAccent);
      if (C.theme.buttonColor) root.style.setProperty('--color-button', C.theme.buttonColor);
      if (C.theme.secondaryText) root.style.setProperty('--color-text-secondary', C.theme.secondaryText);
      if (C.theme.headingFont) root.style.setProperty('--font-heading', C.theme.headingFont);
      if (C.theme.bodyFont) root.style.setProperty('--font-body', C.theme.bodyFont);
      if (C.theme.labelFont) root.style.setProperty('--font-label', C.theme.labelFont);
    }

    // ─── Couple Details ───
    if (C.couple) {
      let mono = C.couple.monogram;
      if (!mono || mono === 'M&J') {
        const n1 = (C.couple.name1 || '').trim();
        const n2 = (C.couple.name2 || '').trim();
        const init1 = n1 ? n1[0].toUpperCase() : 'B';
        const init2 = n2 ? n2[0].toUpperCase() : 'R';
        mono = `${init1}&${init2}`;
      }
      setText('waxMonogram', mono);

      setText('heroName1', C.couple.name1);
      setText('heroName2', C.couple.name2);
      setText('welcomeName1', C.couple.name1);
      setText('welcomeName2', C.couple.name2);
      if (C.couple.parents) setText('welcomeParents', C.couple.parents);
      if (C.couple.invitationText) setText('welcomeRequest', C.couple.invitationText);
      if (C.couple.groomLineage) setText('welcomeLineage1', C.couple.groomLineage);
      if (C.couple.brideLineage) setText('welcomeLineage2', C.couple.brideLineage);
      if (C.couple.compliments) setText('closingCompliments', C.couple.compliments);
      setText('closingNames', `${C.couple.name1} & ${C.couple.name2}`);
      setText('scratchTitle', C.couple.welcomeTitle);
      setText('scratchBody', C.couple.welcomeBody);

      // Hero date
      if (C.couple.weddingDate) {
        const d = new Date(C.couple.weddingDate);
        const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
        const heroDateEl = document.getElementById('heroDate');
        if (heroDateEl) {
          heroDateEl.innerHTML = `<span>${d.getDate()}</span><span>${months[d.getMonth()]}</span><span>${d.getFullYear()}</span>`;
        }

        // Countdown label
        const fullMonths = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        setText('countdownDateLabel', `UNTIL ${d.getDate()} ${fullMonths[d.getMonth()].toUpperCase()} ${d.getFullYear()}`);

        // Closing date
        setText('closingDate', `${fullMonths[d.getMonth()].toUpperCase()} ${d.getDate()}, ${d.getFullYear()}`);
      }

      // Couple photo
      if (C.couple.couplePhoto) {
        setAttr('scratchPhoto', 'src', C.couple.couplePhoto);
      }

      // Initialize Photo Carousel
      if (typeof window.initPhotoCarousel === 'function' && C.couple.galleryPhotos) {
        window.initPhotoCarousel(C.couple.galleryPhotos, C.theme?.carouselSpeed || 3500);
      }
    }

    // ─── Venue ───
    if (C.venue) {
      setHTML('ceremonyVenue', C.venue.name.replace(/\s/g, '<br>'));
      setText('ceremonyCity', `${C.venue.city.toUpperCase()}, ${C.venue.country.toUpperCase()}`);
      setText('ceremonyTime', C.venue.ceremonyTime);
      setText('welcomeDay', `${C.venue.dayOfWeek}, 16TH NOVEMBER, 2026`);
      setText('welcomeTime', C.venue.ceremonyTime);
      setText('welcomeDateWritten', C.venue.dateWrittenOut);

      // Address split
      if (C.venue.address) {
        const parts = C.venue.address.split(',');
        setText('ceremonyAddress', parts[0]?.trim());
        setText('ceremonyAddressSub', parts.slice(1).join(',').trim());
      }

      // Map links
      setAttr('linkGoogleMaps', 'href', C.venue.googleMapsUrl || '#');
      setAttr('linkAppleMaps', 'href', C.venue.appleMapsUrl || '#');
    }

    // ─── Schedule ───
    if (C.schedule) {
      setText('scheduleDate', C.schedule.dateLabel);
      const timelineEl = document.getElementById('timeline');
      if (timelineEl && C.schedule.events) {
        const getEventIcon = (title = '', explicitIcon = '') => {
          if (explicitIcon === 'umbrella') return '🕊️';
          if (explicitIcon === 'venue') return '🍽️';
          if (explicitIcon === 'glasses') return '💃';
          const t = title.toLowerCase();
          if (t.includes('arrive') || t.includes('arrival') || t.includes('guest') || t.includes('welcome')) return '🕊️';
          if (t.includes('ceremony') || t.includes('vow') || t.includes('exchange') || t.includes('nikaah')) return '💍';
          if (t.includes('drink') || t.includes('reception') || t.includes('cocktail')) return '🥂';
          if (t.includes('dinner') || t.includes('breakfast') || t.includes('banquet') || t.includes('food')) return '🍽️';
          if (t.includes('first dance') || t.includes('dance')) return '💃';
          if (t.includes('carriage') || t.includes('home') || t.includes('car') || t.includes('rukhsati') || t.includes('bidai')) return '🚗';
          return '✨';
        };

        timelineEl.innerHTML = C.schedule.events.map((evt, i) => {
          const icon = getEventIcon(evt.title, evt.icon);
          return `
            <div class="timeline__item reveal${i % 2 === 0 ? '--left' : '--right'}">
              <span class="timeline__time">${evt.time}</span>
              <span class="timeline__dot"></span>
              <span class="timeline__title">${evt.title}</span>
              <span class="timeline__badge">${icon}</span>
            </div>`;
        }).join('');
      }
    }

    // ─── Story ───
    if (C.story) {
      const storySection = document.getElementById('sectionStory');
      if (!C.story.show && storySection) {
        storySection.style.display = 'none';
      }
      setText('storyTitle', C.story.title);
      const parasEl = document.getElementById('storyParagraphs');
      if (parasEl && C.story.paragraphs) {
        parasEl.innerHTML = C.story.paragraphs.map(p =>
          `<p class="story__paragraph">${p}</p>`
        ).join('');
      }
    }

    // ─── Weekend ───
    if (C.weekend) {
      const weekendSection = document.getElementById('sectionWeekend');
      if (!C.weekend.show && weekendSection) {
        weekendSection.style.display = 'none';
      }
      setText('weekendTitle', C.weekend.title);
      setText('weekendSubtitle', C.weekend.subtitle);
      setText('weekendEventName', C.weekend.eventName);
      setText('weekendLocation', C.weekend.location?.toUpperCase());
      setText('weekendAddress', C.weekend.address?.split(',')[0]);
      setText('weekendAddressSub', C.weekend.address?.split(',').slice(1).join(',').trim());

      setAttr('linkWeekendGoogleMaps', 'href', C.weekend.mapsUrl || '#');
      setAttr('linkWeekendAppleMaps', 'href', C.weekend.appleMapsUrl || '#');
    }

    // ─── Travel ───
    if (C.travel) {
      const travelSection = document.getElementById('sectionTravel');
      if (!C.travel.show && travelSection) {
        travelSection.style.display = 'none';
      }
      setText('travelTitle', C.travel.title);
      setText('travelAirport', C.travel.airportInfo);

      const hotelCardsEl = document.getElementById('hotelCards');
      if (hotelCardsEl && C.travel.hotels) {
        hotelCardsEl.innerHTML = C.travel.hotels.map(hotel => {
          const ratesHTML = hotel.rates?.map(r => `<div class="hotel-card__detail">${r}</div>`).join('') || '';
          return `
            <div class="hotel-card reveal">
              <p class="hotel-card__label">${hotel.label || hotel.type?.toUpperCase()}</p>
              <h3 class="hotel-card__name">${hotel.name}</h3>
              <p class="hotel-card__address">${hotel.address}</p>
              ${hotel.dates ? `<p class="hotel-card__detail-label">BLOCK DATES</p><div class="hotel-card__detail">${hotel.dates}</div>` : ''}
              ${ratesHTML ? `<p class="hotel-card__detail-label">RATES</p>${ratesHTML}` : ''}
              ${hotel.deadline ? `<div class="hotel-card__detail" style="margin-top:var(--space-sm);font-style:italic;">${hotel.deadline}</div>` : ''}
              ${hotel.reference ? `<p class="hotel-card__reference">Reference: ${hotel.reference}</p>` : ''}
              ${hotel.phone ? `<a href="tel:${hotel.phone}" class="hotel-card__phone">📞 ${hotel.phone}</a>` : ''}
              ${hotel.mapsUrl ? `<br><a href="${hotel.mapsUrl}" target="_blank" rel="noopener" class="hotel-card__maps">GOOGLE MAPS ↗</a>` : ''}
            </div>`;
        }).join('');
      }
    }

    // ─── RSVP ───
    if (C.rsvp) {
      setText('rsvpDeadline', `KINDLY RESPOND BY ${C.rsvp.deadline.toUpperCase()}`);

      // Guest count visibility
      const guestCountGroup = document.getElementById('guestCountGroup');
      if (!C.rsvp.showGuestCount && guestCountGroup) {
        guestCountGroup.style.display = 'none';
      }

      // Message placeholder
      const msgEl = document.getElementById('rsvpMessage');
      if (msgEl && C.rsvp.messagePlaceholder) {
        msgEl.placeholder = C.rsvp.messagePlaceholder;
      }
    }

    // ─── OG Meta Tags ───
    if (C.couple) {
      document.title = `You're Invited — ${C.couple.name1} & ${C.couple.name2}'s Wedding`;
      setMeta('og:title', `${C.couple.name1} & ${C.couple.name2}'s Wedding Invitation`);
      setMeta('og:description', `You are cordially invited to celebrate the wedding of ${C.couple.name1} & ${C.couple.name2}.`);
    }
  }

  // ─── Helpers ───
  function setText(id, text) {
    const el = document.getElementById(id);
    if (el && text) el.textContent = text;
  }

  function setHTML(id, html) {
    const el = document.getElementById(id);
    if (el && html) el.innerHTML = html;
  }

  function setAttr(id, attr, value) {
    const el = document.getElementById(id);
    if (el && value) el.setAttribute(attr, value);
  }

  function setMeta(property, content) {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.querySelector(`meta[name="${property}"]`);
    }
    if (meta) meta.setAttribute('content', content);
  }

  // ─── Run on DOM ready ───
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadConfig);
  } else {
    loadConfig();
  }
})();
