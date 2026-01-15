# Deployment Guide for TaskFlow (Full-Stack Application)

This guide will walk you through deploying your full-stack application consisting of:
- Frontend: Next.js application
- Backend: FastAPI application

You can deploy using either approach:
- **Recommended**: Frontend on Vercel, Backend on Railway
- **Alternative**: Both on Railway (single deployment)

## Prerequisites

1. A GitHub account with the repository pushed
2. Accounts on:
   - Vercel (for frontend): https://vercel.com
   - Railway (for backend): https://railway.app
   OR just Railway if deploying both services there
3. Vercel CLI installed locally (optional): `npm i -g vercel`

## Option 1: Separate Deployment (Recommended)

### Part 1: Deploy Backend (FastAPI) to Railway

#### Step 1: Prepare for Backend Deployment
Your backend is already prepared with:
- `Procfile` - tells Railway how to run your application
- `runtime.txt` - specifies Python version
- `requirements.txt` - lists dependencies

#### Step 2: Deploy to Railway
1. Log in to your Railway account
2. Click "New Project" → "Deploy from GitHub"
3. Connect to your GitHub account and select your repository
4. Select the `backend` directory
5. Railway should automatically detect this is a Python project
6. Configure the following:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host=0.0.0.0 --port=$PORT`
7. Add Environment Variables in the "Variables" tab:
   - `DATABASE_URL`: Your PostgreSQL database URL
   - `BETTER_AUTH_SECRET`: Your JWT secret (at least 32 characters)
   - `CORS_ORIGINS`: Your frontend URL (e.g., https://your-app.vercel.app)
   - `ENVIRONMENT`: production
8. Click "Deploy"

#### Step 3: Note Your Backend URL
After deployment, Railway will provide a URL for your backend (e.g., `https://your-backend.up.railway.app`). Save this URL as you'll need it for frontend deployment.

### Part 2: Deploy Frontend (Next.js) to Vercel

#### Step 1: Prepare for Frontend Deployment
Your frontend is already prepared with:
- `vercel.json` - Vercel configuration
- Proper API URL handling via environment variables

#### Step 2: Deploy to Vercel
Choose one of these methods:

##### Method A: Using Vercel Dashboard
1. Go to https://vercel.com and log in
2. Click "Import Project" → "Git Repository"
3. Select your GitHub repository
4. Select the `frontend` directory
5. In the settings, add Environment Variables:
   - `NEXT_PUBLIC_API_URL`: Your backend URL from Step 1.3 (e.g., https://your-backend.up.railway.app)
6. Click "Deploy"

##### Method B: Using Vercel CLI
```bash
# Navigate to frontend directory
cd frontend

# Login to Vercel
npx vercel login

# Deploy
npx vercel --prod
```

When prompted for environment variables, provide:
- `NEXT_PUBLIC_API_URL`: Your backend URL from Step 1.3

## Option 2: Single Deployment on Railway (Alternative)

### Part 1: Deploy Both Services to Railway

1. Log in to your Railway account
2. Click "New Project" → "Deploy from GitHub"
3. Connect to your GitHub account and select your repository
4. Railway can deploy both services together or you can set up a split deployment

#### For Split Deployment (Two Services):
- Add the backend service using the `backend` directory
- Add the frontend service using the `frontend` directory

#### For Frontend Service Configuration:
- Railway will handle Next.js deployment automatically
- Add Environment Variables:
  - `NEXT_PUBLIC_API_URL`: Your backend URL (from the backend service)

## Part 3: Verification

1. Access your frontend URL (provided by Vercel or Railway)
2. Test authentication (sign up, sign in)
3. Verify that API calls to your backend are working properly
4. Check browser developer tools for any network errors

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure your backend's `CORS_ORIGINS` includes your frontend URL

2. **API Connection Issues**: Verify that `NEXT_PUBLIC_API_URL` points to your deployed backend

3. **Database Connection**: Ensure your backend has access to a persistent database (Railway offers PostgreSQL databases)

4. **JWT Secret Mismatch**: Ensure the same secret is used in both frontend (`BETTER_AUTH_SECRET`) and backend

5. **Port Configuration**: Make sure your backend listens on the `$PORT` environment variable provided by Railway

## Scaling Considerations

1. **Database**: Consider upgrading to a production-ready PostgreSQL database on Railway
2. **Authentication**: The current JWT setup should work well
3. **Monitoring**: Both Vercel and Railway offer monitoring tools

## Updating Deployments

- For updates: Commit and push to your GitHub repository - both Vercel and Railway will auto-deploy (if enabled)

Your full-stack application will be live with the frontend and backend communicating securely via HTTPS.