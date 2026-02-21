# 🏡 Property Booking Website — Full System Prompt

---

## Project Overview

Build a full-stack property booking website for **two rental properties**. The system has two user roles: **Admin** and **Customer**. It integrates with Airbnb via **iCal sync** to prevent double-bookings. The design should feel premium, warm, and trustworthy — like a boutique hospitality brand.

---

## Tech Stack Suggestions

- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express (or Next.js full-stack)
- **Database**: PostgreSQL or MongoDB
- **Calendar Sync**: iCal (.ics) parser (e.g., `node-ical`) to pull Airbnb bookings
- **Auth**: JWT-based with two roles: `admin` and `customer`
- **Booking Conflict Check**: Real-time availability check against both Airbnb-sourced and website-sourced bookings

---

## User Roles

### 👤 Customer
- Can browse the landing page, about us, and contact page
- Can view property details and available dates
- Can make a booking request / confirmed booking
- Receives booking confirmation (email or on-screen)

### 🔐 Admin
- Secure login portal (separate from customer login)
- Full dashboard with stats (total bookings, upcoming check-ins, revenue summary per property)
- Calendar view per property showing:
  - Bookings made via the website (color-coded)
  - Bookings synced from Airbnb via iCal (color-coded differently)
  - Blocked/unavailable dates
- Ability to manually block dates
- Ability to manage/approve/cancel bookings
- iCal sync settings (paste Airbnb iCal URL per property, set sync frequency)

---

## Pages & Features

### 1. 🏠 Landing Page
- Hero section with stunning full-width image/video of the two properties
- Brief tagline and CTA ("Book Your Stay")
- Property showcase section — cards/tiles for both properties with photo gallery, key features (beds, baths, amenities), and a "View & Book" button
- Testimonials/reviews section
- Trust badges (Secure Booking, Instant Confirmation, etc.)
- Footer with links, social media, contact info

### 2. 📖 About Us Page
- Story/background of the properties and host
- Photo of owner/team (optional)
- Mission, values, what makes the stay special
- Local area highlights

### 3. 📞 Contact Us Page
- Contact form (Name, Email, Message)
- Property address(es) with embedded Google Map
- Phone number and email
- Social media links
- Response time expectation note

### 4. 📅 Booking Page (Customer-Facing)
- Property selector (choose which of the two properties to book)
- Interactive date picker calendar that:
  - Highlights **unavailable dates** (sourced from both Airbnb iCal and existing website bookings)
  - Allows selection of only **available date ranges**
  - Prevents selecting check-in/check-out dates that conflict with existing bookings
- Guest details form (Name, Email, Phone, Number of Guests)
- Booking summary panel (dates, nights, price calculation)
- Terms & Conditions checkbox
- "Confirm Booking" button → triggers confirmation screen/email

---

## Admin Dashboard

### Overview Panel
- Total bookings (all time / this month)
- Upcoming check-ins (next 7 days)
- Occupancy rate per property
- Revenue summary (if pricing is configured)

### Calendar View
- Toggle between **Property 1** and **Property 2** (or combined view)
- Monthly/weekly calendar display
- Color legend:
  - 🟦 **Blue** — Booked via Website
  - 🟧 **Orange** — Booked via Airbnb (iCal synced)
  - 🟥 **Red** — Manually blocked
  - 🟩 **Green** — Available
- Clicking a booking shows booking detail popup (guest name, dates, source, status)
- Button to manually block/unblock date ranges

### iCal Sync Settings
- Input field to paste Airbnb iCal URL for each property
- "Sync Now" button + auto-sync interval setting (e.g., every 1 hour)
- Last synced timestamp display
- Sync status indicator (success/error)

### Bookings Management Table
- List of all bookings (filterable by property, date range, source: website/Airbnb, status)
- Actions: View Details, Approve, Cancel, Mark as Completed

---

## iCal Sync Logic

- Fetch the `.ics` file from the Airbnb iCal URL at set intervals
- Parse `VEVENT` blocks to extract `DTSTART`, `DTEND`, and `SUMMARY`
- Store synced blocks in the database tagged as `source: "airbnb"`
- When a customer attempts to book on the booking page, check availability against **both** website bookings and Airbnb-synced blocks
- Block dates that are occupied by either source before rendering the date picker

---

## Booking Conflict Prevention

- On the booking page, before rendering the date picker, fetch all unavailable date ranges for the selected property from the API
- The date picker must visually disable/grey out those ranges
- On form submission, re-validate availability server-side before confirming the booking
- Return a clear error message if a conflict is detected between form submission and server check

---

## Design Direction

- Warm, luxury-neutral palette (think warm whites, terracotta, sand, deep charcoal)
- Elegant serif display font for headings, clean sans-serif for body
- Large photography-forward layouts
- Smooth transitions and micro-interactions
- Mobile-first, fully responsive
- Admin dashboard: clean, data-dense, professional dark or light mode

---

## Key Data Models

### Property
| Field | Type |
|-------|------|
| `id` | UUID |
| `name` | String |
| `description` | Text |
| `images[]` | String Array |
| `amenities[]` | String Array |
| `pricePerNight` | Number |
| `icalUrl` | String |

### Booking
| Field | Type |
|-------|------|
| `id` | UUID |
| `propertyId` | UUID (FK) |
| `guestName` | String |
| `guestEmail` | String |
| `guestPhone` | String |
| `checkIn` | Date |
| `checkOut` | Date |
| `numGuests` | Number |
| `source` | Enum: `website` / `airbnb` |
| `status` | Enum: `pending` / `confirmed` / `cancelled` |
| `createdAt` | Timestamp |

### BlockedDate
| Field | Type |
|-------|------|
| `id` | UUID |
| `propertyId` | UUID (FK) |
| `startDate` | Date |
| `endDate` | Date |
| `reason` | String |
| `source` | Enum: `manual` / `airbnb` |

### User
| Field | Type |
|-------|------|
| `id` | UUID |
| `email` | String |
| `passwordHash` | String |
| `role` | Enum: `admin` / `customer` |

---

## API Endpoints (Suggested)

### Auth
- `POST /api/auth/register` — Customer registration
- `POST /api/auth/login` — Login (returns JWT)

### Properties
- `GET /api/properties` — List all properties
- `GET /api/properties/:id` — Get single property details
- `GET /api/properties/:id/availability` — Get unavailable date ranges (merged from website + Airbnb)

### Bookings
- `POST /api/bookings` — Create a new booking (customer)
- `GET /api/bookings` — List all bookings (admin only)
- `GET /api/bookings/:id` — Get booking details
- `PATCH /api/bookings/:id/status` — Update booking status (admin only)

### iCal Sync
- `POST /api/sync/:propertyId` — Trigger manual iCal sync for a property
- `GET /api/sync/:propertyId/status` — Get last sync status and timestamp

### Admin
- `GET /api/admin/dashboard` — Dashboard stats (total bookings, occupancy, revenue)
- `POST /api/admin/block` — Manually block a date range
- `DELETE /api/admin/block/:id` — Unblock a date range

---

## Notes for Developers

> This prompt can be used directly with AI code generators like **Bolt.new**, **v0.dev**, or **Cursor**, or handed to a developer as a full specification document.

- Ensure iCal sync runs on a **cron job** (e.g., every 60 minutes) in addition to manual triggers
- All availability checks must be performed **server-side** as the final validation before booking confirmation, regardless of client-side date picker restrictions
- Use **environment variables** for Airbnb iCal URLs and secrets — never hardcode them
- Consider **rate limiting** the booking endpoint to prevent spam submissions
