1. What this service really does

Manages real-time communication using Socket.IO.

Tracks online users

Updates delivery boy live location

Broadcasts location updates

Syncs with backend services

2. Where it sits in the system
   Delivery App → Realtime-service → User-service
   ↓
   Delivery-service

3. Real end-to-end flow

Delivery boy connects via socket

Sends identity → stored in User-service

Sends live location

Location saved in User-service

Location forwarded to Delivery-service

Location broadcasted to clients

4. Socket Contract
   Event Sent by Why
   identity Client Identify user
   updateLocation Client Send live location
   disconnect Client Mark offline
5. Dependencies

User-service → socket + location

Delivery-service → location sync

6. What this service does NOT do

Does not store messages

Does not handle orders or payments
