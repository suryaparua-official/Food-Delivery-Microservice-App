1. What this service really does

This is the central user master service.
All user related information is stored and maintained here:

profile data

role (user / owner / deliveryBoy)

location

online/offline status

socket id

2. Where it sits in the system
   Auth-service → User-service → MongoDB
   Realtime-service → User-service
   Delivery-service → User-service

3. Real end-to-end flow

Auth-service creates users here

Realtime-service updates online/offline and location

Delivery-service fetches nearby delivery boys from here

4. API Contract
   Endpoint Called by Why
   GET /api/user/by-email/:email Auth-service Find user
   POST /api/user/ Auth-service Create user
   PATCH /api/user/otp Auth-service Save OTP
   PATCH /api/user/reset-password Auth-service Reset password
   PATCH /api/user/socket/online Realtime-service Mark online
   PATCH /api/user/socket/location Realtime-service Update location
   PATCH /api/user/socket/offline Realtime-service Mark offline
   GET /api/user/nearby-delivery-boys Delivery-service Assign delivery
5. Database design

MongoDB

Geo index: location → 2dsphere for nearby search

6. What this service does NOT do

Does not authenticate users

Does not handle payments or orders
