# RakSetu - Quick Start Guide

## One-Command Setup

```bash
npm install && npm run dev
```

That's it! Your development server will start on `http://localhost:5173`

## What You Get

### Complete Full-Stack Application
- ✅ React frontend with modern UI
- ✅ Supabase backend (PostgreSQL + Auth)
- ✅ Real-time database with Row Level Security
- ✅ Authentication system
- ✅ Responsive dark theme with teal accents

## First Time Setup

1. **Install & Run**
   ```bash
   npm install
   npm run dev
   ```

2. **Open in Browser**
   - Navigate to: `http://localhost:5173`

3. **Create Account**
   - Click "Sign Up"
   - Enter: Name, Email, Password, Weekly Earnings
   - Click "Sign Up" button

4. **Explore Dashboard**
   - Check Disruption Score
   - Calculate Payout
   - Claim Insurance
   - View Claim History

## Features Walkthrough

### 1. Authentication
- **Register**: New users can create accounts with weekly earnings info
- **Login**: Return users can log back in
- **Logout**: Secure logout from the dashboard

### 2. Disruption Engine
- Click "Check Disruption" to generate a random score (0-100)
- Status shows:
  - GREEN (LOW): 0-39 points → 0% payout
  - YELLOW (MEDIUM): 40-69 points → 30% payout
  - RED (HIGH): 70-100 points → 60% payout

### 3. Payout Calculator
- After checking disruption, click "Calculate Payout"
- System calculates eligible amount based on your weekly earnings and disruption status
- Example: ₹1000 weekly earning + HIGH disruption = ₹600 payout

### 4. Insurance Claims
- Click "Claim Payout" to submit your claim
- System stores claim in database
- Fraud detection: Can't claim twice in 60 seconds
- View full claim history below

## Database Structure

Your data is stored in three tables:

### gig_workers
- Stores your profile: name, email, weekly earnings
- Private: Only you can access your data

### disruption_checks
- Records each disruption score you check
- Shows date, score, and status

### claims
- Records all insurance claims you submit
- Shows payout amount, status (APPROVED/REJECTED), and fraud flags

## Security

- **Passwords**: Securely hashed by Supabase
- **Authentication**: JWT tokens in localStorage
- **Data Privacy**: Row Level Security ensures only you can access your data
- **Fraud Detection**: Automatic flagging for suspicious claim patterns

## Environment Variables

Already configured in `.env`:
```
VITE_SUPABASE_URL=https://onzsysoasdrhizpllukl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

No changes needed!

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

## Project Features

### UI Components
- Modern dark theme with teal accents
- Responsive design (mobile + desktop)
- Loading states and error handling
- Smooth animations and transitions
- Icons from Lucide React

### State Management
- React Hooks (useState, useEffect)
- Supabase client for data operations
- Authentication state management

### Database Operations
- Real-time data sync
- Secure queries with RLS
- Automatic timestamps
- Foreign key relationships

## Troubleshooting

### Port Already in Use
```bash
# Vite will automatically use next available port
# Or specify a different port:
npm run dev -- --port 3000
```

### Clear Cache
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Build Issues
```bash
npm run typecheck  # Check for TypeScript errors
npm run lint       # Check code style
npm run build      # Full build
```

## API Routes (via Supabase)

### Authentication
- `POST /auth/v1/signup` - Register new user
- `POST /auth/v1/token?grant_type=password` - Login
- `POST /auth/v1/logout` - Logout

### Database Operations
- `SELECT` gig_workers - Get profile
- `INSERT` disruption_checks - Log disruption check
- `SELECT` disruption_checks - Get check history
- `INSERT` claims - Submit claim
- `SELECT` claims - Get claim history

## Performance

- **Build Size**: ~84KB gzipped (JavaScript + CSS)
- **Load Time**: < 1 second on modern devices
- **Database Queries**: Optimized with proper indexes
- **Real-time Updates**: Instant sync with Supabase

## Next Steps

1. Test all features thoroughly
2. Create multiple test accounts
3. Try different disruption scores
4. Test fraud detection (claim twice in 60 seconds)
5. Check claim history for records

## Support

For issues or questions:
1. Check `README.md` for detailed documentation
2. Review browser console for error messages
3. Verify Supabase credentials in `.env`
4. Check network tab in DevTools

---

**Ready to go!** Start with: `npm install && npm run dev`
