1. What this service really does

This is the central email service for the whole system.

Sends OTP

Sends delivery related emails

Keeps all email logic in one place

2. Where it sits in the system
   All services → Notification-service → Email SMTP

3. API Contract
   Endpoint Called by Why
   POST /api/notify/email All services Send email
4. Dependencies

Nodemailer

SMTP credentials

5. What this service does NOT do

Does not store notifications

Does not push SMS or WhatsApp
