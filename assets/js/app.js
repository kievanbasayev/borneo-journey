// Initialize Supabase Client
const SUPABASE_URL = 'https://oclkfidoncoobzxufwrn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jbGtmaWRvbmNvb2J6eHVmd3JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxOTc2OTAsImV4cCI6MjEwMTc3MzY5MH0.k2wwBECGwBTZ-PrsKn9qiVxZ0dGEYoAF4mrIiugsDuI';
const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// Initialize Feather Icons
document.addEventListener('DOMContentLoaded', () => {
  if (typeof feather !== 'undefined') {
    feather.replace();
  }
  initApp();
});

// App State Management
const STATE = {
  currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
  activeView: 'home-view',
  searchQuery: {
    origin: '',
    destination: '',
    date: '',
    passengers: 1
  },
  selectedSchedule: null,
  passengerDetails: {},
  myBookings: JSON.parse(localStorage.getItem('myBookings')) || [],
  activeTrackingShuttle: 'BT-302', // Default selected tracking shuttle
  shuttlesList: [
    {
      id: 'BT-302',
      origin: 'Banjarmasin',
      destination: 'Palangkaraya',
      driver: 'Ahmad Subardjo',
      plate: 'DA 7712 BA',
      speed: 65,
      status: 'On Time',
      eta: '45 Menit',
      currentPos: 0.65, // percentage of journey completed
      stops: ['Banjarmasin', 'Banjarbaru', 'Palangkaraya'],
      routeCoords: [
        { cx: 660, cy: 450 }, // Banjarmasin
        { cx: 560, cy: 420 }, // Banjarbaru
        { cx: 320, cy: 260 }  // Palangkaraya
      ]
    },
    {
      id: 'BT-104',
      origin: 'Palangkaraya',
      destination: 'Sampit',
      driver: 'Dedi Kurniawan',
      plate: 'KH 8844 A',
      speed: 55,
      status: 'Delayed',
      eta: '1 Jam 15 Menit',
      currentPos: 0.35,
      stops: ['Palangkaraya', 'Sampit'],
      routeCoords: [
        { cx: 320, cy: 260 }, // Palangkaraya
        { cx: 120, cy: 200 }  // Sampit
      ]
    },
    {
      id: 'BT-209',
      origin: 'Sampit',
      destination: 'Banjarmasin',
      driver: 'Budi Santoso',
      plate: 'KH 9012 AA',
      speed: 70,
      status: 'On Time',
      eta: '2 Jam 40 Menit',
      currentPos: 0.15,
      stops: ['Sampit', 'Palangkaraya', 'Banjarbaru', 'Banjarmasin'],
      routeCoords: [
        { cx: 120, cy: 200 }, // Sampit
        { cx: 320, cy: 260 }, // Palangkaraya
        { cx: 560, cy: 420 }, // Banjarbaru
        { cx: 660, cy: 450 }  // Banjarmasin
      ]
    }
  ],
  schedulesData: JSON.parse(localStorage.getItem('schedulesData')) || [
    { id: 'S-01', origin: 'Banjarmasin', destination: 'Palangkaraya', depTime: '07:30', arrTime: '11:00', duration: '3j 30m', class: 'Executive', price: 150000, status: 'on-time', seatsAvailable: 8, plate: 'DA 1022 T', timeCategory: 'pagi' },
    { id: 'S-02', origin: 'Banjarmasin', destination: 'Palangkaraya', depTime: '13:00', arrTime: '16:30', duration: '3j 30m', class: 'Royal Executive', price: 220000, status: 'on-time', seatsAvailable: 5, plate: 'DA 8088 BS', timeCategory: 'siang' },
    { id: 'S-03', origin: 'Banjarmasin', destination: 'Palangkaraya', depTime: '19:00', arrTime: '22:30', duration: '3j 30m', class: 'Executive', price: 150000, status: 'delayed', seatsAvailable: 11, plate: 'DA 2901 X', timeCategory: 'malam' },
    
    { id: 'S-04', origin: 'Banjarbaru', destination: 'Sampit', depTime: '06:00', arrTime: '12:30', duration: '6j 30m', class: 'Executive', price: 200000, status: 'on-time', seatsAvailable: 9, plate: 'DA 1124 AC', timeCategory: 'pagi' },
    { id: 'S-05', origin: 'Banjarbaru', destination: 'Sampit', depTime: '14:30', arrTime: '21:00', duration: '6j 30m', class: 'Royal Executive', price: 280000, status: 'on-time', seatsAvailable: 4, plate: 'DA 9900 KK', timeCategory: 'siang' },
    
    { id: 'S-06', origin: 'Palangkaraya', destination: 'Banjarmasin', depTime: '08:00', arrTime: '11:30', duration: '3j 30m', class: 'Executive', price: 150000, status: 'on-time', seatsAvailable: 7, plate: 'KH 1088 T', timeCategory: 'pagi' },
    { id: 'S-07', origin: 'Palangkaraya', destination: 'Banjarmasin', depTime: '16:00', arrTime: '19:30', duration: '3j 30m', class: 'Royal Executive', price: 220000, status: 'on-time', seatsAvailable: 6, plate: 'KH 7077 P', timeCategory: 'siang' },
    
    { id: 'S-08', origin: 'Sampit', destination: 'Banjarbaru', depTime: '08:30', arrTime: '15:00', duration: '6j 30m', class: 'Executive', price: 200000, status: 'on-time', seatsAvailable: 10, plate: 'KH 1234 B', timeCategory: 'pagi' },
    { id: 'S-09', origin: 'Sampit', destination: 'Banjarbaru', depTime: '20:00', arrTime: '02:30', duration: '6j 30m', class: 'Royal Executive', price: 280000, status: 'delayed', seatsAvailable: 8, plate: 'KH 5543 AX', timeCategory: 'malam' }
  ],
  reviewsList: JSON.parse(localStorage.getItem('reviewsList')) || [
    { author: 'Rizky Pratama', rating: 5, date: '05 Agustus 2026', text: 'Sangat puas dengan layanan door-to-door. Saya dijemput tepat waktu di Banjarmasin dan diantar langsung sampai depan kantor di Palangkaraya. Kendaraan bersih dan wangi.' },
    { author: 'Siti Rahmah', rating: 5, date: '01 Agustus 2026', text: 'Nyaman sekali menggunakan kelas Royal Executive. Kursinya lebar dan empuk, ada colokan charger USB berfungsi baik, dan drivernya ramah. Pelacakan di peta sangat membantu keluarga memantau posisi saya.' },
    { author: 'Hendra Wijaya', rating: 4, date: '28 Juli 2026', text: 'Shuttle on time. Estimasi waktu perjalanan akurat. Pelayanan bagus, harga tiket sepadan dengan fasilitas jemputan.' }
  ],
  cities: JSON.parse(localStorage.getItem('cities')) || ['Banjarmasin', 'Banjarbaru', 'Palangkaraya', 'Sampit'],
  pricingEvents: JSON.parse(localStorage.getItem('pricingEvents')) || [
    { id: 'E-01', name: 'Libur Lebaran', start: '2026-08-10', end: '2026-08-17', type: 'markup-percent', value: 20 }
  ],
  routePrices: JSON.parse(localStorage.getItem('routePrices')) || [
    { origin: 'Banjarmasin', destination: 'Palangkaraya', class: 'Executive', price: 150000 },
    { origin: 'Banjarmasin', destination: 'Palangkaraya', class: 'Royal Executive', price: 220000 },
    { origin: 'Banjarbaru', destination: 'Sampit', class: 'Executive', price: 200000 },
    { origin: 'Banjarbaru', destination: 'Sampit', class: 'Royal Executive', price: 280000 },
    { origin: 'Palangkaraya', destination: 'Banjarmasin', class: 'Executive', price: 150000 },
    { origin: 'Palangkaraya', destination: 'Banjarmasin', class: 'Royal Executive', price: 220000 },
    { origin: 'Sampit', destination: 'Banjarbaru', class: 'Executive', price: 200000 },
    { origin: 'Sampit', destination: 'Banjarbaru', class: 'Royal Executive', price: 280000 }
  ]
};

function saveState() {
  localStorage.setItem('schedulesData', JSON.stringify(STATE.schedulesData));
  localStorage.setItem('reviewsList', JSON.stringify(STATE.reviewsList));
  localStorage.setItem('myBookings', JSON.stringify(STATE.myBookings));
  localStorage.setItem('currentUser', JSON.stringify(STATE.currentUser));
  localStorage.setItem('cities', JSON.stringify(STATE.cities));
  localStorage.setItem('pricingEvents', JSON.stringify(STATE.pricingEvents));
  localStorage.setItem('routePrices', JSON.stringify(STATE.routePrices));
}

// Application Entry Point
function initApp() {
  // Navigation Handler
  setupNavigation();
  
  // Search Form Handler
  setupSearchForm();
  
  // Popular Route Cards Handler
  setupPopularRoutes();
  
  // Modal / Booking flow steps
  setupBookingModal();
  
  // Fleet tracking
  setupFleetTracking();
  
  // Reviews Form setup
  setupReviewsSystem();
  
  // Support chatbot
  setupSupportChat();

  // Auth & Admin systems setup
  setupAuthSystem();
  setupAdminDashboard();

  // Load initial local storage defaults if empty
  if (!localStorage.getItem('schedulesData')) {
    saveState();
  }
  renderCityDropdowns();
  updateAuthUI();

  // Try fetching latest database state from Supabase
  initSupabaseData();
}

// 1. Navigation & View Routing
function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const logo = document.getElementById('logo-home');
  
  const switchView = (targetViewId) => {
    // Hide all views
    document.querySelectorAll('.app-view').forEach(view => {
      view.classList.remove('active');
    });
    
    // Show target view
    const targetView = document.getElementById(targetViewId);
    if (targetView) {
      targetView.classList.add('active');
    }
    
    // Update active nav link state
    navLinks.forEach(link => {
      if (link.getAttribute('data-target') === targetViewId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Specific routines per page
    if (targetViewId === 'tracking-view') {
      renderTrackingShuttles();
      animateShuttleMarker();
    }
    if (targetViewId === 'reviews-view') {
      renderReviewsFeed();
    }
    if (targetViewId === 'bookings-view') {
      renderMyBookingsList();
    }
    if (targetViewId === 'admin-view') {
      const defaultTabBtn = document.querySelector('.admin-tab-btn[data-tab="admin-schedules-tab"]');
      if (defaultTabBtn) defaultTabBtn.click();
    }
    
    STATE.activeView = targetViewId;
    window.scrollTo(0, 0);
  };

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-target');
      switchView(target);
    });
  });

  logo.addEventListener('click', (e) => {
    e.preventDefault();
    switchView('home-view');
  });

  // Handle "View All Schedules" text link in Popular routes section
  document.getElementById('view-all-schedules-link').addEventListener('click', (e) => {
    e.preventDefault();
    // Default search parameters: Banjarmasin to Palangkaraya
    STATE.searchQuery = {
      origin: 'Banjarmasin',
      destination: 'Palangkaraya',
      date: new Date().toISOString().split('T')[0],
      passengers: 1
    };
    triggerSearch();
  });
}

// 2. Search Forms & Schedules Filtration
function setupSearchForm() {
  const searchForm = document.getElementById('search-form');
  const btnBackHome = document.getElementById('btn-back-home');
  
  // Set default search date input to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  document.getElementById('search-date').value = tomorrow.toISOString().split('T')[0];

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const origin = document.getElementById('search-origin').value;
    const destination = document.getElementById('search-destination').value;
    
    if (origin === destination) {
      alert('Kota asal dan tujuan tidak boleh sama.');
      return;
    }
    
    STATE.searchQuery = {
      origin: origin,
      destination: destination,
      date: document.getElementById('search-date').value,
      passengers: parseInt(document.getElementById('search-passengers').value)
    };
    
    triggerSearch();
  });

  btnBackHome.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('schedules-view').classList.remove('active');
    document.getElementById('home-view').classList.add('active');
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('data-target') === 'home-view') link.classList.add('active');
      else link.classList.remove('active');
    });
    window.scrollTo(0, 0);
  });

  // Filters Event Listeners
  document.querySelectorAll('.time-filter, .class-filter, .sort-filter').forEach(elem => {
    elem.addEventListener('change', () => {
      renderSchedules();
    });
  });
}

function setupPopularRoutes() {
  const cards = document.querySelectorAll('.route-card');
  
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const origin = card.getAttribute('data-origin');
      const destination = card.getAttribute('data-destination');
      
      // Auto-fill widget values
      document.getElementById('search-origin').value = origin;
      document.getElementById('search-destination').value = destination;
      
      STATE.searchQuery = {
        origin: origin,
        destination: destination,
        date: document.getElementById('search-date').value || new Date().toISOString().split('T')[0],
        passengers: parseInt(document.getElementById('search-passengers').value) || 1
      };
      
      triggerSearch();
    });
  });
}

function triggerSearch() {
  // Navigation Routing to Schedules
  document.getElementById('home-view').classList.remove('active');
  document.getElementById('schedules-view').classList.add('active');
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('data-target') === 'home-view') link.classList.add('active'); // Keep Schedules mapped under Home
  });
  
  // Set Search Title details
  const formattedDate = new Date(STATE.searchQuery.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  document.getElementById('schedules-title-text').innerText = `${STATE.searchQuery.origin} ke ${STATE.searchQuery.destination} (${formattedDate})`;
  
  // Reset all filters in panel
  document.querySelectorAll('.time-filter, .class-filter').forEach(f => f.checked = false);
  document.querySelector('.sort-filter[value="low-high"]').checked = true;

  renderSchedules();
}

function renderSchedules() {
  const container = document.getElementById('schedules-list-container');
  const countDisplay = document.getElementById('results-count');
  
  // Filter base by origin and destination
  let filtered = STATE.schedulesData.filter(s => {
    return s.origin.toLowerCase() === STATE.searchQuery.origin.toLowerCase() &&
           s.destination.toLowerCase() === STATE.searchQuery.destination.toLowerCase();
  });

  // If no schedules exist in the database for this route, generate default ones!
  if (filtered.length === 0) {
    const origin = STATE.searchQuery.origin;
    const destination = STATE.searchQuery.destination;
    const baseExecPrice = STATE.routePrices.find(rp => rp.origin === origin && rp.destination === destination && rp.class === 'Executive')?.price || 150000;
    const baseRoyalPrice = STATE.routePrices.find(rp => rp.origin === origin && rp.destination === destination && rp.class === 'Royal Executive')?.price || 220000;
    
    filtered = [
      {
        id: `SD-${origin.substring(0,2).toUpperCase()}-${destination.substring(0,2).toUpperCase()}-01`,
        origin,
        destination,
        depTime: '08:30',
        arrTime: '12:00',
        duration: '3j 30m',
        class: 'Executive',
        price: baseExecPrice,
        status: 'on-time',
        seatsAvailable: 12,
        plate: 'DA 8830 BA',
        timeCategory: 'pagi'
      },
      {
        id: `SD-${origin.substring(0,2).toUpperCase()}-${destination.substring(0,2).toUpperCase()}-02`,
        origin,
        destination,
        depTime: '16:00',
        arrTime: '19:30',
        duration: '3j 30m',
        class: 'Royal Executive',
        price: baseRoyalPrice,
        status: 'on-time',
        seatsAvailable: 9,
        plate: 'DA 1600 RA',
        timeCategory: 'siang'
      }
    ];
    
    // Adjust duration and arrival times for longer journeys
    const isLongDistance = (origin.includes('Sampit') || destination.includes('Sampit') || origin.includes('Pangkalan') || destination.includes('Pangkalan')) &&
                           (origin.includes('Banjarmasin') || destination.includes('Banjarmasin') || origin.includes('Banjarbaru') || destination.includes('Banjarbaru'));
    if (isLongDistance) {
      filtered.forEach(m => {
        m.duration = '6j 30m';
        if (m.depTime === '08:30') m.arrTime = '15:00';
        if (m.depTime === '16:00') m.arrTime = '22:30';
      });
    }
  }
  
  // Time Category Filter
  const checkedTimes = Array.from(document.querySelectorAll('.time-filter:checked')).map(cb => cb.value);
  if (checkedTimes.length > 0) {
    filtered = filtered.filter(s => checkedTimes.includes(s.timeCategory));
  }
  
  // Class Category Filter
  const checkedClasses = Array.from(document.querySelectorAll('.class-filter:checked')).map(cb => cb.value);
  if (checkedClasses.length > 0) {
    filtered = filtered.filter(s => checkedClasses.includes(s.class));
  }

  // Price sorting
  const sortBy = document.querySelector('.sort-filter:checked').value;
  if (sortBy === 'low-high') {
    filtered.sort((a, b) => a.price - b.price);
  } else {
    filtered.sort((a, b) => b.price - a.price);
  }
  
  // Display count
  countDisplay.innerText = `Menampilkan ${filtered.length} Jadwal`;
  
  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="background-color: var(--surface-container-lowest); border-radius: var(--rounded-lg); padding: 40px; text-align: center; box-shadow: var(--shadow-level1);">
        <i data-feather="frown" style="width: 48px; height: 48px; margin: 0 auto 16px auto; color: var(--outline);"></i>
        <h3 class="headline-md" style="margin-bottom: 8px;">Jadwal Tidak Ditemukan</h3>
        <p class="body-sm" style="color: var(--on-surface-variant); margin-bottom: 24px;">Maaf, tidak ada jadwal shuttle yang sesuai dengan kriteria filter Anda.</p>
        <a href="https://wa.me/6281234567890" target="_blank" class="btn btn-primary btn-icon" style="background-color: var(--secondary); border-color: var(--secondary); display: inline-flex; align-items: center; gap: 8px; margin: 0 auto;">
          <i data-feather="message-circle"></i> Hubungi Admin via WhatsApp
        </a>
      </div>
    `;
    if (typeof feather !== 'undefined') feather.replace();
    return;
  }
  
  container.innerHTML = filtered.map(s => {
    const isVIP = s.class === 'Royal Executive';
    const statusText = s.status === 'on-time' ? 'On Time' : 'Delayed';
    const statusClass = s.status === 'on-time' ? 'on-time' : 'delayed';
    
    const { finalPrice, activeEvent } = getAdjustedPrice(s, STATE.searchQuery.date);
    const formattedPrice = `Rp ${finalPrice.toLocaleString('id-ID')}`;
    
    let eventBadge = '';
    if (activeEvent) {
      const typeLabel = activeEvent.type === 'discount-percent' ? 'Diskon' : 'Peak Season';
      const valLabel = activeEvent.type === 'markup-nominal' ? `Rp ${activeEvent.value.toLocaleString('id-ID')}` : `${activeEvent.value}%`;
      const sign = activeEvent.type === 'discount-percent' ? '-' : '+';
      eventBadge = `<span class="event-price-badge" style="background-color: ${activeEvent.type === 'discount-percent' ? 'var(--secondary)' : 'var(--error)'}; color: #ffffff; font-size:10px; padding: 2px 8px; border-radius: var(--rounded-full); font-weight:700; margin-top: 4px; display:inline-block;">${activeEvent.name} (${sign}${valLabel})</span>`;
    }
    
    return `
      <div class="schedule-card" style="border-left-color: ${isVIP ? 'var(--secondary)' : 'var(--primary)'}">
        <div class="schedule-card-body">
          <div class="schedule-time-flow">
            <div class="time-box">
              <h3>${s.depTime}</h3>
              <p>${s.origin}</p>
            </div>
            
            <div class="trip-duration-line">
              <span>${s.duration}</span>
              <div class="duration-bar"></div>
              <span class="body-sm" style="font-size:11px;">Langsung</span>
            </div>
            
            <div class="time-box">
              <h3>${s.arrTime}</h3>
              <p>${s.destination}</p>
            </div>
          </div>
          
          <div class="schedule-middle">
            <span class="status-pill ${statusClass}">${statusText}</span>
            <div class="vehicle-info">
              <strong>${s.class}</strong>
              <div style="font-size: 12px; color: var(--on-surface-variant); margin-top:2px;">Toyota HiAce • ${s.plate}</div>
            </div>
          </div>
          
          <div class="schedule-right">
            <span class="price-bold">${formattedPrice}</span>
            ${eventBadge}
            <button class="btn btn-primary btn-pesan" data-id="${s.id}" style="height: 40px; min-height: 40px; margin-top: 8px;">Pesan Sekarang</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  // Set up event listeners for Book buttons
  document.querySelectorAll('.btn-pesan').forEach(btn => {
    btn.addEventListener('click', () => {
      const scheduleId = btn.getAttribute('data-id');
      const selected = STATE.schedulesData.find(s => s.id === scheduleId);
      openBookingFlow(selected);
    });
  });
  
  if (typeof feather !== 'undefined') {
    feather.replace();
  }
}

// 3. Multi-Step Booking Flow & Modals
let currentBookingStep = 1;
function setupBookingModal() {
  const modal = document.getElementById('booking-modal');
  const btnClose = document.getElementById('btn-close-modal');
  const btnNext = document.getElementById('btn-next-step');
  const btnPrev = document.getElementById('btn-prev-step');
  const btnTicketClose = document.getElementById('btn-ticket-close');
  const btnTicketDownload = document.getElementById('btn-ticket-download');
  
  btnClose.addEventListener('click', closeBookingModal);
  
  btnPrev.addEventListener('click', () => {
    if (currentBookingStep > 1) {
      goToBookingStep(currentBookingStep - 1);
    }
  });
  
  btnNext.addEventListener('click', () => {
    if (currentBookingStep === 1) {
      // Validate Passenger Details Form
      const form = document.getElementById('passenger-details-form');
      if (!form.reportValidity()) {
        return;
      }
      
      STATE.passengerDetails = {
        name: document.getElementById('passenger-name').value,
        phone: document.getElementById('passenger-phone').value,
        nik: document.getElementById('passenger-nik').value,
        notification: document.getElementById('passenger-notification').value,
        pickup: document.getElementById('passenger-pickup-address').value,
        dropoff: document.getElementById('passenger-dropoff-address').value
      };
      
      goToBookingStep(2);
    } 
    else if (currentBookingStep === 2) {
      // Trigger payment simulation
      processSimulatedPayment();
    }
  });
  
  // Payment methods toggle
  const paymentCards = document.querySelectorAll('.payment-method-card');
  paymentCards.forEach(card => {
    card.addEventListener('click', () => {
      paymentCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      
      const radioBtn = card.querySelector('input[type="radio"]');
      if (radioBtn) radioBtn.checked = true;
      
      const selectedMethod = card.getAttribute('data-method');
      
      // Hide all details
      document.querySelectorAll('.payment-method-details').forEach(el => {
        el.style.display = 'none';
      });
      
      // Show targeted detail
      const targetDetail = document.getElementById(`pay-details-${selectedMethod}`);
      if (targetDetail) {
        targetDetail.style.display = 'block';
      }
    });
  });

  btnTicketClose.addEventListener('click', () => {
    closeBookingModal();
    // Redirect to home
    document.querySelector('.nav-link[data-target=home-view]').click();
  });

  btnTicketDownload.addEventListener('click', () => {
    alert('Simulasi download E-Tiket PDF berhasil diproses ke perangkat Anda.');
  });
}

function openBookingFlow(schedule) {
  STATE.selectedSchedule = schedule;
  currentBookingStep = 1;
  
  // Reset passenger form values
  document.getElementById('passenger-name').value = '';
  document.getElementById('passenger-phone').value = '';
  document.getElementById('passenger-nik').value = '';
  document.getElementById('passenger-pickup-address').value = '';
  document.getElementById('passenger-dropoff-address').value = '';
  
  // Open modal
  const modal = document.getElementById('booking-modal');
  modal.style.display = 'flex';
  
  goToBookingStep(1);
}

function closeBookingModal() {
  document.getElementById('booking-modal').style.display = 'none';
}

function goToBookingStep(step) {
  currentBookingStep = step;
  
  // Update UI Step nodes
  document.querySelectorAll('.step-item').forEach((item, index) => {
    const idx = index + 1;
    item.classList.remove('active', 'completed');
    
    if (idx === step) {
      item.classList.add('active');
    } else if (idx < step) {
      item.classList.add('completed');
    }
  });
  
  // Toggle step bodies
  document.querySelectorAll('.booking-step').forEach(body => {
    body.classList.remove('active');
  });
  
  const targetStepBody = document.getElementById(`booking-step-${step}`);
  if (targetStepBody) targetStepBody.classList.add('active');
  
  // Update action buttons layout
  const btnPrev = document.getElementById('btn-prev-step');
  const btnNext = document.getElementById('btn-next-step');
  const actionsContainer = document.getElementById('booking-modal-actions');
  
  actionsContainer.style.display = 'flex';
  
  if (step === 1) {
    btnPrev.style.visibility = 'hidden';
    btnNext.innerText = 'Selanjutnya: Pembayaran';
  } 
  else if (step === 2) {
    btnPrev.style.visibility = 'visible';
    btnNext.innerText = 'Bayar Sekarang';
    renderPaymentSummary();
  }
}

// Seat Grid Selection Bypassed

function renderPaymentSummary() {
  const tripDetails = `${STATE.selectedSchedule.origin} ke ${STATE.selectedSchedule.destination}`;
  
  const { finalPrice, activeEvent, adjustmentAmount } = getAdjustedPrice(STATE.selectedSchedule, STATE.searchQuery.date);
  const totalCost = finalPrice * STATE.searchQuery.passengers;
  
  document.getElementById('summary-trip-details').innerText = tripDetails;
  document.getElementById('summary-trip-qty').innerText = `${STATE.searchQuery.passengers}x Tiket`;
  document.getElementById('summary-trip-class').innerText = STATE.selectedSchedule.class;
  
  const eventRow = document.getElementById('summary-event-row');
  if (activeEvent && adjustmentAmount !== 0) {
    eventRow.style.display = 'flex';
    document.getElementById('summary-event-label').innerText = `Penyesuaian: ${activeEvent.name}`;
    const sign = adjustmentAmount > 0 ? '+' : '';
    const adjTotal = adjustmentAmount * STATE.searchQuery.passengers;
    document.getElementById('summary-event-value').innerText = `${sign}Rp ${adjTotal.toLocaleString('id-ID')}`;
    document.getElementById('summary-event-value').style.color = adjustmentAmount > 0 ? 'var(--error)' : 'var(--secondary)';
  } else {
    eventRow.style.display = 'none';
  }
  
  document.getElementById('summary-trip-price').innerText = `Rp ${totalCost.toLocaleString('id-ID')}`;
}

// Simulated Digital Payment processing
function processSimulatedPayment() {
  const btnNext = document.getElementById('btn-next-step');
  const btnPrev = document.getElementById('btn-prev-step');
  
  btnNext.disabled = true;
  btnPrev.style.visibility = 'hidden';
  btnNext.innerHTML = `<span style="display:flex; align-items:center; gap:8px;"><i data-feather="loader" class="loader-anim" style="animation: spin 1s infinite linear; width:16px;"></i> Memproses Pembayaran...</span>`;
  
  if (typeof feather !== 'undefined') feather.replace();
  
  setTimeout(() => {
    // Save to user bookings
    const bookingCode = `BTX-${Math.floor(100000 + Math.random() * 900000)}`;
    const { finalPrice } = getAdjustedPrice(STATE.selectedSchedule, STATE.searchQuery.date);
    const adjustedSchedule = {
      ...STATE.selectedSchedule,
      price: finalPrice
    };

    const newBooking = {
      code: bookingCode,
      schedule: adjustedSchedule,
      passenger: STATE.passengerDetails,
      passengersCount: STATE.searchQuery.passengers,
      date: STATE.searchQuery.date,
      paymentMethod: getPaymentMethodName(document.querySelector('.payment-method-card.active').getAttribute('data-method')),
      status: 'Aktif'
    };
    
    STATE.myBookings.unshift(newBooking);
    saveState();
    
    if (supabaseClient) {
      const dbBooking = {
        code: newBooking.code,
        passenger_name: newBooking.passenger.name,
        passenger_phone: newBooking.passenger.phone,
        passenger_nik: newBooking.passenger.nik,
        pickup_address: newBooking.passenger.pickupAddress || '',
        dropoff_address: newBooking.passenger.dropoffAddress || '',
        passengers_count: newBooking.passengersCount,
        date: newBooking.date,
        payment_method: newBooking.paymentMethod,
        status: newBooking.status,
        schedule_id: newBooking.schedule.id,
        final_price: newBooking.schedule.price
      };
      supabaseClient.from('bookings').insert(dbBooking).then(() => {});
    }
    
    // Trigger success layout
    document.getElementById('booking-modal-actions').style.display = 'none';
    
    // Render E-Ticket
    renderETicketCard(newBooking);
    
    goToBookingStep('success');
    
    // Add active profile banner simulator on login
    document.getElementById('btn-login-profile').style.display = 'none';
    document.getElementById('user-avatar-block').style.display = 'flex';
    
    btnNext.disabled = false;
  }, 2000);
}

function renderETicketCard(booking) {
  const ticketBody = document.getElementById('rendered-ticket-body');
  const dateFormatted = new Date(booking.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const totalCost = booking.schedule.price * booking.passengersCount;
  
  ticketBody.innerHTML = `
    <div class="ticket-header">
      <h4>E-Tiket Resmi</h4>
      <span class="label-bold" style="background-color: var(--secondary); color:#ffffff; padding: 2px 8px; border-radius: var(--rounded-sm); font-size:10px;">${booking.status}</span>
    </div>
    
    <div class="ticket-body">
      <div class="ticket-info-grid">
        <div class="ticket-info-item">
          <label>KODE BOOKING</label>
          <span style="color:var(--primary); font-size:16px; font-weight:800;">${booking.code}</span>
        </div>
        <div class="ticket-info-item">
          <label>NAMA PENUMPANG</label>
          <span>${booking.passenger.name}</span>
        </div>
        <div class="ticket-info-item">
          <label>RUTE PERJALANAN</label>
          <span>${booking.schedule.origin} &rarr; ${booking.schedule.destination}</span>
        </div>
        <div class="ticket-info-item">
          <label>TANGGAL & WAKTU</label>
          <span>${dateFormatted}<br>Jam ${booking.schedule.depTime} WITA</span>
        </div>
        <div class="ticket-info-item">
          <label>KELAS & ARMADA</label>
          <span>${booking.schedule.class} (${booking.schedule.plate})</span>
        </div>
        <div class="ticket-info-item">
          <label>JUMLAH PENUMPANG</label>
          <span>${booking.passengersCount} Orang</span>
        </div>
      </div>
      
      <div class="ticket-divider"></div>
      
      <div class="ticket-qr-section">
        <div class="ticket-qr-code">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${booking.code}" class="ticket-qr-code-img" alt="QR E-ticket">
        </div>
        <div class="ticket-qr-text">
          <strong style="color:var(--primary); display:block; margin-bottom:4px;">Pindai Saat Boarding</strong>
          <span class="body-sm" style="font-size:11px;">Tunjukkan QR Code ini kepada driver shuttle saat penjemputan alamat. Driver akan memverifikasi data keberangkatan Anda.</span>
        </div>
      </div>
    </div>
  `;
}

// 4. My Bookings / Riwayat Perjalanan
function renderMyBookingsList() {
  const container = document.getElementById('bookings-list-container');
  
  if (STATE.myBookings.length === 0) {
    container.innerHTML = `
      <div class="empty-bookings-state">
        <i data-feather="calendar" style="width: 48px; height: 48px; margin: 0 auto 16px auto; color: var(--outline-variant);"></i>
        <h3 class="headline-md" style="margin-bottom: 8px;">Belum Ada Riwayat Perjalanan</h3>
        <p class="body-md" style="color: var(--on-surface-variant); margin-bottom: 24px;">Silakan lakukan pencarian rute dan pesan tiket shuttle pertama Anda.</p>
        <button class="btn btn-primary" onclick="document.querySelector('.nav-link[data-target=home-view]').click()">Cari Tiket Sekarang</button>
      </div>
    `;
    if (typeof feather !== 'undefined') feather.replace();
    return;
  }
  
  container.innerHTML = STATE.myBookings.map(b => {
    const dateFormatted = new Date(b.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const totalCost = b.schedule.price * b.passengersCount;
    return `
      <div style="background-color: var(--surface-container-lowest); border-radius: var(--rounded-lg); box-shadow: var(--shadow-level1); border: 1px solid var(--outline-variant); overflow:hidden; display:flex; flex-direction:column; margin-bottom: 16px;">
        <div style="background-color: var(--surface-container-low); padding:16px 24px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--surface-container-high)">
          <div>
            <span class="label-md" style="color:var(--on-surface-variant)">Kode Booking</span>
            <strong style="margin-left:8px; font-size:15px; color:var(--primary)">${b.code}</strong>
          </div>
          <span class="label-bold" style="background-color: var(--secondary-container); color: var(--on-secondary-container); padding: 4px 12px; border-radius:var(--rounded-full)">${b.status}</span>
        </div>
        
        <div style="padding:24px; display:grid; grid-template-columns: 2fr 1fr 1fr; align-items:center; gap:24px;">
          <div>
            <div style="display:flex; align-items:center; gap:16px; margin-bottom:12px;">
              <strong style="font-size:18px; color:var(--primary)">${b.schedule.origin}</strong>
              <span style="color:var(--outline)">&rarr;</span>
              <strong style="font-size:18px; color:var(--primary)">${b.schedule.destination}</strong>
            </div>
            <div class="body-sm" style="color:var(--on-surface-variant)">
              <div>Tanggal: <strong>${dateFormatted}</strong> | Jam: <strong>${b.schedule.depTime} WITA</strong></div>
              <div>Penumpang: <strong>${b.passenger.name} (${b.passengersCount} Orang)</strong></div>
            </div>
          </div>
          
          <div>
            <span class="label-md" style="display:block; color:var(--on-surface-variant); margin-bottom:4px;">Armada / Shuttle</span>
            <strong style="font-size:14px; color:var(--on-surface)">${b.schedule.class}</strong>
            <span style="display:block; font-size:11px; color:var(--on-surface-variant)">HiAce (${b.schedule.plate})</span>
          </div>

          <div style="text-align:right;">
            <button class="btn btn-outline btn-icon btn-lihat-tiket" data-code="${b.code}" style="height:40px; min-height:40px; font-size:13px;">
              <i data-feather="ticket" style="width:14px;"></i> Lihat E-Tiket
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  // Setup ticket view handlers in bookings list
  document.querySelectorAll('.btn-lihat-tiket').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.getAttribute('data-code');
      const booking = STATE.myBookings.find(b => b.code === code);
      
      const modal = document.getElementById('booking-modal');
      modal.style.display = 'flex';
      
      // Load success booking step elements directly
      goToBookingStep('success');
      document.getElementById('booking-modal-actions').style.display = 'none';
      renderETicketCard(booking);
    });
  });
  
  if (typeof feather !== 'undefined') feather.replace();
}

// 5. Real-time Fleet Tracking Engine
function setupFleetTracking() {
  // Let's create an animation loop that updates position coordinates
  setInterval(() => {
    if (STATE.activeView === 'tracking-view') {
      // Simulate slow vehicle movement along their paths
      STATE.shuttlesList.forEach(shuttle => {
        shuttle.currentPos += 0.003;
        if (shuttle.currentPos >= 1.0) {
          shuttle.currentPos = 0.0; // wrap around
        }
      });
      animateShuttleMarker();
      updateTrackingSidebarUI();
    }
  }, 1000);
}

function renderTrackingShuttles() {
  const container = document.getElementById('tracking-shuttles-list');
  updateTrackingSidebarUI();
}

function updateTrackingSidebarUI() {
  const container = document.getElementById('tracking-shuttles-list');
  if (!container) return;
  
  container.innerHTML = STATE.shuttlesList.map(s => {
    const isActive = s.id === STATE.activeTrackingShuttle;
    const statusClass = s.status === 'On Time' ? 'on-time' : 'delayed';
    const percentDone = Math.round(s.currentPos * 100);
    
    return `
      <div class="tracking-card ${isActive ? 'active' : ''}" data-id="${s.id}">
        <div class="tracking-card-header">
          <span class="shuttle-id">${s.id} (${s.plate})</span>
          <span class="status-pill ${statusClass}" style="padding:2px 8px; font-size:10px;">${s.status}</span>
        </div>
        <div class="tracking-card-body">
          <div>Rute: <strong>${s.origin} &rarr; ${s.destination}</strong></div>
          <div>Driver: <strong>${s.driver}</strong></div>
          <div>Kecepatan: <strong>${s.speed} km/j</strong></div>
          <div>Estimasi Sampai (ETA): <strong style="color:var(--primary)">${s.eta}</strong></div>
          
          <!-- Progress bar journey -->
          <div style="background-color: var(--surface-container-high); height:6px; border-radius:var(--rounded-full); margin-top:8px; overflow:hidden; position:relative;">
            <div style="width:${percentDone}%; background-color: var(--primary); height:100%; transition: width 0.5s ease-out;"></div>
          </div>
          <div style="text-align:right; font-size:10px; color:var(--on-surface-variant); margin-top:2px;">Perjalanan ${percentDone}% selesai</div>
        </div>
      </div>
    `;
  }).join('');

  // Add click events to active tracking cards
  document.querySelectorAll('.tracking-card').forEach(card => {
    card.addEventListener('click', () => {
      STATE.activeTrackingShuttle = card.getAttribute('data-id');
      document.querySelectorAll('.tracking-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      animateShuttleMarker();
    });
  });
}

// Animate Shuttle Dot position in SVG based on active tracking shuttle coordinates
function animateShuttleMarker() {
  const activeShuttle = STATE.shuttlesList.find(s => s.id === STATE.activeTrackingShuttle);
  const marker = document.getElementById('shuttle-marker-group');
  const activePathHighlight = document.getElementById('shuttle-progress-path');
  const pathD = getShuttlePathDString(activeShuttle);
  
  if (!marker || !activeShuttle) return;
  
  // Interpolate coordinates along the active path segments
  const coordsList = activeShuttle.routeCoords;
  const numSegments = coordsList.length - 1;
  const progress = activeShuttle.currentPos;
  
  // Determine which segment the shuttle is currently on
  const exactSegment = progress * numSegments;
  const segmentIndex = Math.min(Math.floor(exactSegment), numSegments - 1);
  const segmentProgress = exactSegment - segmentIndex;
  
  const startNode = coordsList[segmentIndex];
  const endNode = coordsList[segmentIndex + 1];
  
  // Linear interpolation
  const cx = startNode.cx + (endNode.cx - startNode.cx) * segmentProgress;
  const cy = startNode.cy + (endNode.cy - startNode.cy) * segmentProgress;
  
  // Apply transforms
  marker.setAttribute('transform', `translate(${cx}, ${cy})`);
  
  // Draw dashed trail behind shuttle
  let trailD = `M ${coordsList[0].cx} ${coordsList[0].cy} `;
  for (let i = 1; i <= segmentIndex; i++) {
    trailD += `L ${coordsList[i].cx} ${coordsList[i].cy} `;
  }
  trailD += `L ${cx} ${cy}`;
  
  if (activePathHighlight) {
    activePathHighlight.setAttribute('d', trailD);
  }

  // Setup interactive map nodes hover tooltips
  const tooltip = document.getElementById('map-tooltip-box');
  document.querySelectorAll('.map-city-node').forEach(node => {
    node.addEventListener('mousemove', (e) => {
      const name = node.getAttribute('data-name');
      tooltip.innerText = `Kota Transit: ${name}`;
      tooltip.style.opacity = 1;
      
      const mapBox = node.closest('.tracking-map-wrapper').getBoundingClientRect();
      tooltip.style.left = `${e.clientX - mapBox.left + 15}px`;
      tooltip.style.top = `${e.clientY - mapBox.top + 10}px`;
    });
    
    node.addEventListener('mouseleave', () => {
      tooltip.style.opacity = 0;
    });
  });
}

function getShuttlePathDString(shuttle) {
  if (!shuttle || !shuttle.routeCoords) return '';
  return `M ${shuttle.routeCoords.map(c => `${c.cx} ${c.cy}`).join(' L ')}`;
}

// 6. Testimonials Reviews & Rating Feed
function setupReviewsSystem() {
  const form = document.getElementById('add-review-form');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const author = document.getElementById('review-author-input').value;
    const rating = parseInt(document.getElementById('review-rating-input').value);
    const text = document.getElementById('review-text-input').value;
    
    const newReview = {
      author: author,
      rating: rating,
      date: 'Hari ini',
      text: text
    };
    
    STATE.reviewsList.unshift(newReview);
    saveState();
    
    if (supabaseClient) {
      supabaseClient.from('reviews').insert({
        author: newReview.author,
        rating: newReview.rating,
        date: newReview.date,
        text: newReview.text
      }).then(() => {
        initSupabaseData();
      });
    }
    
    // Reset form fields
    form.reset();
    
    // Re-render feed
    renderReviewsFeed();
    
    alert('Ulasan Anda berhasil dikirim. Terima kasih atas masukan berharga Anda!');
  });
}

function renderReviewsFeed() {
  const container = document.getElementById('reviews-feed-container');
  if (!container) return;
  
  container.innerHTML = STATE.reviewsList.map(r => {
    // Generate stars HTML
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= r.rating) {
        starsHTML += `<i data-feather="star" style="width:14px; height:14px; fill:#fbbf24; stroke:#fbbf24;"></i>`;
      } else {
        starsHTML += `<i data-feather="star" style="width:14px; height:14px; fill:none; stroke:var(--outline-variant);"></i>`;
      }
    }
    
    return `
      <div class="review-card">
        <div class="review-card-header">
          <span class="review-author">${r.author}</span>
          <span class="review-date">${r.date}</span>
        </div>
        <div class="review-stars">${starsHTML}</div>
        <p class="review-text body-sm">${r.text}</p>
      </div>
    `;
  }).join('');
  
  // Render overview huge stars
  let hugeStars = '';
  for (let i = 1; i <= 5; i++) {
    hugeStars += `<i data-feather="star" style="width:20px; height:20px; fill:#fbbf24; stroke:#fbbf24; margin-right:4px;"></i>`;
  }
  document.getElementById('overview-stars').innerHTML = hugeStars;
  
  if (typeof feather !== 'undefined') feather.replace();
}

// 7. Customer Support AI Chatbot Simulator
function setupSupportChat() {
  const btnToggle = document.getElementById('btn-chat-toggle');
  const chatBox = document.getElementById('cs-chat-box');
  const chatForm = document.getElementById('cs-chat-form');
  const chatInput = document.getElementById('cs-chat-input-text');
  const chatThread = document.getElementById('chat-messages-thread');
  
  btnToggle.addEventListener('click', () => {
    chatBox.classList.toggle('active');
    const isActive = chatBox.classList.contains('active');
    
    document.getElementById('chat-icon-active').style.display = isActive ? 'none' : 'block';
    document.getElementById('chat-icon-inactive').style.display = isActive ? 'block' : 'none';
  });

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = chatInput.value.trim();
    if (!query) return;
    
    // Add user output message
    appendChatMessage(query, 'outgoing');
    chatInput.value = '';
    
    // Simulating response loader
    setTimeout(() => {
      const response = generateBotResponse(query);
      appendChatMessage(response, 'incoming');
    }, 1000);
  });
}

function appendChatMessage(msg, direction) {
  const chatThread = document.getElementById('chat-messages-thread');
  const bubble = document.createElement('div');
  bubble.className = `chat-message ${direction}`;
  bubble.innerText = msg;
  chatThread.appendChild(bubble);
  chatThread.scrollTop = chatThread.scrollHeight;
}

function generateBotResponse(query) {
  const text = query.toLowerCase();
  
  if (text.includes('jadwal') || text.includes('jam') || text.includes('berangkat')) {
    return 'Jadwal BorneoJourney beroperasi dari pagi hari pukul 06:00 hingga malam hari pukul 20:00 WITA. Anda dapat melihat jadwal lengkap terupdate pada halaman utama "Schedules" di bagian pencarian tiket.';
  }
  if (text.includes('harga') || text.includes('biaya') || text.includes('tarif') || text.includes('ongkos')) {
    return 'Tarif rute Banjarmasin - Palangkaraya adalah Rp 150.000 untuk kelas Executive dan Rp 220.000 untuk kelas Royal Premier. Untuk rute Banjarbaru - Sampit seharga Rp 200.000 (Executive) dan Rp 280.000 (Royal Premier).';
  }
  if (text.includes('jemput') || text.includes('antar') || text.includes('door')) {
    return 'Layanan kami bersifat door-to-door (jemput antar alamat). Cukup isi alamat lengkap penjemputan dan pengantaran Anda saat memesan tiket di aplikasi, driver kami akan langsung menjemput depan rumah Anda.';
  }
  if (text.includes('batal') || text.includes('cancel') || text.includes('reschedule') || text.includes('ubah')) {
    return 'Pembatalan atau perubahan jadwal tiket dapat diajukan secara gratis minimal 6 jam sebelum waktu keberangkatan dengan menghubungi hotline WhatsApp kami di nomor +62 811-5555-900.';
  }
  if (text.includes('kursi') || text.includes('tempat duduk')) {
    return 'Nomor kursi perjalanan Anda akan ditentukan secara optimal oleh administrator atau driver kami pada saat penjemputan alamat untuk memastikan kenyamanan semua penumpang.';
  }
  if (text.includes('gopay') || text.includes('ovo') || text.includes('bayar') || text.includes('transfer')) {
    return 'Kami mendukung pembayaran modern melalui e-Wallet (GoPay, OVO, ShopeePay) serta transfer bank langsung (BCA, Mandiri, BNI) untuk memudahkan verifikasi otomatis.';
  }
  
  return 'Terima kasih atas pesan Anda. Silakan hubungi hotline WhatsApp Customer Service kami di nomor +62 811-5555-900 untuk berbicara langsung dengan staf BorneoJourney terkait detail kendala khusus Anda.';
}

// 8. Auth & Login Modal System
function setupAuthSystem() {
  const btnLoginProfile = document.getElementById('btn-login-profile');
  const loginModal = document.getElementById('login-modal');
  const btnCloseLogin = document.getElementById('btn-close-login');
  const loginTabs = document.querySelectorAll('.login-tab');
  const loginForm = document.getElementById('login-form');
  const btnQuickFill = document.getElementById('btn-quick-fill');
  const profileForm = document.getElementById('profile-update-form');

  btnLoginProfile.addEventListener('click', (e) => {
    if (STATE.currentUser) {
      logoutUser();
    } else {
      loginModal.style.display = 'flex';
    }
  });

  btnCloseLogin.addEventListener('click', () => {
    loginModal.style.display = 'none';
  });

  loginTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      loginTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const role = tab.getAttribute('data-role');
      document.getElementById('login-role').value = role;
      
      const emailText = role === 'admin' ? 'admin@mail.com' : '081234567890 (atau pelanggan@mail.com)';
      const passText = role === 'admin' ? 'admin123' : 'user123';
      const hintLabel = role === 'admin' ? 'Akun Demo Administrator:' : 'Akun Demo Pelanggan:';
      
      document.getElementById('login-credentials-hint').querySelector('strong').innerText = hintLabel;
      document.getElementById('login-credentials-hint').querySelectorAll('span')[0].innerText = emailText;
      document.getElementById('login-credentials-hint').querySelectorAll('span')[1].innerText = passText;

      // Update input labels and placeholder dynamically
      const identifierLabel = document.getElementById('login-identifier-label');
      const identifierInput = document.getElementById('login-email');
      if (identifierLabel && identifierInput) {
        if (role === 'admin') {
          identifierLabel.innerText = 'Alamat Email';
          identifierInput.placeholder = 'nama@domain.com';
        } else {
          identifierLabel.innerText = 'Nomor WhatsApp atau Email';
          identifierInput.placeholder = 'Contoh: 0812XXXXXXXX atau nama@domain.com';
        }
      }
    });
  });

  btnQuickFill.addEventListener('click', (e) => {
    e.preventDefault();
    const role = document.getElementById('login-role').value;
    document.getElementById('login-email').value = role === 'admin' ? 'admin@mail.com' : '081234567890';
    document.getElementById('login-password').value = role === 'admin' ? 'admin123' : 'user123';
  });

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-password').value.trim();
    const role = document.getElementById('login-role').value;

    if (role === 'admin') {
      if (email === 'admin@mail.com' && pass === 'admin123') {
        STATE.currentUser = { email, role: 'admin' };
        saveState();
        updateAuthUI();
        loginModal.style.display = 'none';
        alert('Berhasil masuk sebagai Administrator!');
      } else {
        alert('Email atau kata sandi Admin salah.');
      }
    } else {
      const isValidCustomer = (email === 'pelanggan@mail.com' || email === '081234567890' || email === '08123456789') && pass === 'user123';
      if (isValidCustomer) {
        STATE.currentUser = {
          email: email.includes('@') ? email : 'pelanggan@mail.com',
          role: 'customer',
          profile: STATE.currentUser?.profile || {
            name: 'Andi Setiawan',
            phone: email.includes('@') ? '081234567890' : email,
            nik: '6371020304050001'
          }
        };
        saveState();
        updateAuthUI();
        loginModal.style.display = 'none';
        alert('Berhasil masuk sebagai Pelanggan!');
      } else {
        alert('Nomor WhatsApp / Email atau kata sandi Pelanggan salah.');
      }
    }
  });

  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!STATE.currentUser || STATE.currentUser.role !== 'customer') return;
      
      STATE.currentUser.profile = {
        name: document.getElementById('profile-name').value.trim(),
        phone: document.getElementById('profile-phone').value.trim(),
        nik: document.getElementById('profile-nik').value.trim()
      };
      
      document.getElementById('profile-card-name').innerText = STATE.currentUser.profile.name;
      saveState();
      alert('Profil Anda berhasil diperbarui!');
    });
  }
}

function logoutUser() {
  if (confirm('Apakah Anda yakin ingin keluar?')) {
    STATE.currentUser = null;
    saveState();
    updateAuthUI();
    
    document.querySelector('.nav-link[data-target=home-view]').click();
    alert('Anda telah keluar.');
  }
}

function updateAuthUI() {
  const btnLoginProfile = document.getElementById('btn-login-profile');
  const avatarBlock = document.getElementById('user-avatar-block');
  const adminBanner = document.getElementById('admin-mode-indicator');
  const navAdmin = document.getElementById('nav-admin');
  const profileCard = document.getElementById('profile-edit-card');
  const bookingsList = document.getElementById('bookings-list-container');
  
  if (STATE.currentUser) {
    btnLoginProfile.innerText = 'Sign Out';
    
    if (STATE.currentUser.role === 'admin') {
      avatarBlock.style.display = 'none';
      adminBanner.classList.add('active');
      navAdmin.style.display = 'block';
      profileCard.style.display = 'none';
      bookingsList.style.gridColumn = '1 / span 2';
    } else {
      avatarBlock.style.display = 'block';
      adminBanner.classList.remove('active');
      navAdmin.style.display = 'none';
      profileCard.style.display = 'block';
      bookingsList.style.gridColumn = 'span 1';
      
      const profile = STATE.currentUser.profile || { name: '', phone: '', nik: '' };
      document.getElementById('profile-card-name').innerText = profile.name || 'Nama Pengguna';
      document.getElementById('profile-card-email').innerText = STATE.currentUser.email;
      
      document.getElementById('profile-name').value = profile.name || '';
      document.getElementById('profile-phone').value = profile.phone || '';
      document.getElementById('profile-nik').value = profile.nik || '';
    }
  } else {
    btnLoginProfile.innerText = 'Sign In';
    avatarBlock.style.display = 'none';
    adminBanner.classList.remove('active');
    navAdmin.style.display = 'none';
    profileCard.style.display = 'none';
    bookingsList.style.gridColumn = '1 / span 2';
  }
  
  renderMyBookingsList();
}

// 9. Admin Panel Dashboard (CRUD Rutes & Reviews)
function setupAdminDashboard() {
  const adminTabBtns = document.querySelectorAll('.admin-tab-btn');
  const adminTabContents = document.querySelectorAll('.admin-tab-content');
  const adminScheduleForm = document.getElementById('admin-schedule-form');
  const btnCancelEdit = document.getElementById('btn-admin-schedule-cancel');
  const btnAdminLogout = document.getElementById('btn-admin-logout');

  if (btnAdminLogout) btnAdminLogout.addEventListener('click', logoutUser);

  adminTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      adminTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const tabTarget = btn.getAttribute('data-tab');
      adminTabContents.forEach(content => {
        if (content.id === tabTarget) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
      
      if (tabTarget === 'admin-schedules-tab') renderAdminSchedules();
      if (tabTarget === 'admin-routes-tab') renderAdminCities();
      if (tabTarget === 'admin-pricing-tab') renderAdminPricing();
      if (tabTarget === 'admin-events-tab') renderAdminEvents();
      if (tabTarget === 'admin-reviews-tab') renderAdminReviews();
    });
  });

  const adminCityForm = document.getElementById('admin-city-form');
  if (adminCityForm) {
    adminCityForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!STATE.currentUser || STATE.currentUser.role !== 'admin') return;
      
      const cityName = document.getElementById('admin-city-name').value.trim();
      if (!cityName) return;
      
      if (STATE.cities.map(c => c.toLowerCase()).includes(cityName.toLowerCase())) {
        alert('Kota ini sudah terdaftar.');
        return;
      }
      
      STATE.cities.push(cityName);
      saveState();
      if (supabaseClient) supabaseClient.from('cities').insert({ name: cityName }).then(() => {});
      document.getElementById('admin-city-name').value = '';
      
      renderCityDropdowns();
      renderAdminCities();
      alert(`Kota ${cityName} berhasil ditambahkan!`);
    });
  }

  const adminEventForm = document.getElementById('admin-event-form');
  if (adminEventForm) {
    adminEventForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!STATE.currentUser || STATE.currentUser.role !== 'admin') return;
      
      const name = document.getElementById('admin-event-name').value.trim();
      const start = document.getElementById('admin-event-start').value;
      const end = document.getElementById('admin-event-end').value;
      const type = document.getElementById('admin-event-type').value;
      const value = parseInt(document.getElementById('admin-event-value').value);
      
      if (new Date(start) > new Date(end)) {
        alert('Tanggal mulai tidak boleh setelah tanggal selesai.');
        return;
      }
      
      const newEvent = {
        id: 'E-' + Math.floor(10 + Math.random() * 90),
        name, start, end, type, value
      };
      
      STATE.pricingEvents.push(newEvent);
      saveState();
      if (supabaseClient) supabaseClient.from('pricing_events').insert(newEvent).then(() => {});
      
      adminEventForm.reset();
      renderAdminEvents();
      alert(`Aturan harga event ${name} berhasil disimpan!`);
    });
  }

  const adminSimForm = document.getElementById('admin-sim-form');
  if (adminSimForm) {
    ['admin-sim-origin', 'admin-sim-destination', 'admin-sim-class', 'admin-sim-date'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', runPricingSimulation);
    });

    adminSimForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!STATE.currentUser || STATE.currentUser.role !== 'admin') return;

      const origin = document.getElementById('admin-sim-origin').value;
      const destination = document.getElementById('admin-sim-destination').value;
      const sClass = document.getElementById('admin-sim-class').value;
      const newPrice = parseInt(document.getElementById('admin-sim-new-price').value);

      if (!origin || !destination) {
        alert('Silakan pilih kota asal dan tujuan.');
        return;
      }
      if (origin === destination) {
        alert('Kota asal dan tujuan tidak boleh sama.');
        return;
      }
      if (isNaN(newPrice) || newPrice <= 0) {
        alert('Silakan masukkan nilai harga baru yang valid.');
        return;
      }

      const idx = STATE.routePrices.findIndex(rp => rp.origin === origin && rp.destination === destination && rp.class === sClass);
      if (idx !== -1) {
        STATE.routePrices[idx].price = newPrice;
      } else {
        STATE.routePrices.push({ origin, destination, class: sClass, price: newPrice });
      }

      let updatedSchedules = 0;
      STATE.schedulesData.forEach(s => {
        if (s.origin === origin && s.destination === destination && s.class === sClass) {
          s.price = newPrice;
          updatedSchedules++;
        }
      });

      saveState();
      if (supabaseClient) {
        supabaseClient.from('route_prices').select('id').eq('origin', origin).eq('destination', destination).eq('class', sClass)
          .then(({ data }) => {
            if (data && data.length > 0) {
              supabaseClient.from('route_prices').update({ price: newPrice }).eq('id', data[0].id).then(() => {});
            } else {
              supabaseClient.from('route_prices').insert({ origin, destination, class: sClass, price: newPrice }).then(() => {});
            }
          });
        supabaseClient.from('schedules').update({ price: newPrice }).eq('origin', origin).eq('destination', destination).eq('class', sClass).then(() => {});
      }
      runPricingSimulation();
      renderAdminPricing();
      
      alert(`Harga dasar rute ${origin} -> ${destination} (${sClass}) berhasil diperbarui menjadi Rp ${newPrice.toLocaleString('id-ID')} untuk ${updatedSchedules} jadwal aktif.`);
    });
  }

  const scheduleInputs = ['admin-schedule-origin', 'admin-schedule-destination', 'admin-schedule-class'];
  scheduleInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', () => {
        const currentSchedId = document.getElementById('admin-schedule-id').value;
        if (currentSchedId) return;

        const origin = document.getElementById('admin-schedule-origin').value;
        const destination = document.getElementById('admin-schedule-destination').value;
        const sClass = document.getElementById('admin-schedule-class').value;

        if (origin && destination && sClass) {
          const match = STATE.routePrices.find(rp => rp.origin === origin && rp.destination === destination && rp.class === sClass);
          if (match) {
            document.getElementById('admin-schedule-price').value = match.price;
          }
        }
      });
    }
  });

  if (btnCancelEdit) {
    btnCancelEdit.addEventListener('click', () => {
      resetAdminScheduleForm();
    });
  }

  if (adminScheduleForm) {
    adminScheduleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!STATE.currentUser || STATE.currentUser.role !== 'admin') return;

      const id = document.getElementById('admin-schedule-id').value;
      const origin = document.getElementById('admin-schedule-origin').value;
      const destination = document.getElementById('admin-schedule-destination').value;
      const depTime = document.getElementById('admin-schedule-deptime').value.trim();
      const arrTime = document.getElementById('admin-schedule-arrtime').value.trim();
      const sClass = document.getElementById('admin-schedule-class').value;
      const price = parseInt(document.getElementById('admin-schedule-price').value);
      const plate = document.getElementById('admin-schedule-plate').value.trim();
      const status = document.getElementById('admin-schedule-status').value;

      if (origin === destination) {
        alert('Kota asal dan tujuan tidak boleh sama.');
        return;
      }

      let timeCategory = 'pagi';
      const hour = parseInt(depTime.split(':')[0]) || 8;
      if (hour >= 12 && hour < 17) timeCategory = 'siang';
      else if (hour >= 17 || hour < 6) timeCategory = 'malam';

      let duration = '3j 30m';
      if ((origin.includes('Sampit') && destination.includes('Banjarbaru')) || 
          (origin.includes('Banjarbaru') && destination.includes('Sampit'))) {
        duration = '6j 30m';
      }

      if (id) {
        const idx = STATE.schedulesData.findIndex(s => s.id === id);
        if (idx !== -1) {
          STATE.schedulesData[idx] = {
            ...STATE.schedulesData[idx],
            origin, destination, depTime, arrTime, duration, class: sClass, price, plate, status, timeCategory
          };
          alert('Jadwal keberangkatan berhasil diperbarui!');
        }
      } else {
        const newId = 'S-' + Math.floor(10 + Math.random() * 90);
        const newSchedule = {
          id: newId,
          origin, destination, depTime, arrTime, duration, class: sClass, price, plate, status, seatsAvailable: sClass.includes('Royal') ? 9 : 12, timeCategory
        };
        STATE.schedulesData.push(newSchedule);
        alert('Jadwal keberangkatan baru berhasil ditambahkan!');
      }

      saveState();
      if (supabaseClient) {
        const finalId = id || ('S-' + Math.floor(10 + Math.random() * 90));
        const dbSched = {
          id: finalId,
          origin,
          destination,
          dep_time: depTime,
          arr_time: arrTime,
          duration,
          class: sClass,
          price,
          status,
          seats_available: id ? STATE.schedulesData.find(s => s.id === id).seatsAvailable : (sClass.includes('Royal') ? 9 : 12),
          plate,
          time_category: timeCategory
        };
        supabaseClient.from('schedules').upsert(dbSched).then(() => {});
      }
      resetAdminScheduleForm();
      renderAdminSchedules();
    });
  }
}

function renderAdminSchedules() {
  const tbody = document.getElementById('admin-schedules-table-body');
  if (!tbody) return;

  if (STATE.schedulesData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Tidak ada jadwal keberangkatan.</td></tr>`;
    return;
  }

  tbody.innerHTML = STATE.schedulesData.map(s => {
    return `
      <tr>
        <td>
          <strong>${s.origin} &rarr; ${s.destination}</strong><br>
          <span style="font-size:11px; color:var(--on-surface-variant)">Waktu: ${s.depTime} - ${s.arrTime}</span>
        </td>
        <td><span class="admin-action-badge">${s.class}</span></td>
        <td>Rp ${s.price.toLocaleString('id-ID')}</td>
        <td>${s.plate}</td>
        <td>
          <span class="status-pill ${s.status === 'on-time' ? 'on-time' : 'delayed'}" style="font-size:10px; padding:2px 8px;">
            ${s.status === 'on-time' ? 'On Time' : 'Delayed'}
          </span>
        </td>
        <td>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-outline btn-small btn-edit-schedule" data-id="${s.id}">Edit</button>
            <button class="btn btn-secondary btn-small btn-delete-schedule" data-id="${s.id}" style="background-color:var(--error); color:var(--on-color)">Hapus</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  document.querySelectorAll('.btn-edit-schedule').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const item = STATE.schedulesData.find(s => s.id === id);
      if (item) {
        document.getElementById('admin-schedule-id').value = item.id;
        document.getElementById('admin-schedule-origin').value = item.origin;
        document.getElementById('admin-schedule-destination').value = item.destination;
        document.getElementById('admin-schedule-deptime').value = item.depTime;
        document.getElementById('admin-schedule-arrtime').value = item.arrTime;
        document.getElementById('admin-schedule-class').value = item.class;
        document.getElementById('admin-schedule-price').value = item.price;
        document.getElementById('admin-schedule-plate').value = item.plate;
        document.getElementById('admin-schedule-status').value = item.status;

        document.getElementById('admin-schedule-form-title').innerText = 'Edit Jadwal Keberangkatan';
        document.getElementById('btn-admin-schedule-submit').innerText = 'Update Jadwal';
        document.getElementById('btn-admin-schedule-cancel').style.display = 'block';
      }
    });
  });

  document.querySelectorAll('.btn-delete-schedule').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      if (confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
        STATE.schedulesData = STATE.schedulesData.filter(s => s.id !== id);
        saveState();
        if (supabaseClient) supabaseClient.from('schedules').delete().eq('id', id).then(() => {});
        renderAdminSchedules();
      }
    });
  });
}

function resetAdminScheduleForm() {
  const form = document.getElementById('admin-schedule-form');
  if (form) form.reset();
  const idField = document.getElementById('admin-schedule-id');
  if (idField) idField.value = '';
  
  const title = document.getElementById('admin-schedule-form-title');
  if (title) title.innerText = 'Tambah Jadwal Baru';
  
  const submitBtn = document.getElementById('btn-admin-schedule-submit');
  if (submitBtn) submitBtn.innerText = 'Simpan Jadwal';
  
  const cancelBtn = document.getElementById('btn-admin-schedule-cancel');
  if (cancelBtn) cancelBtn.style.display = 'none';
}

function renderAdminReviews() {
  const tbody = document.getElementById('admin-reviews-table-body');
  if (!tbody) return;

  if (STATE.reviewsList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Tidak ada ulasan.</td></tr>`;
    return;
  }

  tbody.innerHTML = STATE.reviewsList.map((r, index) => {
    return `
      <tr>
        <td><strong>${r.author}</strong></td>
        <td>${r.date}</td>
        <td><span style="color:#fbbf24; font-weight:700;">${r.rating} ★</span></td>
        <td><p style="max-width:350px; font-style:italic;">"${r.text}"</p></td>
        <td>
          <button class="btn btn-secondary btn-small btn-delete-review" data-idx="${index}" style="background-color:var(--error); color:var(--on-error)">Hapus</button>
        </td>
      </tr>
    `;
  }).join('');

  document.querySelectorAll('.btn-delete-review').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'));
      if (confirm('Apakah Anda yakin ingin menghapus ulasan ini?')) {
        const targetReview = STATE.reviewsList[idx];
        STATE.reviewsList.splice(idx, 1);
        saveState();
        if (supabaseClient && targetReview && targetReview.id) {
          supabaseClient.from('reviews').delete().eq('id', targetReview.id).then(() => {});
        }
        renderAdminReviews();
      }
    });
  });
}

function getAdjustedPrice(schedule, date) {
  if (!date) {
    return { finalPrice: schedule.price, activeEvent: null, adjustmentAmount: 0 };
  }
  
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  const activeEvent = STATE.pricingEvents.find(ev => {
    const start = new Date(ev.start);
    start.setHours(0, 0, 0, 0);
    const end = new Date(ev.end);
    end.setHours(23, 59, 59, 999);
    return targetDate >= start && targetDate <= end;
  });
  
  if (!activeEvent) {
    return { finalPrice: schedule.price, activeEvent: null, adjustmentAmount: 0 };
  }
  
  let adjustmentAmount = 0;
  let finalPrice = schedule.price;
  
  if (activeEvent.type === 'markup-percent') {
    adjustmentAmount = Math.round(schedule.price * (activeEvent.value / 100));
    finalPrice = schedule.price + adjustmentAmount;
  } else if (activeEvent.type === 'markup-nominal') {
    adjustmentAmount = activeEvent.value;
    finalPrice = schedule.price + adjustmentAmount;
  } else if (activeEvent.type === 'discount-percent') {
    adjustmentAmount = Math.round(schedule.price * (activeEvent.value / 100));
    finalPrice = schedule.price - adjustmentAmount;
    adjustmentAmount = -adjustmentAmount;
  }
  
  return { finalPrice, activeEvent, adjustmentAmount };
}

function renderCityDropdowns() {
  const dropdowns = [
    document.getElementById('search-origin'),
    document.getElementById('search-destination'),
    document.getElementById('admin-schedule-origin'),
    document.getElementById('admin-schedule-destination'),
    document.getElementById('admin-sim-origin'),
    document.getElementById('admin-sim-destination')
  ];
  
  dropdowns.forEach(select => {
    if (!select) return;
    const currentValue = select.value;
    
    select.innerHTML = '';
    
    // Add placeholder options for search inputs
    if (select.id.startsWith('search-')) {
      const isOrigin = select.id.endsWith('origin');
      const placeholderOpt = document.createElement('option');
      placeholderOpt.value = '';
      placeholderOpt.disabled = true;
      placeholderOpt.selected = !currentValue;
      placeholderOpt.innerText = isOrigin ? 'Pilih Kota Asal' : 'Pilih Kota Tujuan';
      select.appendChild(placeholderOpt);
    }
    
    STATE.cities.forEach(city => {
      const opt = document.createElement('option');
      opt.value = city;
      opt.innerText = city;
      select.appendChild(opt);
    });
    
    if (currentValue && STATE.cities.includes(currentValue)) {
      select.value = currentValue;
    }
  });
}

function renderAdminCities() {
  const tbody = document.getElementById('admin-cities-table-body');
  if (!tbody) return;
  
  if (STATE.cities.length === 0) {
    tbody.innerHTML = `<tr><td colspan="2" style="text-align:center;">Tidak ada kota terdaftar.</td></tr>`;
    return;
  }
  
  tbody.innerHTML = STATE.cities.map(city => {
    return `
      <tr>
        <td><strong>${city}</strong></td>
        <td style="text-align: center;">
          <button class="btn btn-secondary btn-small btn-delete-city" data-city="${city}" style="background-color:var(--error); color:var(--on-error)">Hapus</button>
        </td>
      </tr>
    `;
  }).join('');
  
  document.querySelectorAll('.btn-delete-city').forEach(btn => {
    btn.addEventListener('click', () => {
      const city = btn.getAttribute('data-city');
      if (confirm(`Apakah Anda yakin ingin menghapus kota ${city}?`)) {
        STATE.cities = STATE.cities.filter(c => c !== city);
        saveState();
        renderCityDropdowns();
        renderAdminCities();
      }
    });
  });
}

function renderAdminEvents() {
  const tbody = document.getElementById('admin-events-table-body');
  if (!tbody) return;
  
  if (STATE.pricingEvents.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Tidak ada aturan harga event terdaftar.</td></tr>`;
    return;
  }
  
  tbody.innerHTML = STATE.pricingEvents.map(ev => {
    let typeLabel = '';
    if (ev.type === 'markup-percent') typeLabel = `Markup +${ev.value}%`;
    else if (ev.type === 'markup-nominal') typeLabel = `Markup +Rp ${ev.value.toLocaleString('id-ID')}`;
    else if (ev.type === 'discount-percent') typeLabel = `Diskon -${ev.value}%`;
    
    const startF = new Date(ev.start).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    const endF = new Date(ev.end).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    
    return `
      <tr>
        <td><strong>${ev.name}</strong></td>
        <td><span style="font-size: 12px; color: var(--on-surface-variant)">${startF} - ${endF}</span></td>
        <td><span class="admin-action-badge" style="background-color:${ev.type === 'discount-percent' ? 'var(--secondary-container)' : 'var(--primary-fixed)'}; color:${ev.type === 'discount-percent' ? 'var(--on-secondary-container)' : 'var(--primary)'}; font-weight:700;">${typeLabel}</span></td>
        <td style="text-align: center;">
          <button class="btn btn-secondary btn-small btn-delete-event" data-id="${ev.id}" style="background-color:var(--error); color:var(--on-error)">Hapus</button>
        </td>
      </tr>
    `;
  }).join('');
  
  document.querySelectorAll('.btn-delete-event').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      if (confirm('Apakah Anda yakin ingin menghapus aturan event ini?')) {
        STATE.pricingEvents = STATE.pricingEvents.filter(e => e.id !== id);
        saveState();
        renderAdminEvents();
      }
    });
  });
}

function renderAdminPricing() {
  const tbody = document.getElementById('admin-pricing-table-body');
  if (!tbody) return;

  if (STATE.routePrices.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Tidak ada harga rute terdaftar.</td></tr>`;
    return;
  }

  tbody.innerHTML = STATE.routePrices.map(rp => {
    return `
      <tr>
        <td><strong>${rp.origin} &rarr; ${rp.destination}</strong></td>
        <td><span class="admin-action-badge" style="background-color: var(--surface-container-high); color: var(--on-surface-variant);">${rp.class}</span></td>
        <td><strong>Rp ${rp.price.toLocaleString('id-ID')}</strong></td>
        <td style="text-align: center;">
          <button class="btn btn-outline btn-small btn-edit-route-price" data-origin="${rp.origin}" data-destination="${rp.destination}" data-class="${rp.class}">Edit / Simulasikan</button>
        </td>
      </tr>
    `;
  }).join('');

  document.querySelectorAll('.btn-edit-route-price').forEach(btn => {
    btn.addEventListener('click', () => {
      const origin = btn.getAttribute('data-origin');
      const destination = btn.getAttribute('data-destination');
      const sClass = btn.getAttribute('data-class');

      document.getElementById('admin-sim-origin').value = origin;
      document.getElementById('admin-sim-destination').value = destination;
      document.getElementById('admin-sim-class').value = sClass;

      runPricingSimulation();
    });
  });

  const simDateInput = document.getElementById('admin-sim-date');
  if (simDateInput && !simDateInput.value) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    simDateInput.value = tomorrow.toISOString().split('T')[0];
  }

  const simOrigin = document.getElementById('admin-sim-origin');
  const simDestination = document.getElementById('admin-sim-destination');
  if (simOrigin && !simOrigin.value && STATE.cities.length > 0) {
    simOrigin.value = STATE.cities[0];
  }
  if (simDestination && !simDestination.value && STATE.cities.length > 1) {
    simDestination.value = STATE.cities[1];
  }

  runPricingSimulation();
}

function runPricingSimulation() {
  const origin = document.getElementById('admin-sim-origin')?.value;
  const destination = document.getElementById('admin-sim-destination')?.value;
  const sClass = document.getElementById('admin-sim-class')?.value;
  const simDate = document.getElementById('admin-sim-date')?.value;

  if (!origin || !destination || !sClass) return;

  const pricingMatch = STATE.routePrices.find(rp => rp.origin === origin && rp.destination === destination && rp.class === sClass);
  const basePrice = pricingMatch ? pricingMatch.price : 150000;

  const newPriceInput = document.getElementById('admin-sim-new-price');
  if (newPriceInput) {
    newPriceInput.value = basePrice;
  }

  const { finalPrice, activeEvent, adjustmentAmount } = getAdjustedPrice({ price: basePrice }, simDate);

  document.getElementById('sim-base-price').innerText = `Rp ${basePrice.toLocaleString('id-ID')}`;

  const eventLabel = document.getElementById('sim-event-name');
  const eventValue = document.getElementById('sim-event-adj');
  
  if (activeEvent && adjustmentAmount !== 0) {
    eventLabel.innerText = `Event: ${activeEvent.name}`;
    const sign = adjustmentAmount > 0 ? '+' : '';
    eventValue.innerText = `${sign}Rp ${adjustmentAmount.toLocaleString('id-ID')}`;
    eventValue.style.color = adjustmentAmount > 0 ? 'var(--error)' : 'var(--secondary)';
  } else {
    eventLabel.innerText = 'Event Penyesuaian:';
    eventValue.innerText = 'Tidak Ada';
    eventValue.style.color = 'var(--on-surface-variant)';
  }

  document.getElementById('sim-final-price').innerText = `Rp ${finalPrice.toLocaleString('id-ID')}`;
}

function getPaymentMethodName(method) {
  switch (method) {
    case 'gopay': return 'GoPay / OVO (e-Wallet)';
    case 'dana': return 'DANA / ShopeePay (QRIS)';
    case 'va-bca': return 'BCA Virtual Account';
    case 'va-mandiri': return 'Mandiri Virtual Account';
    case 'va-bni': return 'BNI Virtual Account';
    default: return 'Pembayaran Digital';
  }
}

async function initSupabaseData() {
  if (!supabaseClient) return;
  try {
    const { data: citiesData } = await supabaseClient.from('cities').select('name');
    if (citiesData && citiesData.length > 0) {
      STATE.cities = citiesData.map(c => c.name);
    }

    const { data: rPrices } = await supabaseClient.from('route_prices').select('origin, destination, class, price');
    if (rPrices && rPrices.length > 0) {
      STATE.routePrices = rPrices;
    }

    const { data: scheds } = await supabaseClient.from('schedules').select('*');
    if (scheds && scheds.length > 0) {
      STATE.schedulesData = scheds.map(s => ({
        id: s.id,
        origin: s.origin,
        destination: s.destination,
        depTime: s.dep_time,
        arrTime: s.arr_time,
        duration: s.duration,
        class: s.class,
        price: s.price,
        status: s.status,
        seatsAvailable: s.seats_available,
        plate: s.plate,
        timeCategory: s.time_category
      }));
    }

    const { data: revs } = await supabaseClient.from('reviews').select('*');
    if (revs && revs.length > 0) {
      revs.sort((a, b) => b.id - a.id);
      STATE.reviewsList = revs.map(r => ({
        id: r.id,
        author: r.author,
        rating: r.rating,
        date: r.date,
        text: r.text
      }));
    }

    const { data: events } = await supabaseClient.from('pricing_events').select('*');
    if (events && events.length > 0) {
      STATE.pricingEvents = events;
    }

    const { data: bks } = await supabaseClient.from('bookings').select('*');
    if (bks && bks.length > 0) {
      STATE.myBookings = bks.map(b => ({
        code: b.code,
        schedule: STATE.schedulesData.find(s => s.id === b.schedule_id) || {
          id: b.schedule_id,
          origin: '',
          destination: '',
          depTime: '',
          arrTime: '',
          duration: '',
          class: '',
          price: b.final_price,
          status: 'on-time',
          seatsAvailable: 0,
          plate: ''
        },
        passenger: {
          name: b.passenger_name,
          phone: b.passenger_phone,
          nik: b.passenger_nik,
          pickupAddress: b.pickup_address,
          dropoffAddress: b.dropoff_address
        },
        passengersCount: b.passengers_count,
        date: b.date,
        paymentMethod: b.payment_method,
        status: b.status
      }));
    }
    
    saveState();
    
    renderCityDropdowns();
    renderAdminCities();
    renderAdminSchedules();
    renderAdminPricing();
    renderAdminEvents();
    renderAdminReviews();
    renderMyBookingsList();
    renderReviewsFeed();
    renderSchedules();
  } catch (err) {
    console.error('Failed to load data from Supabase, using local storage cache:', err);
  }
}
