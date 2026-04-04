# RakSetu - AI-Powered Parametric Insurance Platform

RakSetu is a full-stack web application designed for gig workers (delivery partners like Zomato, Swiggy) to access parametric insurance based on real-time disruption detection.

## Features

### Authentication
- User registration with email, password, name, and weekly earnings
- Secure JWT-based authentication via Supabase
- Login and logout functionality

### Dashboard
- Display worker profile and weekly income
- Real-time disruption score calculation (0-100)
- Automatic payout eligibility based on disruption level
- Claim management system

### Disruption Engine
- Random disruption score generation (0-100)
- Status classification:
  - LOW: 0-39 (0% payout)
  - MEDIUM: 40-69 (30% of weekly income)
  - HIGH: 70-100 (60% of weekly income)

### Payout & Claims
- Calculate insurance payout based on disruption score
- Claim disbursement with fraud detection
- Fraud flag if multiple claims within 60 seconds
- Complete claim history

## Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Backend**: Supabase (PostgreSQL + Auth)
- **Database**: Supabase PostgreSQL with RLS
- **Authentication**: Supabase Auth (Email/Password)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Setup & Installation

### Prerequisites
- Node.js 18+ and npm

### Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables (already configured in .env)
# The .env file contains your Supabase credentials

# Run the development server
npm run dev

# Open your browser and navigate to:
# http://localhost:5173
```

### Build for Production

```bash
npm run build
```

## Project Structure

```
project/
├── src/
│   ├── App.tsx                 # Main app component
│   ├── index.css               # Global styles with Tailwind
│   ├── main.tsx                # React entry point
│   └── pages/
│       ├── AuthPage.tsx        # Login & Registration
│       └── Dashboard.tsx       # Main dashboard
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── .env                        # Supabase credentials
```

## Database Schema

### gig_workers
- Stores worker profile information
- Fields: id, user_id, name, email, weekly_earnings, created_at
- RLS: Users can only view/update their own records

### disruption_checks
- Tracks disruption score checks
- Fields: id, user_id, disruption_score (0-100), status, checked_at
- RLS: Users can view and insert their own checks

### claims
- Stores claim records
- Fields: id, user_id, disruption_score, payout_amount, fraud_flagged, claim_status, created_at
- RLS: Users can view and insert their own claims

## How to Use

1. **Register**: Create a new account with your email, name, password, and weekly earnings
2. **Login**: Use your credentials to access the dashboard
3. **Check Disruption**: Click "Check Disruption" to get a random disruption score
4. **Calculate Payout**: Click "Calculate Payout" to see how much insurance you're eligible for
5. **Claim Payout**: Click "Claim Payout" to submit your insurance claim
6. **View History**: See all your previous claims in the claim history section

## Authentication Flow

- User registers with email and password
- Supabase creates auth user and stores in auth.users
- Worker profile data stored in gig_workers table
- JWT token stored in localStorage
- Token sent in Authorization header for authenticated requests
- Logout clears session and localStorage

## Fraud Detection

The system flags claims as fraudulent if:
- Multiple claims are submitted within 60 seconds from the same user
- Flagged claims are marked as REJECTED

## Security

- Row Level Security (RLS) enabled on all tables
- Authenticated users can only access their own data
- Passwords are securely hashed by Supabase
- All API calls require valid JWT token

## Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run typecheck  # Run TypeScript type checking
npm run lint       # Run ESLint
```

## Environment Variables

The `.env` file contains:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

These are already configured and should not be changed.

## Troubleshooting

**Issue**: Cannot connect to Supabase
- Solution: Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env are correct

**Issue**: Auth errors
- Solution: Clear browser cache/localStorage and try registering again

**Issue**: Build fails
- Solution: Run `npm install` to ensure all dependencies are installed

## Notes

- Disruption scores are randomly generated (0-100) for simulation
- Payout calculations are immediate and deterministic
- Fraud detection only checks within 60-second window
- All times are stored in UTC

## License

MIT
