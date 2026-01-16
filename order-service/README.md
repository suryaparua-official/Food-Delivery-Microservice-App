1. What this service really does

This service manages the complete order lifecycle.

Place order

Split order by shop

Trigger payment

Track order status

Trigger delivery assignment

Finalize delivery

2. Where it sits in the system
   Frontend → Order-service → MongoDB
   ↓
   Payment-service
   ↓
   Delivery-service

3. Real end-to-end flow

User places order

Order-service groups items by shop

If online payment → Payment-service

When shop marks “out of delivery”

Order-service → Delivery-service assign

Delivery completed → Delivery-service → Order-service

Order status becomes “delivered”

4. API Contract
   Endpoint Called by Why
   POST /api/order/place-order Frontend Create order
   POST /api/order/verify-payment Frontend Confirm payment
   GET /api/order/my-orders Frontend User orders
   GET /api/order/get-order/:id Frontend Order details
   POST /api/order/update-status/:orderId/:shopId Owner panel Update status
   POST /api/order/internal/mark-delivered Delivery-service Finalize order
5. Dependencies

Payment-service

Delivery-service

Notification-service

6. What this service does NOT do

Does not manage user authentication

Does not send emails
