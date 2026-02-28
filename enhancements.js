/* LocalLens.Homes – Enhancement JavaScript
   Itinerary Modals, Hotel/Vehicle Selection, Tour Customizer
   =========================================================== */

document.addEventListener('DOMContentLoaded', function () {
  initEarlyBookingTracking();
  initTourItineraryModals();
  initHotelSelection();
  initVehicleSelection();
  initTourCustomizer();
  syncSelectorsWithCustomizer();
  setMinDate();
});

// ===========================================
// Early Booking Discount Tracking
// ===========================================

function initEarlyBookingTracking() {
  // Record the first time the user visits the tours page
  if (!localStorage.getItem('tourInquiryTime')) {
    localStorage.setItem('tourInquiryTime', Date.now().toString());
  }
}

function getInquiryTime() {
  var stored = localStorage.getItem('tourInquiryTime');
  return stored ? parseInt(stored, 10) : Date.now();
}

function isEarlyBooker() {
  // Returns true if the user's first visit (inquiry time) was within the last 24 hours.
  // Once 24 hours have elapsed from the stored timestamp, this correctly returns false.
  var elapsed = Date.now() - getInquiryTime();
  return elapsed < 24 * 60 * 60 * 1000;
}

function getHoursRemaining() {
  var elapsed = Date.now() - getInquiryTime();
  var remaining = (24 * 60 * 60 * 1000) - elapsed;
  return Math.max(0, Math.ceil(remaining / (60 * 60 * 1000)));
}

// ===========================================
// Tour Data
// ===========================================

var TOUR_DATA = {
  'cultural-kathmandu': {
    name: 'Cultural Kathmandu',
    duration: '3–4 days',
    difficulty: 'Easy',
    price: '$600–900 per person',
    meetingPoint: 'Tribhuvan International Airport (TIA), Kathmandu – 09:00 AM',
    specialNotes: 'Comfortable walking shoes required. Best season: Oct–Nov, Feb–Apr.',
    days: [
      {
        title: 'Arrival & Kathmandu Valley Overview',
        description: 'Airport pickup and hotel check-in. Evening walk through Thamel, orientation dinner with Jivan.',
        meals: ['Dinner'],
        activities: ['Airport Transfer', 'Thamel Orientation Walk'],
        notes: []
      },
      {
        title: 'Pashupatinath & Boudhanath',
        description: 'Morning visit to Pashupatinath Temple – the sacred Hindu temple on the banks of Bagmati. After lunch, explore Boudhanath Stupa, the largest stupa in Nepal. Evening free.',
        meals: ['Breakfast', 'Lunch'],
        activities: ['Pashupatinath Temple', 'Boudhanath Stupa', 'Local Street Food'],
        notes: ['Bring Hindu temple dress code – shoulders and knees covered']
      },
      {
        title: 'Kathmandu Durbar Square & Swayambhunath',
        description: 'Morning at Kathmandu Durbar Square – ancient royal palace and Kumari Ghar. Afternoon hike up to Swayambhunath Monkey Temple for panoramic views. Cultural show in the evening.',
        meals: ['Breakfast', 'Dinner'],
        activities: ['Durbar Square', 'Swayambhunath Stupa', 'Cultural Performance'],
        notes: ['Wear comfortable walking shoes – some stairs involved']
      },
      {
        title: 'Patan & Departure',
        description: 'Morning visit to Patan Durbar Square and its world-class museum. Final lunch together, airport drop-off.',
        meals: ['Breakfast', 'Lunch'],
        activities: ['Patan Museum', 'Patan Durbar Square', 'Airport Transfer'],
        notes: []
      }
    ]
  },

  'pokhara-nagarkot': {
    name: 'Pokhara & Nagarkot',
    duration: '5–7 days',
    difficulty: 'Easy–Moderate',
    price: '$900–1,500 per person',
    meetingPoint: 'Tribhuvan International Airport (TIA), Kathmandu – 09:00 AM',
    specialNotes: 'Light trekking shoes recommended. Internal flights may vary – Jivan handles changes.',
    days: [
      {
        title: 'Arrival Kathmandu',
        description: 'Airport pickup, hotel check-in. Evening stroll in Thamel. Welcome dinner.',
        meals: ['Dinner'],
        activities: ['Airport Transfer', 'Thamel Walk'],
        notes: []
      },
      {
        title: 'Kathmandu → Nagarkot Sunset',
        description: 'Drive to Nagarkot (1.5 hrs) with scenic stops. Arrive before sunset for stunning Himalayan panorama including Everest range on clear days.',
        meals: ['Breakfast', 'Dinner'],
        activities: ['Nagarkot Viewpoint', 'Himalayan Sunset'],
        notes: ['Bring warm layer – Nagarkot is cooler at 2100m']
      },
      {
        title: 'Nagarkot Sunrise → Bhaktapur',
        description: 'Early sunrise watch (5:30 AM). After breakfast, visit ancient Bhaktapur Durbar Square – UNESCO World Heritage Site. Lunch in Bhaktapur\'s old town.',
        meals: ['Breakfast', 'Lunch'],
        activities: ['Nagarkot Sunrise', 'Bhaktapur Durbar Square', 'Newari Cuisine'],
        notes: ['Wake up call at 5:00 AM for sunrise']
      },
      {
        title: 'Flight to Pokhara',
        description: 'Morning flight to Pokhara (30 min, views of Annapurna). Afternoon boating on Phewa Lake with views of Machhapuchhre (Fish Tail Mountain).',
        meals: ['Breakfast'],
        activities: ['Mountain Flight', 'Phewa Lake Boating', 'Pokhara City Walk'],
        notes: ['Jivan handles all flight logistics and backup plans']
      },
      {
        title: 'Pokhara – Sarangkot Sunrise & Paragliding',
        description: 'Pre-dawn drive to Sarangkot for Annapurna sunrise. Option to paraglide over Pokhara Valley. Afternoon visit World Peace Pagoda.',
        meals: ['Breakfast', 'Dinner'],
        activities: ['Sarangkot Sunrise', 'Optional Paragliding', 'World Peace Pagoda'],
        notes: ['Paragliding is optional – $90 extra']
      },
      {
        title: 'Free Day in Pokhara & Departure',
        description: 'Morning free for shopping or relaxation. Afternoon flight back to Kathmandu. Airport drop-off.',
        meals: ['Breakfast'],
        activities: ['Lakeside Shopping', 'Return Flight', 'Airport Transfer'],
        notes: []
      }
    ]
  },

  'classic-nepal': {
    name: 'Classic Nepal',
    duration: '10–12 days',
    difficulty: 'Easy–Moderate',
    price: '$1,500–2,500 per person',
    meetingPoint: 'Tribhuvan International Airport (TIA), Kathmandu – 09:00 AM',
    specialNotes: 'The complete Nepal experience. Great for first-time visitors.',
    days: [
      {
        title: 'Arrival Kathmandu',
        description: 'Airport pickup, orientation, welcome dinner.',
        meals: ['Dinner'],
        activities: ['Airport Transfer', 'Thamel Walk'],
        notes: []
      },
      {
        title: 'Kathmandu Heritage',
        description: 'Pashupatinath, Boudhanath, Swayambhunath temples.',
        meals: ['Breakfast', 'Lunch'],
        activities: ['Temple Tour', 'Street Food'],
        notes: []
      },
      {
        title: 'Patan & Bhaktapur',
        description: 'Two UNESCO World Heritage Cities in one day. Patan museum and Bhaktapur Durbar Square.',
        meals: ['Breakfast', 'Dinner'],
        activities: ['Patan Museum', 'Bhaktapur Old Town'],
        notes: []
      },
      {
        title: 'Fly to Pokhara',
        description: 'Morning mountain flight (30 min) with Himalayan views. Settle in Pokhara.',
        meals: ['Breakfast'],
        activities: ['Mountain Flight', 'Phewa Lake'],
        notes: []
      },
      {
        title: 'Pokhara Exploration',
        description: 'Sarangkot sunrise, Annapurna views, optional paragliding, World Peace Pagoda.',
        meals: ['Breakfast', 'Dinner'],
        activities: ['Sarangkot Sunrise', 'Pagoda Visit'],
        notes: []
      },
      {
        title: 'Pokhara Free Day',
        description: 'Boating, kayaking, zip-lining, or relaxation at lakeside.',
        meals: ['Breakfast'],
        activities: ['Leisure Activities'],
        notes: []
      },
      {
        title: 'Fly to Bharatpur → Chitwan',
        description: 'Morning flight to Chitwan. Jungle walk, bird watching, tharu cultural program.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        activities: ['Jungle Walk', 'Bird Watching', 'Tharu Culture'],
        notes: []
      },
      {
        title: 'Chitwan Jungle Safari',
        description: 'Full day safari – jeep drive, elephant breeding center, canoe ride on Rapti River.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        activities: ['Jeep Safari', 'Canoe Ride', 'Elephant Center'],
        notes: ['Chance to see rhinos and crocodiles']
      },
      {
        title: 'Chitwan → Kathmandu',
        description: 'Morning drive or flight back to Kathmandu. Free afternoon.',
        meals: ['Breakfast'],
        activities: ['Return Transfer'],
        notes: []
      },
      {
        title: 'Souvenir Shopping & Departure',
        description: 'Morning shopping at Thamel and Indra Chowk. Airport drop-off.',
        meals: ['Breakfast'],
        activities: ['Thamel Shopping', 'Airport Transfer'],
        notes: []
      }
    ]
  },

  'poon-hill': {
    name: 'Poon Hill Trek',
    duration: '7–9 days',
    difficulty: 'Moderate',
    price: '$800–1,200 per person',
    meetingPoint: 'Tribhuvan International Airport (TIA), Kathmandu – 08:00 AM',
    specialNotes: 'First Himalayan trek – ideal for beginners. Trekking poles available on request.',
    days: [
      {
        title: 'Arrival Kathmandu',
        description: 'Airport pickup, gear check, briefing dinner.',
        meals: ['Dinner'],
        activities: ['Airport Transfer', 'Gear Briefing'],
        notes: ['Bring proper trekking boots']
      },
      {
        title: 'Drive Kathmandu → Nayapul → Tikhedhunga',
        description: '6-hour drive to Nayapul (the trek trailhead), then 3-hour walk to Tikhedhunga (1,540m).',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        activities: ['Scenic Drive', 'Trek Start', 'Teahouse'],
        notes: []
      },
      {
        title: 'Tikhedhunga → Ghorepani',
        description: 'Trek through Ulleri (stone steps!) and Banthanti to Ghorepani (2,874m). Stunning rhododendron forests.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        activities: ['Forest Trek', 'Rhododendron Trail'],
        notes: []
      },
      {
        title: 'Poon Hill Sunrise (3,210m)',
        description: 'Pre-dawn hike to Poon Hill viewpoint (1.5 hrs). 360° panorama of Annapurna, Dhaulagiri, Machhapuchhre. Return to Ghorepani for breakfast.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        activities: ['Poon Hill Sunrise', 'Himalayan Panorama'],
        notes: ['Wake up at 4:30 AM – worth every minute!']
      },
      {
        title: 'Ghorepani → Tadapani',
        description: 'Trek through forests to Tadapani. Alternative: trek down to Chomrong for harder route.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        activities: ['Forest Trek', 'Gurung Villages'],
        notes: []
      },
      {
        title: 'Tadapani → Ghandruk',
        description: 'Descend to Ghandruk – a beautiful Gurung village with Annapurna South views. Cultural evening.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        activities: ['Gurung Village', 'Cultural Experience'],
        notes: []
      },
      {
        title: 'Ghandruk → Nayapul → Pokhara',
        description: 'Morning trek down to Nayapul, drive to Pokhara. Rest evening at lakeside.',
        meals: ['Breakfast', 'Dinner'],
        activities: ['Trek End', 'Pokhara Lakeside'],
        notes: []
      },
      {
        title: 'Return to Kathmandu / Departure',
        description: 'Flight or drive to Kathmandu. Airport drop-off.',
        meals: ['Breakfast'],
        activities: ['Return Transfer', 'Airport Drop-off'],
        notes: []
      }
    ]
  },

  'honey-hunting': {
    name: 'Honey Hunting Expedition',
    duration: '5–7 days',
    difficulty: 'Moderate',
    price: '$1,200–2,000 per person',
    meetingPoint: 'Tribhuvan International Airport (TIA), Kathmandu – 07:00 AM (early start required)',
    specialNotes: 'ONLY 6 SPOTS PER YEAR. Season: April–May and October–November. Smoking strictly prohibited on expedition.',
    days: [
      {
        title: 'Kathmandu → Pokhara → Ghanpokhara',
        description: 'Fly to Pokhara, drive to the remote Gurung village of Ghanpokhara. Meet the traditional honey hunters.',
        meals: ['Breakfast', 'Dinner'],
        activities: ['Mountain Flight', 'Village Arrival', 'Hunter Meeting'],
        notes: ['Bring insect repellent and long sleeves']
      },
      {
        title: 'Cliff Preparation & Ritual',
        description: 'Morning ritual prayer to the cliff gods by the lead hunter. Rope preparation, traditional equipment. Walk to the cliff site (3–4 hrs).',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        activities: ['Traditional Ritual', 'Cliff Scouting', 'Equipment Prep'],
        notes: ['Be respectful and silent during the ritual']
      },
      {
        title: 'The Honey Hunt',
        description: 'THE DAY. Watch Gurung hunters descend 100m cliff faces on hand-woven ropes to harvest wild Himalayan cliff honey from the world\'s largest honeybees.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        activities: ['Honey Harvest', 'Photography', 'Cultural Immersion'],
        notes: ['Stand-back distance maintained – you are completely safe', 'Video and photography allowed']
      },
      {
        title: 'Village Life & Local Ceremony',
        description: 'Spend the day learning Gurung culture, cooking local food, tasting fresh wild honey. Evening celebration with village elders.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        activities: ['Village Homestay', 'Honey Tasting', 'Cultural Ceremony'],
        notes: []
      },
      {
        title: 'Return to Pokhara',
        description: 'Scenic drive back to Pokhara. Debrief dinner and certificate ceremony.',
        meals: ['Breakfast', 'Dinner'],
        activities: ['Scenic Drive', 'Certificate Ceremony'],
        notes: []
      },
      {
        title: 'Pokhara → Kathmandu / Departure',
        description: 'Morning flight back to Kathmandu. Airport drop-off with honey jar gift.',
        meals: ['Breakfast'],
        activities: ['Return Flight', 'Departure Gift'],
        notes: []
      }
    ]
  },

  'muktinath': {
    name: 'Muktinath Pilgrimage',
    duration: '10–12 days',
    difficulty: 'Moderate',
    price: '$1,200–1,800 per person',
    meetingPoint: 'Tribhuvan International Airport (TIA), Kathmandu – 07:00 AM',
    specialNotes: 'Sacred site for Hindus and Buddhists. High altitude (3,800m) – some acclimatization needed.',
    days: [
      {
        title: 'Arrival & Kathmandu',
        description: 'Airport pickup, Pashupatinath visit (spiritual preparation), briefing dinner.',
        meals: ['Dinner'],
        activities: ['Airport Transfer', 'Pashupatinath'],
        notes: []
      },
      {
        title: 'Fly Kathmandu → Pokhara',
        description: 'Morning flight, Pokhara sightseeing – Phewa Lake and Bindhyabasini Temple.',
        meals: ['Breakfast', 'Dinner'],
        activities: ['Mountain Flight', 'Temple Visit'],
        notes: []
      },
      {
        title: 'Fly Pokhara → Jomsom',
        description: 'Stunning 20-minute mountain flight to Jomsom (2,720m) in the Mustang Valley. Desert landscape, Tibetan-influenced culture.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        activities: ['Mountain Flight', 'Mustang Exploration'],
        notes: ['Flights operate only in morning – weather dependent']
      },
      {
        title: 'Jomsom → Muktinath (3,800m)',
        description: 'Drive or ride to the sacred Muktinath Temple – holy to both Hindus and Buddhists. 108 water spouts, eternal flame.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        activities: ['Muktinath Temple', 'Sacred Rituals', '108 Spouts'],
        notes: ['Bring warm clothing – temperature drops significantly']
      },
      {
        title: 'Muktinath Sunrise Puja',
        description: 'Early morning ritual bath in sacred waters. Sunrise puja with local priests. Time for personal prayer and meditation.',
        meals: ['Breakfast', 'Lunch'],
        activities: ['Morning Puja', 'Sunrise Prayer', 'Sacred Bath'],
        notes: ['Sacred bath is cold but spiritually powerful']
      },
      {
        title: 'Kagbeni & Marpha',
        description: 'Visit medieval walled city of Kagbeni. Afternoon in Marpha – apple orchard village, try local apple brandy.',
        meals: ['Breakfast', 'Dinner'],
        activities: ['Kagbeni Exploration', 'Marpha Village', 'Apple Brandy'],
        notes: []
      },
      {
        title: 'Return to Jomsom & Flight Back',
        description: 'Morning return to Jomsom airport, flight to Pokhara.',
        meals: ['Breakfast'],
        activities: ['Return Flight', 'Pokhara Arrival'],
        notes: []
      },
      {
        title: 'Pokhara Rest Day',
        description: 'Optional Sarangkot sunrise, Lakeside relaxation, shopping.',
        meals: ['Breakfast'],
        activities: ['Leisure', 'Shopping'],
        notes: []
      },
      {
        title: 'Return to Kathmandu / Departure',
        description: 'Fly back to Kathmandu. Souvenir shopping, airport drop-off.',
        meals: ['Breakfast'],
        activities: ['Return Flight', 'Shopping', 'Airport Drop-off'],
        notes: []
      }
    ]
  },

  'grand-nepal': {
    name: 'Grand Tour Nepal',
    duration: '14–16 days',
    difficulty: 'Moderate',
    price: '$2,500–4,000 per person',
    meetingPoint: 'Tribhuvan International Airport (TIA), Kathmandu – 09:00 AM',
    specialNotes: 'The ultimate Nepal experience covering 5 distinct regions. Ideal for repeat visitors or those wanting everything.',
    days: [
      {
        title: 'Arrival Kathmandu',
        description: 'Airport pickup, orientation, welcome dinner.',
        meals: ['Dinner'],
        activities: ['Airport Transfer'],
        notes: []
      },
      {
        title: 'Kathmandu Temples',
        description: 'Pashupatinath, Boudhanath, Swayambhunath.',
        meals: ['Breakfast', 'Lunch'],
        activities: ['Temple Circuit'],
        notes: []
      },
      {
        title: 'Patan & Bhaktapur',
        description: 'Two Heritage Cities, Newari architecture and cuisine.',
        meals: ['Breakfast', 'Dinner'],
        activities: ['Heritage Cities'],
        notes: []
      },
      {
        title: 'Nagarkot Sunrise & Return',
        description: 'Overnight at Nagarkot for Himalayan sunrise.',
        meals: ['Breakfast', 'Dinner'],
        activities: ['Nagarkot Sunset', 'Sunrise'],
        notes: []
      },
      {
        title: 'Fly to Pokhara',
        description: 'Morning flight. Phewa Lake boating.',
        meals: ['Breakfast'],
        activities: ['Mountain Flight', 'Lake Boating'],
        notes: []
      },
      {
        title: 'Sarangkot & Pokhara Highlights',
        description: 'Sunrise at Sarangkot, Peace Pagoda, Devi\'s Fall.',
        meals: ['Breakfast', 'Dinner'],
        activities: ['Sarangkot', 'Peace Pagoda'],
        notes: []
      },
      {
        title: 'Fly Pokhara → Jomsom → Muktinath',
        description: 'Morning flight to Jomsom, drive to Muktinath sacred temple.',
        meals: ['Breakfast', 'Dinner'],
        activities: ['Mountain Flight', 'Muktinath'],
        notes: []
      },
      {
        title: 'Muktinath Pilgrimage & Mustang',
        description: 'Full day at Muktinath, Kagbeni and Marpha villages.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        activities: ['Pilgrimage', 'Mustang Villages'],
        notes: []
      },
      {
        title: 'Return to Pokhara',
        description: 'Jomsom airport, flight to Pokhara.',
        meals: ['Breakfast'],
        activities: ['Return Flight'],
        notes: []
      },
      {
        title: 'Drive to Lumbini',
        description: 'Drive to Lumbini (4 hrs) – birthplace of Buddha. Sacred Garden, Maya Devi Temple.',
        meals: ['Breakfast', 'Dinner'],
        activities: ['Lumbini Sacred Garden', 'Maya Devi Temple'],
        notes: []
      },
      {
        title: 'Lumbini Exploration',
        description: 'World Peace Pagodas from different countries, meditation gardens.',
        meals: ['Breakfast', 'Lunch'],
        activities: ['International Monasteries', 'Meditation'],
        notes: []
      },
      {
        title: 'Lumbini → Chitwan',
        description: 'Drive to Chitwan (3 hrs), evening cultural show.',
        meals: ['Breakfast', 'Dinner'],
        activities: ['Tharu Cultural Show'],
        notes: []
      },
      {
        title: 'Chitwan Safari Day',
        description: 'Full day: jeep safari, canoe ride, elephant breeding center.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        activities: ['Jeep Safari', 'Canoe Ride', 'Bird Watching'],
        notes: []
      },
      {
        title: 'Return to Kathmandu',
        description: 'Drive or fly back to Kathmandu. Shopping, farewell dinner.',
        meals: ['Breakfast', 'Dinner'],
        activities: ['Return Transfer', 'Farewell Dinner'],
        notes: []
      },
      {
        title: 'Departure',
        description: 'Final breakfast, airport drop-off.',
        meals: ['Breakfast'],
        activities: ['Airport Transfer'],
        notes: []
      }
    ]
  }
};

// ===========================================
// Itinerary Modals
// ===========================================

function initTourItineraryModals() {
  var modal = document.getElementById('itinerary-modal');
  var modalBody = document.getElementById('modal-body');
  var modalTitle = document.getElementById('modal-title');
  var btnClose = document.getElementById('modal-close');
  var btnCloseFooter = document.getElementById('modal-close-btn');
  var lastFocusedBtn = null;

  if (!modal) return;

  // Open modal on "View Itinerary" button click
  document.querySelectorAll('.btn-itinerary').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tourId = btn.getAttribute('data-tour');
      var tour = TOUR_DATA[tourId];
      if (!tour) return;

      lastFocusedBtn = btn;
      modalTitle.textContent = tour.name + ' – Itinerary';
      modalBody.innerHTML = buildItineraryHTML(tour, isEarlyBooker());
      modal.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';

      // Focus close button for accessibility
      btnClose.focus();
    });
  });

  function closeModal() {
    modal.classList.add('modal-closing');
    setTimeout(function () {
      modal.setAttribute('hidden', '');
      modal.classList.remove('modal-closing');
      document.body.style.overflow = '';
      if (lastFocusedBtn) lastFocusedBtn.focus();
    }, 250);
  }

  // Close handlers
  btnClose.addEventListener('click', closeModal);
  if (btnCloseFooter) btnCloseFooter.addEventListener('click', closeModal);

  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) closeModal();
  });

  // Trap focus inside modal
  modal.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var focusable = modal.querySelectorAll(
      'button:not([disabled]), a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

function buildItineraryHTML(tour, earlyBooker) {
  var html = '';

  // Early booker banner
  if (earlyBooker) {
    html += '<div class="early-discount-badge">🎉 20% Early Booking Discount – Enhanced Itinerary</div>';
  }

  // Meta info bar
  html += '<div class="itinerary-meta">';
  html += '<span>' + tour.duration + '</span>';
  html += '<span>' + tour.difficulty + '</span>';
  html += '<span>' + tour.price + '</span>';
  html += '</div>';

  // Day-by-day
  html += '<h3 class="itinerary-section-title">Day-by-Day Itinerary</h3>';
  tour.days.forEach(function (day, i) {
    html += '<div class="itinerary-day' + (earlyBooker ? ' itinerary-day--enhanced' : '') + '">';
    html += '<div class="itinerary-day-title">';
    html += '<span class="itinerary-day-number">Day ' + (i + 1) + '</span> ';
    html += escapeHTML(day.title);
    html += '</div>';

    if (earlyBooker) {
      // Enhanced view: show start time
      var startTime = getDayStartTime(day);
      html += '<div class="itinerary-day-time">⏰ Starting ' + startTime + '</div>';
    }

    html += '<div class="itinerary-day-desc">' + escapeHTML(day.description) + '</div>';

    if (earlyBooker && day.meals.length) {
      // Detailed meal breakdown
      var mealIcons = { 'Breakfast': '🍳', 'Lunch': '🥘', 'Dinner': '🍽️' };
      html += '<div class="itinerary-meal-detail">';
      html += '<strong>Meals included:</strong> ';
      html += day.meals.map(function (m) {
        return (mealIcons[m] || '🍴') + ' ' + escapeHTML(m);
      }).join(' &nbsp;·&nbsp; ');
      html += '</div>';
    }

    html += '<div class="itinerary-day-pills">';
    if (!earlyBooker) {
      day.meals.forEach(function (m) {
        html += '<span class="itinerary-pill pill-meal">' + escapeHTML(m) + '</span>';
      });
    }
    day.activities.forEach(function (a) {
      html += '<span class="itinerary-pill pill-activity">' + escapeHTML(a) + '</span>';
    });
    day.notes.forEach(function (n) {
      html += '<span class="itinerary-pill pill-note">' + escapeHTML(n) + '</span>';
    });
    html += '</div>';
    html += '</div>';
  });

  // Meeting point & notes
  html += '<div class="meeting-point-box">';
  html += '<strong>Meeting Point &amp; Time</strong>';
  html += '<br>' + escapeHTML(tour.meetingPoint);
  if (tour.specialNotes) {
    html += '<br><em style="opacity:0.85;font-size:0.88rem;">' + escapeHTML(tour.specialNotes) + '</em>';
  }
  html += '</div>';

  return html;
}

function getDayStartTime(day) {
  // Returns an estimated start time based on day content (not actual schedule data).
  var title = day.title.toLowerCase();
  var activities = (day.activities || []).join(' ').toLowerCase();
  if (title.indexOf('sunrise') !== -1 || activities.indexOf('sunrise') !== -1) return '5:00 AM';
  if (title.indexOf('puja') !== -1 || title.indexOf('ritual') !== -1) return '5:30 AM';
  if (title.indexOf('arrival') !== -1 || title.indexOf('departure') !== -1) return '9:00 AM';
  if (title.indexOf('fly') !== -1 || activities.indexOf('flight') !== -1) return '7:00 AM';
  return '8:30 AM';
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ===========================================
// Hotel Selection
// ===========================================

function initHotelSelection() {
  var hotelCards = document.querySelectorAll('.hotel-card');
  var hotelSelect = document.getElementById('cust-hotel');

  hotelCards.forEach(function (card) {
    var btn = card.querySelector('.btn-select-hotel');
    if (!btn) return;

    card.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') return; // allow link clicks
      selectHotelCard(card, hotelCards, hotelSelect);
    });

    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectHotelCard(card, hotelCards, hotelSelect);
      }
    });

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      selectHotelCard(card, hotelCards, hotelSelect);
    });
  });
}

function selectHotelCard(card, allCards, hotelSelect) {
  var stars = card.getAttribute('data-stars');
  allCards.forEach(function (c) {
    c.classList.remove('selected');
    c.setAttribute('aria-pressed', 'false');
    var btn = c.querySelector('.btn-select-hotel');
    if (btn) btn.textContent = 'Select ' + c.getAttribute('data-stars') + '-Star';
  });
  card.classList.add('selected');
  card.setAttribute('aria-pressed', 'true');
  var btn = card.querySelector('.btn-select-hotel');
  if (btn) btn.textContent = '✓ Selected';

  // Sync with customizer dropdown
  if (hotelSelect) {
    hotelSelect.value = stars;
    triggerCustomizerUpdate();
  }
}

// ===========================================
// Vehicle Selection
// ===========================================

function initVehicleSelection() {
  var vehicleCards = document.querySelectorAll('.vehicle-card');
  var vehicleSelect = document.getElementById('cust-vehicle');

  vehicleCards.forEach(function (card) {
    var btn = card.querySelector('.btn-select-vehicle');
    if (!btn) return;

    card.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') return;
      selectVehicleCard(card, vehicleCards, vehicleSelect);
    });

    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectVehicleCard(card, vehicleCards, vehicleSelect);
      }
    });

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      selectVehicleCard(card, vehicleCards, vehicleSelect);
    });
  });
}

function selectVehicleCard(card, allCards, vehicleSelect) {
  var vehicleType = card.getAttribute('data-vehicle');
  var vehicleName = card.querySelector('h3') ? card.querySelector('h3').textContent : vehicleType;

  allCards.forEach(function (c) {
    c.classList.remove('selected');
    c.setAttribute('aria-pressed', 'false');
    var btn = c.querySelector('.btn-select-vehicle');
    if (btn) {
      var name = c.querySelector('h3') ? c.querySelector('h3').textContent : '';
      btn.textContent = 'Select ' + name;
    }
  });
  card.classList.add('selected');
  card.setAttribute('aria-pressed', 'true');
  var btn = card.querySelector('.btn-select-vehicle');
  if (btn) btn.textContent = '✓ Selected';

  if (vehicleSelect) {
    vehicleSelect.value = vehicleType;
    triggerCustomizerUpdate();
  }
}

// ===========================================
// Tour Customizer / Quote Calculator
// ===========================================

function initTourCustomizer() {
  var form = document.getElementById('tour-customizer');
  var btnQuote = document.getElementById('btn-get-quote');
  if (!form || !btnQuote) return;

  btnQuote.addEventListener('click', generateQuote);

  // Live update on change
  form.querySelectorAll('select, input').forEach(function (el) {
    el.addEventListener('change', function () {
      var quoteEl = document.getElementById('customizer-quote');
      if (quoteEl && !quoteEl.querySelector('.quote-placeholder')) {
        generateQuote();
      }
    });
  });
}

function triggerCustomizerUpdate() {
  var quoteEl = document.getElementById('customizer-quote');
  if (quoteEl && !quoteEl.querySelector('.quote-placeholder')) {
    generateQuote();
  }
}

function generateQuote() {
  var tourSelect = document.getElementById('cust-tour');
  var peopleSelect = document.getElementById('cust-people');
  var hotelSelect = document.getElementById('cust-hotel');
  var vehicleSelect = document.getElementById('cust-vehicle');
  var quoteEl = document.getElementById('customizer-quote');

  if (!tourSelect || !tourSelect.value) {
    quoteEl.innerHTML = '<div class="quote-placeholder">Select your tour package above to see an instant estimate</div>';
    return;
  }

  var tourOption = tourSelect.options[tourSelect.selectedIndex];
  var tourDays = parseInt(tourOption.getAttribute('data-days'), 10) || 5;
  var tourBasePrice = parseInt(tourOption.getAttribute('data-price'), 10) || 0;
  var tourName = tourOption.textContent.split(' · ')[0];

  var people = parseInt(peopleSelect.value, 10) || 2;
  var hotelOption = hotelSelect.options[hotelSelect.selectedIndex];
  var hotelPricePerNight = parseInt(hotelOption.getAttribute('data-price'), 10) || 0;
  var hotelStars = parseInt(hotelSelect.value, 10);

  var vehicleOption = vehicleSelect.options[vehicleSelect.selectedIndex];
  var vehiclePricePerDay = parseInt(vehicleOption.getAttribute('data-price'), 10) || 0;
  var vehicleName = vehicleSelect.value.charAt(0).toUpperCase() + vehicleSelect.value.slice(1);
  var vehicleType = vehicleSelect.value;

  // Group discount
  var groupDiscount = 1;
  if (people >= 7) groupDiscount = 0.85;
  else if (people >= 5) groupDiscount = 0.9;

  var tourCost = tourBasePrice * people * groupDiscount;
  // 3-star hotel cost is included in base price (Req 4)
  var hotelCost = hotelStars === 3 ? 0 : hotelPricePerNight * tourDays;
  var vehicleCost = vehiclePricePerDay * tourDays;
  var subtotal = Math.round(tourCost + hotelCost + vehicleCost);

  // Early booking 20% discount (Req 1)
  var earlyBooker = isEarlyBooker();
  var savingsAmount = earlyBooker ? Math.round(subtotal * 0.20) : 0;
  var totalEstimate = subtotal - savingsAmount;

  // SUV capacity warning: max is 4 passengers, warn when group exceeds that (Req 5)
  var suvWarning = (vehicleType === 'suv' && people > 4)
    ? '<div class="suv-capacity-warning">⚠️ SUV fits up to 3–4 passengers. Consider upgrading to Jeep or Hiace for your group.</div>'
    : '';

  var html = '<div class="quote-result">';
  html += suvWarning;

  if (earlyBooker) {
    var hoursLeft = getHoursRemaining();
    html += '<div class="early-discount-badge">🎉 20% Early Booking Discount Active' +
            (hoursLeft > 0 ? ' – ' + hoursLeft + 'h remaining' : '') + '</div>';
  }

  html += '<div class="quote-tour-name">' + escapeHTML(tourName) + '</div>';
  html += '<div class="quote-breakdown">';
  html += '<span>' + people + ' traveller' + (people !== 1 ? 's' : '') + '</span>';
  html += '<span>' + tourDays + ' days</span>';
  // Req 3: show only star category, no hotel name
  if (hotelStars === 3) {
    html += '<span>' + hotelStars + '-Star Hotel (included)</span>';
  } else {
    html += '<span>' + hotelStars + '-Star Hotel (+$' + hotelCost + ')</span>';
  }
  html += '<span>' + escapeHTML(vehicleName) + '</span>';
  if (groupDiscount < 1) {
    html += '<span>Group discount: ' + Math.round((1 - groupDiscount) * 100) + '% off</span>';
  }
  html += '</div>';

  if (earlyBooker) {
    html += '<div class="quote-total">';
    html += '<span class="quote-original-price">~$' + subtotal.toLocaleString() + '</span> ';
    html += '<span class="quote-discounted-price">~$' + totalEstimate.toLocaleString() + '</span>';
    html += '<span class="discount-savings"> — save $' + savingsAmount.toLocaleString() + '!</span>';
    html += '</div>';
  } else {
    html += '<div class="quote-total">Estimated Total: ~$' + totalEstimate.toLocaleString() + '</div>';
  }

  html += '<div class="quote-note">* Estimate includes tour, hotel &amp; vehicle. Flights, permits &amp; personal expenses extra. Final price confirmed by Jivan.</div>';
  html += '</div>';

  quoteEl.innerHTML = html;
}

// Sync hotel/vehicle card selections with dropdown changes
function syncSelectorsWithCustomizer() {
  var hotelSelect = document.getElementById('cust-hotel');
  var vehicleSelect = document.getElementById('cust-vehicle');

  if (hotelSelect) {
    hotelSelect.addEventListener('change', function () {
      var stars = hotelSelect.value;
      document.querySelectorAll('.hotel-card').forEach(function (card) {
        if (card.getAttribute('data-stars') === stars) {
          var allCards = document.querySelectorAll('.hotel-card');
          allCards.forEach(function (c) {
            c.classList.remove('selected');
            c.setAttribute('aria-pressed', 'false');
            var btn = c.querySelector('.btn-select-hotel');
            if (btn) btn.textContent = 'Select ' + c.getAttribute('data-stars') + '-Star';
          });
          card.classList.add('selected');
          card.setAttribute('aria-pressed', 'true');
          var btn = card.querySelector('.btn-select-hotel');
          if (btn) btn.textContent = '✓ Selected';
        }
      });
    });
  }

  if (vehicleSelect) {
    vehicleSelect.addEventListener('change', function () {
      var vehicleType = vehicleSelect.value;
      document.querySelectorAll('.vehicle-card').forEach(function (card) {
        if (card.getAttribute('data-vehicle') === vehicleType) {
          var allCards = document.querySelectorAll('.vehicle-card');
          allCards.forEach(function (c) {
            c.classList.remove('selected');
            c.setAttribute('aria-pressed', 'false');
            var btn = c.querySelector('.btn-select-vehicle');
            if (btn) {
              var name = c.querySelector('h3') ? c.querySelector('h3').textContent : '';
              btn.textContent = 'Select ' + name;
            }
          });
          card.classList.add('selected');
          card.setAttribute('aria-pressed', 'true');
          var btn = card.querySelector('.btn-select-vehicle');
          if (btn) btn.textContent = '✓ Selected';
        }
      });
    });
  }
}

// Set minimum date to today
function setMinDate() {
  var dateInput = document.getElementById('cust-date');
  if (dateInput) {
    var today = new Date();
    var yyyy = today.getFullYear();
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var dd = String(today.getDate()).padStart(2, '0');
    dateInput.setAttribute('min', yyyy + '-' + mm + '-' + dd);
  }
}
