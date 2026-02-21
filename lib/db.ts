import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function query(text: string, values?: (string | number | boolean | null | object)[]) {
  try {
    const result = await sql.query(text, values)
    return result
  } catch (error) {
    console.error("Database error:", error)
    throw error
  }
}

export async function getProperties() {
  return query("SELECT * FROM properties ORDER BY name ASC")
}

export async function getPropertyById(id: string) {
  const result = await query("SELECT * FROM properties WHERE id = $1", [id])
  return result[0]
}

export async function createProperty(
  name: string,
  description: string,
  pricePerNight: number,
  maxGuests: number,
) {
  const result = await query(
    "INSERT INTO properties (name, description, price_per_night, max_guests) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, description, pricePerNight, maxGuests],
  )
  return result[0]
}

export async function updateProperty(
  id: string,
  name: string,
  description: string,
  pricePerNight: number,
  maxGuests: number,
) {
  const result = await query(
    "UPDATE properties SET name = $1, description = $2, price_per_night = $3, max_guests = $4 WHERE id = $5 RETURNING *",
    [name, description, pricePerNight, maxGuests, id],
  )
  return result[0]
}

export async function deleteProperty(id: string) {
  return query("DELETE FROM properties WHERE id = $1", [id])
}

export async function getBookings(propertyId?: string) {
  if (propertyId) {
    return query("SELECT * FROM bookings WHERE property_id = $1 ORDER BY check_in DESC", [
      propertyId,
    ])
  }
  return query("SELECT * FROM bookings ORDER BY check_in DESC")
}

export async function getBookingById(id: string) {
  const result = await query("SELECT * FROM bookings WHERE id = $1", [id])
  return result[0]
}

export async function createBooking(
  propertyId: string,
  guestName: string,
  guestEmail: string,
  guestPhone: string,
  checkIn: Date,
  checkOut: Date,
  numberOfGuests: number,
  totalPrice: number,
) {
  const result = await query(
    `INSERT INTO bookings (property_id, guest_name, guest_email, guest_phone, check_in, check_out, number_of_guests, total_price, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [
      propertyId,
      guestName,
      guestEmail,
      guestPhone,
      checkIn,
      checkOut,
      numberOfGuests,
      totalPrice,
      "pending",
    ],
  )
  return result[0]
}

export async function updateBookingStatus(
  id: string,
  status: "pending" | "confirmed" | "cancelled",
) {
  const result = await query("UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *", [
    status,
    id,
  ])
  return result[0]
}

export async function checkAvailability(propertyId: string, checkIn: Date, checkOut: Date) {
  // Check for overlapping bookings
  const bookings = await query(
    `SELECT * FROM bookings 
     WHERE property_id = $1 
     AND status = 'confirmed'
     AND check_in < $3 
     AND check_out > $2`,
    [propertyId, checkIn, checkOut],
  )

  // Check for blocked dates
  const blocked = await query(
    `SELECT * FROM blocked_dates 
     WHERE property_id = $1 
     AND date >= $2::date 
     AND date < $3::date`,
    [propertyId, checkIn, checkOut],
  )

  return {
    available: bookings.length === 0 && blocked.length === 0,
    overlappingBookings: bookings.length,
    blockedDates: blocked.length,
  }
}

export async function getBlockedDates(propertyId: string) {
  return query("SELECT * FROM blocked_dates WHERE property_id = $1 ORDER BY date ASC", [propertyId])
}

export async function addBlockedDate(propertyId: string, date: Date, reason?: string) {
  const result = await query(
    "INSERT INTO blocked_dates (property_id, date, reason) VALUES ($1, $2::date, $3) RETURNING *",
    [propertyId, date, reason || null],
  )
  return result[0]
}

export async function removeBlockedDate(id: string) {
  return query("DELETE FROM blocked_dates WHERE id = $1", [id])
}

export async function createPayment(
  bookingId: string,
  razorpayOrderId: string,
  amount: number,
  currency: string = "INR",
) {
  const result = await query(
    `INSERT INTO payments (booking_id, razorpay_order_id, amount, currency, status)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [bookingId, razorpayOrderId, amount, currency, "pending"],
  )
  return result[0]
}

export async function updatePaymentStatus(
  paymentId: string,
  status: "pending" | "completed" | "failed",
  razorpayPaymentId?: string,
  razorpaySignature?: string,
) {
  const result = await query(
    `UPDATE payments SET status = $1, razorpay_payment_id = $2, razorpay_signature = $3 WHERE id = $4 RETURNING *`,
    [status, razorpayPaymentId || null, razorpaySignature || null, paymentId],
  )
  return result[0]
}

export async function getPaymentByBookingId(bookingId: string) {
  const result = await query("SELECT * FROM payments WHERE booking_id = $1", [bookingId])
  return result[0]
}
