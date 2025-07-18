# Smriti Pustakalaya Backend

This is the production-grade backend for Smriti Pustakalaya, supporting both the admin web panel and the employee (Android) app.

## Tech Stack
- Node.js
- Express.js
- MongoDB (via Mongoose)
- JWT for authentication
- Joi for validation
- Multer for file uploads
- Winston for logging

## Folder Structure
```
backend/
│
├── src/
│   ├── controllers/    # Business logic for each feature
│   ├── models/         # Database models
│   ├── routes/         # API endpoints
│   ├── middlewares/    # Auth, error handling, validation
│   ├── utils/          # Helper functions
│   ├── config/         # App and DB configs
│   └── app.js          # Main Express app
│
├── .env                # Environment variables (never commit secrets)
├── package.json        # Dependencies and scripts
└── README.md           # Documentation
```

## Features
- Secure authentication for admin, employee, and donor
- Book, donation, employee, and donor management
- Certificate generation and download
- Role-based access and robust error handling

## Setup
1. Install dependencies: `npm install`
2. Create a `.env` file (see `.env.example`)
3. Start the server: `npm run dev` (development) or `npm start` (production)

---

All code is modular, validated, and ready for production deployment. See the docs in each folder for more details.
