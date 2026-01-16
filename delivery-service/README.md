1. What this service really does

Handles delivery workflow.

Assigns orders to delivery boys

Sends OTP for delivery confirmation

Marks delivery complete

Syncs with Order-service

2. Where it sits in the system
   Order-service → Delivery-service
   ↓
   User-service
   ↓
   Notification-service

3. Real end-to-end flow

Order-service triggers /assign

Delivery-service fetches nearby delivery boys

Assignment broadcasted

Delivery boy accepts

OTP sent to user

OTP verified

Delivery-service → Order-service marks delivered

4. API Contract
   Endpoint Called by Why
   POST /api/delivery/assign Order-service Start delivery
   GET /api/delivery/assignments Delivery app View jobs
   POST /api/delivery/accept/:id Delivery app Accept job
   POST /api/delivery/send-otp Delivery app Send OTP
   POST /api/delivery/verify-otp Delivery app Confirm delivery
   POST /api/delivery/internal/location-update Realtime-service Sync location
5. Dependencies

User-service → nearby delivery boys

Order-service → delivery completion

Notification-service → OTP email

6. What this service does NOT do

Does not handle payments

Does not manage users
