1. What this service really does

Handles online payments using Razorpay.

Creates Razorpay order

Verifies captured payment

2. Where it sits in the system
   Order-service → Payment-service → Razorpay

3. API Contract
   Endpoint Called by Why
   POST /api/payment/create Order-service Create payment order
   POST /api/payment/verify Order-service Verify payment
4. Dependencies

Razorpay SDK

Razorpay credentials

5. What this service does NOT do

Does not store orders

Does not manage users
