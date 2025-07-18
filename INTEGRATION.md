# Integration Guide: Real Server & Database

This guide explains how to deploy and connect your Smriti Pustakalaya system to a real production server and MongoDB database.

## 1. Backend Setup
- Set your MongoDB URI in `backend/.env`:
  ```
  MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority
  ```
- Make sure your server allows incoming connections from your frontend/employee app (CORS).
- Deploy backend (Node.js/Express) to a cloud VM, Heroku, or similar.

## 2. Frontend (Admin Panel)
- Update API endpoints in the frontend to point to your deployed backend (e.g., `https://your-backend.com/api/books`).
- Deploy frontend to Vercel, Netlify, or your own server.

## 3. Employee App (React Native)
- Update all fetch URLs to use your production backend URL.
- If using Expo, make sure your backend is accessible from mobile devices (use a public IP or domain).

## 4. Environment Variables
- Never commit `.env` files with secrets to git.
- Use `.env.example` to document required variables.

## 5. Security
- Use strong passwords for your database.
- Restrict allowed origins in CORS settings.
- Use HTTPS for all production traffic.

## 6. Useful Commands
```
# Start backend
cd backend && npm install && npm start

# Start frontend
cd smriti-pustakalaya admin panel frontend/smriti-pustakalaya && npm install && npm start

# Start employee app
cd Library-Management && npx expo start
```

## 7. Troubleshooting
- Check backend logs for errors
- Make sure all services are running and accessible
- Double-check MongoDB URI and network/firewall settings

---

For further help, open an issue on GitHub or contact the maintainer.
