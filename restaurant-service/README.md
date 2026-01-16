1. What this service really does

Manages restaurants and food items.

Restaurant creation/edit

Item CRUD

City-based listing

Search

Rating

Image upload via Cloudinary

2. Where it sits in the system
   Owner Panel → Restaurant-service → MongoDB
   User App → Restaurant-service

3. Real end-to-end flow

Owner logs in

Creates or edits restaurant

Adds items with images

Users browse items by city

Users search and rate items

4. API Contract
   Restaurant

POST /api/restaurant/create-edit

GET /api/restaurant/get-my

GET /api/restaurant/get-by-city/:city

Item

POST /api/item/add

PUT /api/item/edit/:itemId

DELETE /api/item/delete/:itemId

GET /api/item/by-city/:city

GET /api/item/by-shop/:shopId

GET /api/item/search

POST /api/item/rating

5. Dependencies

MongoDB

Cloudinary

JWT middleware

6. What this service does NOT do

Does not manage users

Does not handle orders or payments
