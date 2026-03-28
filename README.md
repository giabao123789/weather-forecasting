# WeatherScope

WeatherScope is a full-stack weather forecast application built as a portfolio-ready project with:

- `web/`: Next.js App Router frontend
- `api/`: NestJS backend
- MongoDB Atlas for persistence
- OpenWeather for live weather data
- JWT authentication for protected user routes

The app lets users:

- search weather by city
- auto-detect current location
- switch between `°C` and `°F`
- register and login
- store JWT locally on the frontend
- save weather search history into MongoDB
- review search history on a protected dashboard

## Tech Stack

### Frontend

- Next.js `16.2.1`
- React `19.2.4`
- Tailwind CSS `4`
- TypeScript
- Lucide React icons

### Backend

- NestJS `11`
- MongoDB Atlas
- Mongoose
- JWT authentication
- bcrypt password hashing
- class-validator / class-transformer
- OpenWeather API integration

## Project Structure

```text
root/
├── README.md
├── web/
│   ├── .env.local.example
│   ├── package.json
│   └── src/
│       ├── app/
│       ├── components/
│       ├── lib/
│       └── types/
└── api/
    ├── .env.example
    ├── package.json
    └── src/
        ├── auth/
        ├── common/
        ├── users/
        └── weather/
```

## Features

- Weather home page with temperature, city, weather condition, icon, humidity, and wind speed
- Search weather by city
- Loading and error states
- Auto-detect location with browser geolocation
- `°C / °F` toggle
- Register / login with JWT
- Protected profile and dashboard history routes
- MongoDB search history storage
- Responsive UI for desktop and mobile

## Environment Variables

### Frontend: `web/.env.local`

Create `web/.env.local` from `web/.env.local.example`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

### Backend: `api/.env`

Create `api/.env` from `api/.env.example`:

```env
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/weather-app
JWT_SECRET=your_super_secret_key
WEATHER_API_KEY=your_openweather_api_key
```

## Run Locally

### 1. Install frontend dependencies

```bash
cd web
npm install
```

### 2. Start frontend

```bash
cd web
npm run dev
```

### 3. Install backend dependencies

```bash
cd api
npm install
```

### 4. Start backend

```bash
cd api
npm run start:dev
```

### Default local URLs

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`

### Windows PowerShell note

If PowerShell blocks `npm` because of execution policy, use:

```bash
npm.cmd install
npm.cmd run dev
npm.cmd run start:dev
```

## API Endpoints

Base URL in local development:

```text
http://localhost:3001/api
```

### Auth

- `POST /auth/register`
- `POST /auth/login`

### Users

- `GET /users/profile`
- `GET /users/history`

### Weather

- `GET /weather?city=Ha%20Noi`
- `GET /weather?lat=10.7769&lon=106.7009`

### Utility

- `GET /health`

## Request / Response Notes

### `POST /auth/register`

Request body:

```json
{
  "name": "Bao Nguyen",
  "email": "bao@example.com",
  "password": "123456"
}
```

Response:

```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "mongo_user_id",
    "name": "Bao Nguyen",
    "email": "bao@example.com"
  }
}
```

### `POST /auth/login`

Request body:

```json
{
  "email": "bao@example.com",
  "password": "123456"
}
```

### `GET /users/profile`

Headers:

```text
Authorization: Bearer <jwt_token>
```

### `GET /weather`

Examples:

```text
GET /api/weather?city=Da%20Nang
GET /api/weather?lat=21.0278&lon=105.8342
```

The frontend calls the backend with:

```ts
fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/...`)
```

If a valid JWT is sent in the `Authorization` header, the backend automatically saves the successful search to MongoDB Atlas.

## How Authentication Works

1. User registers or logs in from the frontend.
2. NestJS validates credentials and returns a signed JWT.
3. The frontend stores the token in local storage.
4. Protected requests send `Authorization: Bearer <token>`.
5. NestJS guard validates the JWT for profile/history routes.

## Deploy

### Frontend on Vercel

1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Set the root directory to `web`.
4. Add environment variable:

```env
NEXT_PUBLIC_BACKEND_URL=https://your-railway-backend.up.railway.app
```

5. Deploy.

### Backend on Railway

1. Push the repository to GitHub.
2. Create a new Railway project.
3. Set the root directory to `api`.
4. Add environment variables:

```env
DATABASE_URL=mongodb+srv://...
JWT_SECRET=your_secret
WEATHER_API_KEY=your_api_key
PORT=3001
```

5. Railway will run the NestJS build and start commands from `api/package.json`.

## Production Checklist

- Create a MongoDB Atlas cluster and whitelist the deploy platform IP rules you need.
- Create an OpenWeather API key.
- Set `NEXT_PUBLIC_BACKEND_URL` to the Railway URL.
- Set `DATABASE_URL`, `JWT_SECRET`, and `WEATHER_API_KEY` on Railway.
- Test login, weather search, and dashboard history after deployment.

## Verified Commands

The following commands were used successfully in this workspace:

```bash
cd web && npm run lint
cd web && npm run build
cd api && npm run lint
cd api && npm run build
```

## Notes for Beginners

- The backend is separated clearly into `controller`, `service`, `module`, `dto`, and `schema`.
- Passwords are hashed with bcrypt before saving to MongoDB.
- Search history is only persisted when the user is authenticated.
- The weather route still works for guests, but guest searches are not saved.
