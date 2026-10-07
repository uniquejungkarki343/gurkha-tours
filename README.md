# Gurkha Tours & Travels

Front-end internship project by Unique Karki (TU Reg. No. 6-2-1105-52-2022), built with React, Vite, Tailwind CSS, React Router and Axios.

## Run
    npm install
    npm run dev      # http://localhost:5173
    npm run build    # production build in dist/

## What's inside
- Home with hero search, category shortcuts and top-rated trips
- Packages page: search, category filter, sorting (kept in the URL)
- Trip details with highlights, day-by-day itinerary and a validated booking form
- Register / Login with validation, protected "My bookings" page, redirect back after login
- Loading, error (with retry) and empty states on every data screen
- Responsive layout with mobile menu; reusable components (Navbar, Footer, PackageCard, Status, useFetch)

## API
`src/api.js` uses an Axios instance with a local mock adapter, so the app works with no server.
To connect a real backend, remove the `adapter` and set `baseURL` (endpoints: GET /packages, GET /packages/:id, POST /bookings).
Accounts are stored in localStorage for demo purposes only; a real app must authenticate on a server.
