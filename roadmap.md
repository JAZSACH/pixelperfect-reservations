# Roadmap
- [x] Heritage site: home, Book a Table (Small/Big Party forms + validation), request-received page, owner action page
- [x] Booking + owner action pages wired to server functions (own Supabase + Resend, no Lovable Cloud)
- [x] User runs docs/external-supabase.sql in their own Supabase
- [x] EXTERNAL_SUPABASE_URL + EXTERNAL_SUPABASE_SERVICE_ROLE_KEY secrets saved
- [x] Resend verified domain + RESEND_FROM (bookings@crowntreaty.com) + OWNER_EMAIL saved
- [x] End-to-end test booking (CT-6B83A2) + guest-limit validation
- [ ] User confirms the two test emails arrived (request-received to customer, Confirm/Decline to thecrowntreaty@gmail.com)
- [ ] Delete the two "Test Booking" rows from the reservations table
- [ ] Publishing / hosting the site (user's plan: Vercel)
