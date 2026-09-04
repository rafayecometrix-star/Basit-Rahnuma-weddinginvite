/**
 * ADMIN PANEL — Application Logic
 * Reads/writes config, manages dynamic lists, handles export/import.
 */

(function() {
  'use strict';

  // ─── Deep clone the default config ───
  let config = JSON.parse(JSON.stringify(WEDDING_CONFIG));

  // Try to load saved config from localStorage
  const saved = localStorage.getItem('wedding_config');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.version === WEDDING_CONFIG.version && parsed?.couple?.name1 === "Abdul Basit") {
        config = Object.assign({}, config, parsed);
      } else {
        localStorage.removeItem('wedding_config');
      }
    } catch (e) { /* use defaults */ }
  }

  // ═══════════════════════════════
  // TAB NAVIGATION
  // ═══════════════════════════════
  const tabs = document.querySelectorAll('.admin__tab');
  const panels = document.querySelectorAll('.admin__panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('is-active'));
      panels.forEach(p => p.classList.remove('is-active'));
      tab.classList.add('is-active');
      document.getElementById(`panel-${tab.dataset.tab}`).classList.add('is-active');
    });
  });

  // ═══════════════════════════════
  // POPULATE FIELDS FROM CONFIG
  // ═══════════════════════════════
  function populateFields() {
    // Couple
    setVal('cfg-couple-name1', config.couple?.name1);
    setVal('cfg-couple-name2', config.couple?.name2);
    
    // Auto-update monogram if default or mismatched
    const n1 = (config.couple?.name1 || '').trim();
    const n2 = (config.couple?.name2 || '').trim();
    let mono = config.couple?.monogram;
    const autoMono = `${n1 ? n1[0].toUpperCase() : 'M'}&${n2 ? n2[0].toUpperCase() : 'J'}`;
    if (!mono || mono === 'M&J' || (n1 && mono[0] !== n1[0].toUpperCase())) {
      mono = autoMono;
    }
    setVal('cfg-couple-monogram', mono);
    setVal('cfg-couple-couplePhoto', config.couple?.couplePhoto);
    updateCouplePhotoPreview(config.couple?.couplePhoto);
    setVal('cfg-couple-welcomeTitle', config.couple?.welcomeTitle);
    setVal('cfg-couple-welcomeBody', config.couple?.welcomeBody);
    if (config.couple?.weddingDate) {
      const d = new Date(config.couple.weddingDate);
      const iso = d.toISOString().slice(0, 16);
      setVal('cfg-couple-weddingDate', iso);
    }

    // Story
    setChecked('cfg-story-show', config.story?.show !== false);
    setVal('cfg-story-title', config.story?.title);
    renderStoryParagraphs();

    // Venue
    setVal('cfg-venue-name', config.venue?.name);
    setVal('cfg-venue-city', config.venue?.city);
    setVal('cfg-venue-country', config.venue?.country);
    setVal('cfg-venue-address', config.venue?.address);
    setVal('cfg-venue-ceremonyTime', config.venue?.ceremonyTime);
    setVal('cfg-venue-dateWrittenOut', config.venue?.dateWrittenOut);
    setVal('cfg-venue-dayOfWeek', config.venue?.dayOfWeek);
    setVal('cfg-venue-googleMapsUrl', config.venue?.googleMapsUrl);
    setVal('cfg-venue-appleMapsUrl', config.venue?.appleMapsUrl);

    // Schedule
    setVal('cfg-schedule-dateLabel', config.schedule?.dateLabel);
    renderScheduleEvents();

    // Weekend
    setChecked('cfg-weekend-show', config.weekend?.show !== false);
    setVal('cfg-weekend-title', config.weekend?.title);
    setVal('cfg-weekend-subtitle', config.weekend?.subtitle);
    setVal('cfg-weekend-eventName', config.weekend?.eventName);
    setVal('cfg-weekend-location', config.weekend?.location);
    setVal('cfg-weekend-date', config.weekend?.date);
    setVal('cfg-weekend-month', config.weekend?.month);
    setVal('cfg-weekend-timeRange', config.weekend?.timeRange);
    setVal('cfg-weekend-address', config.weekend?.address);
    setVal('cfg-weekend-mapsUrl', config.weekend?.mapsUrl);

    // Travel
    setChecked('cfg-travel-show', config.travel?.show !== false);
    setVal('cfg-travel-title', config.travel?.title);
    setVal('cfg-travel-airportInfo', config.travel?.airportInfo);
    renderHotels();

    // RSVP
    setVal('cfg-rsvp-deadline', config.rsvp?.deadline);
    setVal('cfg-rsvp-maxGuests', config.rsvp?.maxGuests);
    setChecked('cfg-rsvp-showGuestCount', config.rsvp?.showGuestCount !== false);
    setVal('cfg-rsvp-messagePlaceholder', config.rsvp?.messagePlaceholder);

    // Gallery photos
    renderGalleryPhotos();

    // Design
    setVal('cfg-theme-primaryColor', config.theme?.primaryColor);
    setVal('cfg-theme-accentColor', config.theme?.accentColor);
    setVal('cfg-theme-backgroundColor', config.theme?.backgroundColor);
    setVal('cfg-theme-goldAccent', config.theme?.goldAccent);
    setVal('cfg-theme-buttonColor', config.theme?.buttonColor);
    setVal('cfg-theme-carouselSpeed', config.theme?.carouselSpeed || 3500);
    setChecked('cfg-theme-enableMusic', config.theme?.enableMusic === true);
    setVal('cfg-theme-musicFile', config.theme?.musicFile);
  }

  // ═══════════════════════════════
  // READ FIELDS INTO CONFIG
  // ═══════════════════════════════
  function readFields() {
    config.couple = config.couple || {};
    config.couple.name1 = getVal('cfg-couple-name1');
    config.couple.name2 = getVal('cfg-couple-name2');
    config.couple.monogram = getVal('cfg-couple-monogram');
    config.couple.couplePhoto = getVal('cfg-couple-couplePhoto');
    config.couple.welcomeTitle = getVal('cfg-couple-welcomeTitle');
    config.couple.welcomeBody = getVal('cfg-couple-welcomeBody');
    const dateStr = getVal('cfg-couple-weddingDate');
    if (dateStr) config.couple.weddingDate = new Date(dateStr).toISOString();
    config.couple.galleryPhotos = readDynamicList('galleryList');

    config.story = config.story || {};
    config.story.show = getChecked('cfg-story-show');
    config.story.title = getVal('cfg-story-title');
    config.story.paragraphs = readDynamicTextareas('storyParagraphs');

    config.venue = config.venue || {};
    config.venue.name = getVal('cfg-venue-name');
    config.venue.city = getVal('cfg-venue-city');
    config.venue.country = getVal('cfg-venue-country');
    config.venue.address = getVal('cfg-venue-address');
    config.venue.ceremonyTime = getVal('cfg-venue-ceremonyTime');
    config.venue.dateWrittenOut = getVal('cfg-venue-dateWrittenOut');
    config.venue.dayOfWeek = getVal('cfg-venue-dayOfWeek');
    config.venue.googleMapsUrl = getVal('cfg-venue-googleMapsUrl');
    config.venue.appleMapsUrl = getVal('cfg-venue-appleMapsUrl');

    config.schedule = config.schedule || {};
    config.schedule.dateLabel = getVal('cfg-schedule-dateLabel');
    config.schedule.events = readScheduleEvents();

    config.weekend = config.weekend || {};
    config.weekend.show = getChecked('cfg-weekend-show');
    config.weekend.title = getVal('cfg-weekend-title');
    config.weekend.subtitle = getVal('cfg-weekend-subtitle');
    config.weekend.eventName = getVal('cfg-weekend-eventName');
    config.weekend.location = getVal('cfg-weekend-location');
    config.weekend.date = getVal('cfg-weekend-date');
    config.weekend.month = getVal('cfg-weekend-month');
    config.weekend.timeRange = getVal('cfg-weekend-timeRange');
    config.weekend.address = getVal('cfg-weekend-address');
    config.weekend.mapsUrl = getVal('cfg-weekend-mapsUrl');

    config.travel = config.travel || {};
    config.travel.show = getChecked('cfg-travel-show');
    config.travel.title = getVal('cfg-travel-title');
    config.travel.airportInfo = getVal('cfg-travel-airportInfo');
    config.travel.hotels = readHotels();

    config.rsvp = config.rsvp || {};
    config.rsvp.deadline = getVal('cfg-rsvp-deadline');
    config.rsvp.maxGuests = parseInt(getVal('cfg-rsvp-maxGuests')) || 10;
    config.rsvp.showGuestCount = getChecked('cfg-rsvp-showGuestCount');
    config.rsvp.messagePlaceholder = getVal('cfg-rsvp-messagePlaceholder');

    config.theme = config.theme || {};
    config.theme.primaryColor = getVal('cfg-theme-primaryColor');
    config.theme.accentColor = getVal('cfg-theme-accentColor');
    config.theme.backgroundColor = getVal('cfg-theme-backgroundColor');
    config.theme.outerBackground = config.theme.backgroundColor;
    config.theme.goldAccent = getVal('cfg-theme-goldAccent');
    config.theme.buttonColor = getVal('cfg-theme-buttonColor');
    config.theme.carouselSpeed = parseInt(getVal('cfg-theme-carouselSpeed')) || 3500;
    config.theme.enableMusic = getChecked('cfg-theme-enableMusic');
    config.theme.musicFile = getVal('cfg-theme-musicFile');

    const headingSelect = document.getElementById('cfg-theme-headingFont');
    if (headingSelect) config.theme.headingFont = headingSelect.value;
    const bodySelect = document.getElementById('cfg-theme-bodyFont');
    if (bodySelect) config.theme.bodyFont = bodySelect.value;
  }

  // ═══════════════════════════════
  // DYNAMIC LIST RENDERERS
  // ═══════════════════════════════

  function updateCouplePhotoPreview(url) {
    const preview = document.getElementById('preview-couple-photo');
    const nameEl = document.getElementById('preview-couple-photo-name');
    if (preview && url) {
      preview.src = url;
      if (nameEl) nameEl.textContent = url.startsWith('data:') ? 'Custom device image loaded' : url.split('/').pop();
    }
  }

  function renderGalleryPhotos() {
    const container = document.getElementById('galleryList');
    if (!container) return;
    container.innerHTML = (config.couple?.galleryPhotos || []).map((url, i) =>
      `<div class="admin__dynamic-item admin__gallery-item" data-index="${i}" style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
        <img src="${url}" alt="Gallery ${i + 1}" style="width:40px; height:40px; object-fit:cover; border-radius:4px; border:1px solid #ccc; flex-shrink:0;" />
        <input type="text" value="${url}" placeholder="Image URL or Device Upload" style="flex:1;" oninput="this.previousElementSibling.src = this.value" />
        <label class="admin__file-btn" style="padding:6px 10px; font-size:0.75rem; background:#4A7A9F; color:#fff; border-radius:4px; cursor:pointer; flex-shrink:0;">
          📁 Device
          <input type="file" accept="image/*" style="display:none;" onchange="handleItemFilePick(this)" />
        </label>
        <button class="admin__remove-btn" onclick="this.parentElement.remove()" style="flex-shrink:0;">✕</button>
      </div>`
    ).join('');
  }

  window.handleItemFilePick = function(input) {
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = function(e) {
        const item = input.closest('.admin__gallery-item');
        if (item) {
          const textInput = item.querySelector('input[type="text"]');
          const img = item.querySelector('img');
          if (textInput) textInput.value = e.target.result;
          if (img) img.src = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  function renderStoryParagraphs() {
    const container = document.getElementById('storyParagraphs');
    if (!container) return;
    container.innerHTML = (config.story?.paragraphs || []).map((text, i) =>
      `<div class="admin__dynamic-item" data-index="${i}">
        <textarea rows="3" placeholder="Story paragraph...">${text}</textarea>
        <button class="admin__remove-btn" onclick="this.parentElement.remove()">✕</button>
      </div>`
    ).join('');
  }

  function renderScheduleEvents() {
    const container = document.getElementById('scheduleEvents');
    if (!container) return;
    container.innerHTML = (config.schedule?.events || []).map((evt, i) =>
      `<div class="admin__schedule-item" data-index="${i}">
        <input type="text" value="${evt.time}" placeholder="12:00" />
        <input type="text" value="${evt.title}" placeholder="Event title" />
        <button class="admin__remove-btn" onclick="this.parentElement.remove()">✕</button>
      </div>`
    ).join('');
  }

  function renderTransportOptions() {
    const container = document.getElementById('transportList');
    if (!container) return;
    container.innerHTML = (config.rsvp?.transportationOptions || []).map((opt, i) =>
      `<div class="admin__dynamic-item" data-index="${i}">
        <input type="text" value="${opt}" placeholder="Transport option" />
        <button class="admin__remove-btn" onclick="this.parentElement.remove()">✕</button>
      </div>`
    ).join('');
  }

  function renderHotels() {
    const container = document.getElementById('hotelsList');
    if (!container) return;
    container.innerHTML = (config.travel?.hotels || []).map((hotel, i) =>
      `<div class="admin__hotel-item" data-index="${i}">
        <div class="admin__hotel-item-header">
          <span>Hotel ${i + 1}</span>
          <button class="admin__remove-btn" onclick="this.closest('.admin__hotel-item').remove()">✕</button>
        </div>
        <div class="admin__form-grid">
          <div class="admin__field"><label>Name</label><input type="text" data-field="name" value="${hotel.name || ''}" /></div>
          <div class="admin__field"><label>Type</label><input type="text" data-field="type" value="${hotel.type || 'additional'}" placeholder="preferred / additional" /></div>
          <div class="admin__field admin__field--full"><label>Address</label><input type="text" data-field="address" value="${hotel.address || ''}" /></div>
          <div class="admin__field"><label>Phone</label><input type="text" data-field="phone" value="${hotel.phone || ''}" /></div>
          <div class="admin__field"><label>Maps URL</label><input type="url" data-field="mapsUrl" value="${hotel.mapsUrl || ''}" /></div>
        </div>
      </div>`
    ).join('');
  }

  // Read helpers
  function readDynamicList(containerId) {
    const items = document.querySelectorAll(`#${containerId} .admin__dynamic-item input`);
    return Array.from(items).map(i => i.value).filter(v => v.trim());
  }

  function readDynamicTextareas(containerId) {
    const items = document.querySelectorAll(`#${containerId} .admin__dynamic-item textarea`);
    return Array.from(items).map(i => i.value).filter(v => v.trim());
  }

  function readScheduleEvents() {
    const items = document.querySelectorAll('#scheduleEvents .admin__schedule-item');
    return Array.from(items).map(item => {
      const inputs = item.querySelectorAll('input');
      return { time: inputs[0]?.value || '', title: inputs[1]?.value || '', icon: 'default' };
    }).filter(e => e.time || e.title);
  }

  function readHotels() {
    const items = document.querySelectorAll('#hotelsList .admin__hotel-item');
    return Array.from(items).map(item => {
      const get = (field) => item.querySelector(`[data-field="${field}"]`)?.value || '';
      return {
        name: get('name'), type: get('type'), label: get('type').toUpperCase(),
        address: get('address'), phone: get('phone'), mapsUrl: get('mapsUrl'),
        dates: '', rates: [], deadline: '', reference: ''
      };
    }).filter(h => h.name);
  }

  // Auto-update monogram when names are typed
  const updateAutoMonogram = () => {
    const n1 = (getVal('cfg-couple-name1') || '').trim();
    const n2 = (getVal('cfg-couple-name2') || '').trim();
    if (n1 || n2) {
      setVal('cfg-couple-monogram', `${n1 ? n1[0].toUpperCase() : 'M'}&${n2 ? n2[0].toUpperCase() : 'J'}`);
    }
  };
  document.getElementById('cfg-couple-name1')?.addEventListener('input', updateAutoMonogram);
  document.getElementById('cfg-couple-name2')?.addEventListener('input', updateAutoMonogram);

  // Couple photo input change
  document.getElementById('cfg-couple-couplePhoto')?.addEventListener('input', (e) => {
    updateCouplePhotoPreview(e.target.value);
  });

  // Couple photo device file picker
  document.getElementById('file-couple-photo')?.addEventListener('change', function() {
    if (this.files && this.files[0]) {
      const file = this.files[0];
      const reader = new FileReader();
      reader.onload = function(e) {
        const dataUrl = e.target.result;
        setVal('cfg-couple-couplePhoto', dataUrl);
        updateCouplePhotoPreview(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  });

  // Gallery bulk device file upload
  document.getElementById('file-gallery-upload')?.addEventListener('change', function() {
    if (this.files && this.files.length) {
      const container = document.getElementById('galleryList');
      Array.from(this.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
          const div = document.createElement('div');
          div.className = 'admin__dynamic-item admin__gallery-item';
          div.style.cssText = 'display:flex; align-items:center; gap:8px; margin-bottom:8px;';
          div.innerHTML = `
            <img src="${e.target.result}" alt="Uploaded" style="width:40px; height:40px; object-fit:cover; border-radius:4px; border:1px solid #ccc; flex-shrink:0;" />
            <input type="text" value="${e.target.result}" placeholder="Device Image Uploaded" style="flex:1;" oninput="this.previousElementSibling.src = this.value" />
            <label class="admin__file-btn" style="padding:6px 10px; font-size:0.75rem; background:#4A7A9F; color:#fff; border-radius:4px; cursor:pointer; flex-shrink:0;">
              📁 Device
              <input type="file" accept="image/*" style="display:none;" onchange="handleItemFilePick(this)" />
            </label>
            <button class="admin__remove-btn" onclick="this.parentElement.remove()" style="flex-shrink:0;">✕</button>
          `;
          container.appendChild(div);
        };
        reader.readAsDataURL(file);
      });
      this.value = '';
    }
  });

  document.getElementById('addGalleryPhoto')?.addEventListener('click', () => {
    const container = document.getElementById('galleryList');
    const div = document.createElement('div');
    div.className = 'admin__dynamic-item admin__gallery-item';
    div.style.cssText = 'display:flex; align-items:center; gap:8px; margin-bottom:8px;';
    div.innerHTML = `
      <img src="assets/images/couple-placeholder.jpg" alt="Gallery item" style="width:40px; height:40px; object-fit:cover; border-radius:4px; border:1px solid #ccc; flex-shrink:0;" />
      <input type="text" value="" placeholder="Image URL or Device Upload" style="flex:1;" oninput="this.previousElementSibling.src = this.value" />
      <label class="admin__file-btn" style="padding:6px 10px; font-size:0.75rem; background:#4A7A9F; color:#fff; border-radius:4px; cursor:pointer; flex-shrink:0;">
        📁 Device
        <input type="file" accept="image/*" style="display:none;" onchange="handleItemFilePick(this)" />
      </label>
      <button class="admin__remove-btn" onclick="this.parentElement.remove()" style="flex-shrink:0;">✕</button>
    `;
    container.appendChild(div);
  });

  document.getElementById('addStoryParagraph')?.addEventListener('click', () => {
    const container = document.getElementById('storyParagraphs');
    const div = document.createElement('div');
    div.className = 'admin__dynamic-item';
    div.innerHTML = `<textarea rows="3" placeholder="Write a paragraph of your story..."></textarea><button class="admin__remove-btn" onclick="this.parentElement.remove()">✕</button>`;
    container.appendChild(div);
  });

  document.getElementById('addScheduleEvent')?.addEventListener('click', () => {
    const container = document.getElementById('scheduleEvents');
    const div = document.createElement('div');
    div.className = 'admin__schedule-item';
    div.innerHTML = `<input type="text" value="" placeholder="12:00" /><input type="text" value="" placeholder="Event title" /><button class="admin__remove-btn" onclick="this.parentElement.remove()">✕</button>`;
    container.appendChild(div);
  });

  document.getElementById('addTransport')?.addEventListener('click', () => {
    const container = document.getElementById('transportList');
    const div = document.createElement('div');
    div.className = 'admin__dynamic-item';
    div.innerHTML = `<input type="text" value="" placeholder="Transport option" /><button class="admin__remove-btn" onclick="this.parentElement.remove()">✕</button>`;
    container.appendChild(div);
  });

  document.getElementById('addHotel')?.addEventListener('click', () => {
    if (!config.travel) config.travel = {};
    if (!config.travel.hotels) config.travel.hotels = [];
    config.travel.hotels.push({ name: '', type: 'additional', label: 'ADDITIONAL', address: '', phone: '', mapsUrl: '' });
    renderHotels();
  });

  // ═══════════════════════════════
  // SAVE
  // ═══════════════════════════════
  document.getElementById('saveBtn')?.addEventListener('click', () => {
    readFields();
    localStorage.setItem('wedding_config', JSON.stringify(config));
    const status = document.getElementById('saveStatus');
    if (status) {
      status.textContent = '✅ Changes saved!';
      setTimeout(() => { status.textContent = ''; }, 3000);
    }
  });

  // ═══════════════════════════════
  // EXPORT / IMPORT
  // ═══════════════════════════════
  document.getElementById('exportBtn')?.addEventListener('click', () => {
    readFields();
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding-config.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('importBtn')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
      try {
        config = JSON.parse(event.target.result);
        localStorage.setItem('wedding_config', JSON.stringify(config));
        populateFields();
        const status = document.getElementById('saveStatus');
        if (status) {
          status.textContent = '✅ Config imported!';
          setTimeout(() => { status.textContent = ''; }, 3000);
        }
      } catch (err) {
        alert('Error reading config file: ' + err.message);
      }
    };
    reader.readAsText(file);
  });

  // ─── Helpers ───
  function setVal(id, val) { const el = document.getElementById(id); if (el && val !== undefined) el.value = val; }
  function getVal(id) { const el = document.getElementById(id); return el ? el.value : ''; }
  function setChecked(id, val) { const el = document.getElementById(id); if (el) el.checked = val; }
  function getChecked(id) { const el = document.getElementById(id); return el ? el.checked : false; }

  // ─── Init ───
  populateFields();
})();
