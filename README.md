# WeatherScope

WeatherScope is a portfolio-ready full-stack weather forecast application with:

- `web/`: Next.js App Router frontend
- `api/`: NestJS backend
- MongoDB Atlas for persistence
- OpenWeather for live weather data
- JWT authentication for protected user routes

Core features:

- weather search by city
- auto-detect current location
- Celsius / Fahrenheit toggle
- register and login
- JWT stored on the frontend
- MongoDB search history
- protected dashboard with user profile and history

## Tech Stack

### Frontend

- Next.js `16.2.1`
- React `19.2.4`
- Tailwind CSS `4`
- TypeScript
- Lucide React

### Backend

- NestJS `11`
- MongoDB Atlas
- Mongoose
- JWT authentication
- bcrypt password hashing
- class-validator / class-transformer
- OpenWeather API

## Project Structure

```text
root/
|-- README.md
|-- railway.json
|-- web/
|   |-- .env.local.example
|   |-- package.json
|   `-- src/
|       |-- app/
|       |-- components/
|       |-- lib/
|       `-- types/
`-- api/
    |-- .env.example
    |-- package.json
    `-- src/
        |-- auth/
        |-- common/
        |-- users/
        `-- weather/
```

## Features

- Home page shows temperature, city, condition, weather icon, humidity, and wind speed
- Search weather by city
- Loading and error states
- Auto-detect location with browser geolocation
- `deg C / deg F` toggle
- Register and login with JWT
- Protected profile and dashboard routes
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
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/weather-app?retryWrites=true&w=majority
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

If PowerShell blocks `npm`, use:

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

## Deploy

### Frontend on Vercel

This repository is an isolated two-app repo, so create a separate Vercel project for the `web` directory.

1. Push the repository to GitHub.
2. In Vercel, choose `Add New -> Project`.
3. Import the repository.
4. In project settings, set `Root Directory` to `web`.
5. Keep the standard Next.js commands:

```text
Build Command: npm run build
Output: Next.js managed output
Install Command: npm install
```

6. Set the environment variable below for both `Production` and `Preview`:

```env
NEXT_PUBLIC_BACKEND_URL=https://your-railway-backend.up.railway.app
```

7. Deploy.

### Backend on Railway

This repository already includes [railway.json](./railway.json) with:

- `RAILPACK` builder
- `npm run build`
- `npm run start:prod`
- health check at `/api/health`
- watch path limited to `/api/**`

Deploy steps:

1. Push the repository to GitHub.
2. In Railway, create a new project from the same repository.
3. Open the backend service settings.
4. Set `Root Directory` to `/api`.
5. If Railway does not auto-pick the root config file, set the config file path to `/railway.json`.
6. Add the service variables:

```env
DATABASE_URL=mongodb+srv://...
JWT_SECRET=replace_with_a_real_secret
WEATHER_API_KEY=replace_with_a_real_openweather_key
```

7. Review and deploy the staged variable changes.

## Final Env Checklist

### Local development

Frontend:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

Backend:

```env
DATABASE_URL=mongodb+srv://...
JWT_SECRET=your_local_secret
WEATHER_API_KEY=your_openweather_api_key
```

### Vercel Production

```env
NEXT_PUBLIC_BACKEND_URL=https://your-railway-backend.up.railway.app
```

### Vercel Preview

```env
NEXT_PUBLIC_BACKEND_URL=https://your-railway-backend.up.railway.app
```

If you later change this variable on Vercel, redeploy. Vercel applies env changes only to new deployments.

### Railway Production

```env
DATABASE_URL=mongodb+srv://...
JWT_SECRET=strong_random_secret
WEATHER_API_KEY=real_openweather_api_key
```

When you add or edit variables in Railway, review and deploy the staged changes so they take effect.

## Production Checklist

- MongoDB Atlas cluster is reachable from Railway.
- Database user has the correct username and password.
- `DATABASE_URL` points to the production database, not a local or test database.
- `JWT_SECRET` is a strong random value, not the example value.
- `WEATHER_API_KEY` is a real OpenWeather key and already activated.
- `NEXT_PUBLIC_BACKEND_URL` points to the Railway public URL.
- Railway `Root Directory` is `/api`.
- Vercel `Root Directory` is `web`.
- Both platforms use Node.js `20.9+`.
- After setting env vars, trigger a fresh deploy on both platforms.
- Test these production flows:
  - weather search on home page
  - register
  - login
  - dashboard profile
  - dashboard history after a weather search while logged in

## Verified Commands

The following commands were run successfully in this workspace:

```bash
cd web && npm run lint
cd web && npm run build
cd api && npm run lint
cd api && npm run build
```

## Notes for Beginners

- The backend is split into `controller`, `service`, `module`, `dto`, and `schema`.
- Passwords are hashed with bcrypt before saving.
- Search history is only persisted when the user is authenticated.
- Guest users can still fetch weather, but guest searches are not saved.
- If you have exposed real secrets during development, rotate them before production deployment.
