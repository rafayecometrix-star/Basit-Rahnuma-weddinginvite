/**
 * 💌 WEDDING INVITATION — CONFIGURATION
 * ─────────────────────────────────────
 * This is the SINGLE SOURCE OF TRUTH for all invitation content.
 * Edit this file directly, or use the Admin Panel (admin.html).
 * 
 * All fields below are fully customizable.
 */

const WEDDING_CONFIG = {
  version: "abdul-basit-pink-gold-v2",

  // ═══════════════════════════════════════
  // 💑 COUPLE DETAILS
  // ═══════════════════════════════════════
  couple: {
    name1: "Abdul Basit",
    name2: "Rahnuma Fatima",
    monogram: "B&R",
    weddingDate: "2026-11-16T20:30:00",
    welcomeTitle: "In the name of ALLAH, The Most Merciful & The Most Compassionate",
    welcomeBody: "Mr. Nizam Alam & Mrs. Sahba Firdaus request the honour of your presence on the occasion of the Wedding Reception of their son.",
    parents: "Mr. Nizam Alam & Mrs. Sahba Firdaus",
    invitationText: "Request the honour of your presence on the occasion of the Wedding Reception of their son",
    groomLineage: "(Grand S/o Late Mr. & Mrs. Abdul Hameed Sheikh)",
    brideLineage: "(D/o Mr. & Mrs. Mohd. Nahid)",
    compliments: "Best Compliments from Ibadat Nizam along with family & friends.",
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
    show: false,
    title: "How it all started…",
    paragraphs: []
  },

  // ═══════════════════════════════════════
  // 💒 VENUE & CEREMONY
  // ═══════════════════════════════════════
  venue: {
    name: "Royal Palace",
    city: "Jajmau, Kanpur",
    country: "India",
    address: "Galla Godam, Jajmau, Kanpur, Uttar Pradesh, India",
    googleMapsUrl: "https://www.google.com/maps/place/Royal+Palace/@26.4304798,80.3934503,17z/data=!3m1!4b1!4m6!3m5!1s0x399c40e305db2175:0x907b49ea2c4d1a13!8m2!3d26.4304798!4d80.3960252!16s%2Fg%2F11sbr0d7fs?entry=ttu&g_ep=EgoyMDI2MDkwMS4wIKXMDSoASAFQAw%3D%3D",
    appleMapsUrl: "https://maps.apple.com/?q=Royal+Palace+Jajmau+Kanpur",
    dressCode: "",
    ceremonyTime: "8:30 PM onwards",
    dateWrittenOut: "the sixteenth of November, two thousand twenty-six",
    dayOfWeek: "MONDAY"
  },

  // ═══════════════════════════════════════
  // 📋 SCHEDULE / TIMELINE
  // ═══════════════════════════════════════
  schedule: {
    dateLabel: "Monday, 16th November 2026",
    events: [
      { time: "20:30", title: "Guests Arrive & Welcome", icon: "umbrella" },
      { time: "21:00", title: "Reception Ceremony", icon: "default" },
      { time: "21:30", title: "Dinner", icon: "venue" }
    ]
  },

  // ═══════════════════════════════════════
  // 🥂 WEEKEND PRE-EVENTS
  // ═══════════════════════════════════════
  weekend: {
    show: false,
    title: "The Weekend",
    subtitle: "JOIN US THE EVENING BEFORE",
    eventName: "",
    location: "",
    date: "",
    month: "",
    timeRange: "",
    address: "",
    mapsUrl: "",
    appleMapsUrl: ""
  },

  // ═══════════════════════════════════════
  // ✈️ TRAVEL & STAY
  // ═══════════════════════════════════════
  travel: {
    show: false,
    title: "Travel & Stay",
    airportInfo: "",
    hotels: []
  },

  // ═══════════════════════════════════════
  // 📝 RSVP SETTINGS
  // ═══════════════════════════════════════
  rsvp: {
    deadline: "1 November 2026",
    showGuestCount: true,
    maxGuests: 10,
    messagePlaceholder: "Share a prayer, a warm wish, or a congratulatory message..."
  },

  // ═══════════════════════════════════════
  // 🎨 THEME / DESIGN & CAROUSEL
  // ═══════════════════════════════════════
  theme: {
    primaryColor: "#A32A53",       // Rose Magenta (headings, couple names, wax seal)
    accentColor: "#D4A853",        // Champagne warm gold
    backgroundColor: "#FAF8F2",    // Soft cream arabesque background
    outerBackground: "#FAF8F2",    // Seamless cream background
    goldAccent: "#C5A059",         // Royal gold (borders, ornaments, dividers)
    buttonColor: "#A32A53",        // Rose Magenta (buttons, interactive elements)
    secondaryText: "#5C3D5E",      // Deep Plum (secondary text, labels)
    carouselSpeed: 3500,           // Autoplay speed (ms)
    headingFont: "'Playfair Display', Georgia, serif",
    bodyFont: "'Cormorant Garamond', Georgia, serif",
    labelFont: "'Outfit', sans-serif",
    enableMusic: false,
    musicFile: "assets/audio/background-music.mp3"
  }
};

// ─── Export for use in other modules ───
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WEDDING_CONFIG;
}
