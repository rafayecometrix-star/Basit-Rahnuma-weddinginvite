/**
 * DASHBOARD APP
 * Real-time display, search, filter, CSV export, and deletion of RSVP responses.
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'wedding_rsvp_responses';
  let responses = [];
  let currentFilter = 'all';
  let searchQuery = '';

  function loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      responses = stored ? JSON.parse(stored) : [];
    } catch (e) {
      responses = [];
    }
  }

  function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
  }

  function updateStats() {
    const total = responses.length;
    const attending = responses.filter(r => r.attending === 'yes').length;
    const declined = responses.filter(r => r.attending === 'no').length;
    const headcount = responses.reduce((acc, r) => acc + (parseInt(r.guestCount) || 0), 0);

    document.getElementById('statTotal').textContent = total;
    document.getElementById('statAttending').textContent = attending;
    document.getElementById('statDeclined').textContent = declined;
    document.getElementById('statHeadcount').textContent = headcount;
  }

  function renderTable() {
    const tbody = document.getElementById('responsesTableBody');
    const emptyState = document.getElementById('emptyState');
    const table = document.getElementById('responsesTable');

    if (!tbody) return;

    // Filter responses
    let filtered = responses.filter(r => {
      if (currentFilter === 'yes' && r.attending !== 'yes') return false;
      if (currentFilter === 'no' && r.attending !== 'no') return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = (r.name || '').toLowerCase().includes(q);
        const matchesMsg = (r.message || '').toLowerCase().includes(q);
        const matchesTransport = (r.transportation || '').toLowerCase().includes(q);
        return matchesName || matchesMsg || matchesTransport;
      }
      return true;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = '';
      emptyState.classList.add('is-visible');
      table.style.display = responses.length === 0 ? 'none' : '';
      return;
    }

    emptyState.classList.remove('is-visible');
    table.style.display = '';

    tbody.innerHTML = filtered.map((r, idx) => {
      const dateFormatted = r.timestamp
        ? new Date(r.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        : '—';
      const isYes = r.attending === 'yes';
      const badge = isYes
        ? '<span class="badge badge--success">✓ Attending</span>'
        : '<span class="badge badge--danger">✕ Declined</span>';

      return `
        <tr>
          <td><strong>${escapeHtml(r.name || 'Anonymous')}</strong></td>
          <td>${badge}</td>
          <td>${isYes ? (r.guestCount || 1) : '—'}</td>
          <td style="max-width:250px; white-space:pre-wrap;">${escapeHtml(r.message || '—')}</td>
          <td style="color:var(--dash-text-muted); font-size:0.75rem;">${dateFormatted}</td>
          <td>
            <button class="btn-delete-row" data-id="${r.id || idx}" title="Delete response">✕</button>
          </td>
        </tr>
      `;
    }).join('');

    // Attach delete handlers
    tbody.querySelectorAll('.btn-delete-row').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        deleteResponse(id);
      });
    });
  }

  function deleteResponse(id) {
    responses = responses.filter((r, idx) => (r.id ? r.id !== id : String(idx) !== String(id)));
    saveData();
    updateStats();
    renderTable();
  }

  function exportCSV() {
    if (responses.length === 0) {
      alert('No RSVP data to export!');
      return;
    }

    const headers = ['Name', 'Attending', 'Guests', 'Message', 'Submitted At'];
    const rows = responses.map(r => [
      `"${(r.name || '').replace(/"/g, '""')}"`,
      r.attending === 'yes' ? 'Attending' : 'Declined',
      r.attending === 'yes' ? (r.guestCount || 1) : 0,
      `"${(r.message || '').replace(/"/g, '""')}"`,
      `"${r.timestamp || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `wedding_rsvps_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function addSampleData() {
    const sample = [
      { id: 'sample-1', name: 'Sophie Laurent', attending: 'yes', guestCount: 2, transportation: 'Shuttle Service from Hôtel Belles Rives', message: 'So thrilled for both of you! Looking forward to celebrating.', timestamp: new Date(Date.now() - 3600000 * 24).toISOString() },
      { id: 'sample-2', name: 'Alexandre & Chloe Moreau', attending: 'yes', guestCount: 2, transportation: 'Valet Parking at the venue', message: 'Wishing you endless love and happiness!', timestamp: new Date(Date.now() - 3600000 * 12).toISOString() },
      { id: 'sample-3', name: 'David Miller', attending: 'no', guestCount: 0, transportation: '', message: 'So sorry I will miss your big day! Sending you both my warmest wishes.', timestamp: new Date(Date.now() - 3600000 * 4).toISOString() },
      { id: 'sample-4', name: 'Elena Rostova', attending: 'yes', guestCount: 1, transportation: 'Shuttle Service from Hôtel Belles Rives', message: 'Counting down the days to the French Riviera celebration! 🥂', timestamp: new Date().toISOString() }
    ];
    responses = responses.concat(sample);
    saveData();
    updateStats();
    renderTable();
  }

  function clearAll() {
    if (confirm('Are you sure you want to delete all RSVP responses? This action cannot be undone.')) {
      responses = [];
      saveData();
      updateStats();
      renderTable();
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Event Listeners
  document.addEventListener('DOMContentLoaded', () => {
    loadData();
    updateStats();
    renderTable();

    // Search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        renderTable();
      });
    }

    // Filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        currentFilter = btn.dataset.filter;
        renderTable();
      });
    });

    // Buttons
    document.getElementById('btnExportCSV')?.addEventListener('click', exportCSV);
    document.getElementById('btnSeedData')?.addEventListener('click', addSampleData);
    document.getElementById('btnClearData')?.addEventListener('click', clearAll);

    // Sync across browser tabs in real time
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) {
        loadData();
        updateStats();
        renderTable();
      }
    });
  });
})();
