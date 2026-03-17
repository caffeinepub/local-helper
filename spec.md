# Local Helper

## Current State
Blank project with empty Motoko backend (`actor {}`) and default React frontend with no screens or components.

## Requested Changes (Diff)

### Add
- Splash screen (2s auto-navigate to Home)
- Home screen with search bar and PG/Tiffin category cards
- Listings screen: card grid with image, name, price, area, description, Call Now button
- Detail screen: full info, large image, Call Now button
- Add Listing form: name, category, price, area, phone (stored as ownerPhone too), description, image upload
- My Listings screen: filter by ownerPhone, edit/delete with confirmation
- Search by name/area and category filter on Listings screen
- Empty states throughout
- Blob storage for listing images

### Modify
- Backend: implement full listing CRUD with ownerPhone filtering
- Frontend main.tsx: set up routing

### Remove
- Nothing existing to remove

## Implementation Plan
1. Select blob-storage component
2. Generate Motoko backend with Listing type (id, name, category, price, area, phone, ownerPhone, description, imageId?) and CRUD functions
3. Build frontend:
   - Router with screens: Splash, Home, Listings, Detail, AddListing, EditListing, MyListings
   - Shared components: ListingCard, BottomNav
   - All screens per feature spec
   - Image upload via blob-storage
   - Local state for search/filter
