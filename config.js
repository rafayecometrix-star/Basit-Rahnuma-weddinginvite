/**
 * 💌 WEDDING INVITATION — CONFIGURATION
 * ─────────────────────────────────────
 * This is the SINGLE SOURCE OF TRUTH for all invitation content.
 * Edit this file directly, or use the Admin Panel (admin.html).
 * 
 * All fields below are fully customizable.
 */

const WEDDING_CONFIG = {

  // ═══════════════════════════════════════
  // 💑 COUPLE DETAILS
  // ═══════════════════════════════════════
  couple: {
    name1: "Martina",
    name2: "Javier",
    monogram: "M&J",
    weddingDate: "2026-09-27T17:30:00",
    welcomeTitle: "We're so happy to celebrate this day with you.",
    welcomeBody: "Having you with us means the world. We can't wait to welcome you to Hotel du Cap-Eden-Roc on September 27th, 2026.",
    couplePhoto: "assets/images/couple-photo.jpg",
    galleryPhotos: [
      "assets/images/gallery/photo1.jpg",
      "assets/images/gallery/photo2.jpg",
      "assets/images/gallery/photo3.jpg",
      "assets/images/gallery/photo4.jpg"
    ]
  },

  // ═══════════════════════════════════════
  // 📖 OUR STORY
  // ═══════════════════════════════════════
  story: {
    show: true,
    title: "How it all started…",
    paragraphs: [
      "Martina and Javier first crossed paths on a warm summer evening at a mutual friend's rooftop gathering in Barcelona. She was admiring the city lights; he was pretending to know more about wine than he actually did. Their eyes met over a very questionable charcuterie board, and somehow — despite the blue cheese incident — they spent the entire night talking until the sun came up.",
      "What started as a spark across a crowded terrace quickly turned into something neither of them expected. Weekend trips to the coast. Long walks through cities they didn't know. Shared passports full of stamps and stories. They discovered that the best part of every adventure wasn't the destination — it was the person sitting next to them on the plane.",
      "Three years, two apartments, one very dramatic cat, and a thousand little inside jokes later, Javier dropped to one knee on the same rooftop where they first met — this time with a ring, a plan, and absolutely no charcuterie in sight. She said yes before he even finished the question."
    ]
  },

  // ═══════════════════════════════════════
  // 💒 VENUE & CEREMONY
  // ═══════════════════════════════════════
  venue: {
    name: "Hotel du Cap-Eden-Roc",
    city: "Antibes",
    country: "France",
    address: "Boulevard J. F. Kennedy, 06160 Antibes, France",
    googleMapsUrl: "https://www.google.com/maps/place/H%C3%B4tel+du+Cap-Eden-Roc",
    appleMapsUrl: "https://maps.apple.com/?q=Hotel+du+Cap-Eden-Roc",
    dressCode: "Black Tie",
    ceremonyTime: "5:30 PM",
    dateWrittenOut: "the twenty-seventh of September, two thousand twenty-six",
    dayOfWeek: "SUNDAY"
  },

  // ═══════════════════════════════════════
  // 📋 SCHEDULE / TIMELINE
  // ═══════════════════════════════════════
  schedule: {
    dateLabel: "Saturday, 29th August",
    events: [
      { time: "12:00", title: "Guests arrive", icon: "umbrella" },
      { time: "13:00", title: "Ceremony", icon: "default" },
      { time: "13:30", title: "Drinks reception", icon: "default" },
      { time: "15:30", title: "Call to dinner", icon: "default" },
      { time: "16:00", title: "Wedding breakfast", icon: "venue" },
      { time: "18:30", title: "Cocktail hour commences", icon: "default" },
      { time: "19:00", title: "Evening guests arrive", icon: "default" },
      { time: "20:00", title: "First dance", icon: "glasses" },
      { time: "21:00", title: "Evening food", icon: "default" },
      { time: "00:00", title: "Carriages home", icon: "default" }
    ]
  },

  // ═══════════════════════════════════════
  // 🥂 WEEKEND PRE-EVENTS
  // ═══════════════════════════════════════
  weekend: {
    show: true,
    title: "The Weekend",
    subtitle: "JOIN US THE EVENING BEFORE",
    eventName: "Restaurant César",
    location: "Cap d'Antibes, France",
    date: "Saturday | 26",
    month: "September 2026",
    timeRange: "5:30 – 8:30 PM",
    address: "Plage Keller, Chemin de la Garoupe, 06160 Antibes, France",
    mapsUrl: "https://www.google.com/maps/place/Restaurant+César",
    appleMapsUrl: "https://maps.apple.com/?q=Restaurant+César"
  },

  // ═══════════════════════════════════════
  // ✈️ TRAVEL & STAY
  // ═══════════════════════════════════════
  travel: {
    show: true,
    title: "Travel & Stay",
    airportInfo: "We recommend flying into Nice Côte d'Azur International Airport (NCE). The venue is approximately 30 minutes by car.",
    hotels: [
      {
        name: "Hotel du Cap-Eden-Roc",
        type: "preferred",
        label: "PREFERRED ROOM BLOCK",
        address: "Boulevard J. F. Kennedy, 06160 Antibes, France",
        dates: "September 26 – 28, 2026",
        rates: [
          "Classic Room — €890 / night",
          "Deluxe Sea View — €1,250 / night"
        ],
        deadline: "Reserve by Monday, July 27, 2026",
        reference: "Martina / Javier Wedding Room Block",
        phone: "+33 4 93 61 39 01",
        mapsUrl: "https://www.google.com/maps/place/H%C3%B4tel+du+Cap-Eden-Roc"
      },
      {
        name: "Hôtel Belles Rives",
        type: "additional",
        label: "ADDITIONAL OPTION",
        address: "33 Boulevard Édouard Baudoin, 06160 Juan-les-Pins, France",
        dates: "",
        rates: [],
        deadline: "",
        reference: "",
        phone: "+33 4 93 61 02 79",
        mapsUrl: "https://www.google.com/maps/place/Hotel+Belles+Rives"
      }
    ]
  },

  // ═══════════════════════════════════════
  // 📝 RSVP SETTINGS
  // ═══════════════════════════════════════
  rsvp: {
    deadline: "15 July 2026",
    showGuestCount: true,
    maxGuests: 10,
    messagePlaceholder: "Share a wish, a memory, or anything you'd like us to read..."
  },

  // ═══════════════════════════════════════
  // 🎨 THEME / DESIGN & CAROUSEL
  // ═══════════════════════════════════════
  theme: {
    primaryColor: "#243818",       // Deep forest green (headings)
    accentColor: "#4A7A9F",        // French Riviera blue
    backgroundColor: "#F3F7F8",    // Powder ice blue
    outerBackground: "#F3F7F8",    // Seamless with background
    goldAccent: "#9A6E24",         // Warm copper gold
    buttonColor: "#466324",        // Olive green (buttons)
    secondaryText: "#3D5024",      // Dark olive
    carouselSpeed: 3500,           // Story gallery autoplay speed (ms)
    headingFont: "'Cormorant Garamond', 'Georgia', serif",
    bodyFont: "'Inter', 'Helvetica Neue', sans-serif",
    labelFont: "'Montserrat', 'Arial', sans-serif",
    enableMusic: false,
    musicFile: "assets/audio/background-music.mp3"
  }
};

// ─── Export for use in other modules ───
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WEDDING_CONFIG;
}
