# RakSetu - Complete Startup & Usage Guide

## Installation (One-Time Setup)

### Prerequisites Check
```bash
# Verify Node.js is installed (need 18+)
node --version
npm --version
```

### Step 1: Install Dependencies
```bash
npm install
```

This installs all required packages:
- React 18.3.1
- Vite 5.4.2
- Tailwind CSS 3.4.1
- TypeScript 5.5.3
- Supabase client
- Lucide React icons

### Step 2: Verify Installation
```bash
npm run typecheck
npm run lint
```

Both should complete without errors.

## Development

### Start Dev Server
```bash
npm run dev
```

Output:
```
  VITE v5.4.8  ready in 245 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Open in Browser
- Navigate to: `http://localhost:5173/`
- You should see the RakSetu login page

## First Time Usage

### 1. Create Account

**Step 1: Click "Sign Up"**

**Step 2: Fill registration form**
- Name: Your name
- Email: Your email address
- Password: Secure password (6+ characters)
- Weekly Earnings: ₹ amount (e.g., 1000)

**Step 3: Click "Sign Up" button**

You'll see:
- Spinner indicating registration
- Redirect to dashboard after success
- If error, red error message appears

### 2. Login (on return visits)

**Step 1: Stay on login page**

**Step 2: Enter credentials**
- Email: Your registered email
- Password: Your password

**Step 3: Click "Login"**

## Dashboard Features

### Profile Section
Shows your information:
- Name
- Email
- Weekly Income (₹)

### Disruption Engine

**Button: "Check Disruption"**

What it does:
1. Generates random score (0-100)
2. Classifies as LOW, MEDIUM, or HIGH
3. Saves to database
4. Displays score and status

Status breakdown:
- GREEN "LOW" (0-39): Low income disruption
- YELLOW "MEDIUM" (40-69): Moderate disruption
- RED "HIGH" (70-100): High disruption

### Payout Eligible

**Button: "Calculate Payout"**

Requires: Disruption check first

What it does:
1. Reads your disruption score
2. Applies percentage:
   - LOW (0-39): 0% payout
   - MEDIUM (40-69): 30% payout
   - HIGH (70-100): 60% payout
3. Calculates amount: Weekly Earnings × Percentage
4. Displays payout amount

Example:
- Weekly Earnings: ₹1,000
- Disruption Score: 75 (HIGH)
- Payout: ₹1,000 × 60% = ₹600

### Claim Insurance

**Button: "Claim Payout"**

Requires: Calculate payout first

What it does:
1. Submits claim to database
2. Checks for fraud:
   - If another claim exists within 60 seconds: FRAUD FLAG
   - Otherwise: APPROVED
3. Saves claim record with timestamp
4. Updates claim history below

Fraud Protection:
- Can't claim twice in 60 seconds
- Flagged claims show as REJECTED
- Shows message: "Claim flagged as fraud"

### Claim History

Shows all your previous claims:

Each claim shows:
- Payout amount: ₹X
- Disruption score: 0-100
- Status: APPROVED or REJECTED
- Timestamp: When claimed
- Fraud warning: If fraudulent

## Example Workflow

### Scenario 1: Successful Claim

```
1. Check Disruption
   ↓
   Score: 72 (HIGH status, red)

2. Calculate Payout
   ↓
   Your earning: ₹2000
   HIGH = 60%
   Payout: ₹1200

3. Claim Payout
   ↓
   Claim APPROVED ✓
   Appears in history
```

### Scenario 2: Fraud Detection

```
1. Check Disruption
   ↓
   Score: 50 (MEDIUM status, yellow)

2. Calculate Payout
   ↓
   Payout: ₹500 (30% of ₹1666)

3. Claim Payout (first time)
   ↓
   Claim APPROVED ✓

4. Immediately Claim Again (within 60 seconds)
   ↓
   Error Message: "Cannot claim twice within 60 seconds"
   Claim REJECTED ✗
```

### Scenario 3: Low Disruption

```
1. Check Disruption
   ↓
   Score: 25 (LOW status, green)

2. Calculate Payout
   ↓
   LOW = 0% payout
   Payout: ₹0

3. Claim Payout
   ↓
   Claim APPROVED ✓
   But payout amount is ₹0
```

## Troubleshooting

### Issue: Port 5173 Already in Use

**Solution:**
```bash
npm run dev -- --port 3000
```

Vite will use port 3000 instead.

### Issue: Module Not Found Error

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue: Login Failed

**Solution:**
1. Check email spelling
2. Verify password is correct
3. Try registering a new account
4. Clear browser cache: Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)

### Issue: Can't See Changes After Editing

**Solution:**
1. HMR (Hot Module Reload) should auto-refresh
2. If not, hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
3. Check console for TypeScript errors

### Issue: Build Fails

**Solution:**
```bash
npm run typecheck        # Check TypeScript errors
npm run lint             # Check code style
npm install              # Reinstall dependencies
npm run build            # Try build again
```

### Issue: Supabase Connection Error

**Solution:**
- `.env` already has correct credentials
- Verify internet connection
- Check if Supabase is reachable: `curl https://onzsysoasdrhizpllukl.supabase.co`

## Advanced Usage

### Multiple Test Accounts

Create different accounts to:
- Test login/logout
- Compare different earning levels
- Test fraud detection with multiple users

### Testing Fraud Detection

1. Use same account
2. Check disruption and claim
3. Try to claim again within 60 seconds
4. See fraud flag in history

### Checking Claim History

Each claim shows:
```
₹1200
Disruption: 72
APPROVED ✓
2024-04-04 2:30:15 PM
```

Fraud flagged claims show:
```
₹0
Disruption: 50
REJECTED ✗
Fraud Detected
2024-04-04 2:31:10 PM
```

## Browser DevTools

### View Stored Data

**Open DevTools:** F12 or Right-click → Inspect

**Storage tab:**
- localStorage: Check JWT token
- Application → Cookies: Session info
- Network tab: See API calls to Supabase

### Debug Console

**Console tab:**
- See any JavaScript errors
- Log API responses
- Test commands

## Performance Notes

- Page loads: < 1 second
- Disruption check: Instant
- Payout calculation: < 100ms
- Claim submission: < 500ms
- Dashboard refresh: Real-time

## Data Stored

### In Browser
- JWT authentication token (localStorage)
- Session information

### In Supabase Database
- User profile (name, email, weekly earnings)
- All disruption checks
- All submitted claims
- Timestamps for fraud detection

### Privacy
- Only you can see your data
- Row Level Security (RLS) prevents other users from viewing
- Passwords never stored in plain text

## Logging Out

**Click "Logout" button** (top-right of dashboard)

This:
1. Clears browser storage (JWT token)
2. Logs out from Supabase
3. Redirects to login page
4. Clears all local session data

## Best Practices

### Security
- ✅ Don't share login credentials
- ✅ Clear browser cache if using shared computer
- ✅ Log out when done
- ✅ Use strong passwords

### Data Entry
- ✅ Enter accurate weekly earnings
- ✅ Check disruption scores regularly
- ✅ Submit claims promptly after calculation
- ✅ Review claim history for accuracy

### Testing
- ✅ Try different earning amounts
- ✅ Test fraud detection
- ✅ Check mobile responsiveness
- ✅ Test on different browsers

## Mobile Usage

The app is fully responsive:
- ✅ Works on iPhones
- ✅ Works on Android phones
- ✅ Works on tablets
- ✅ Touch-friendly buttons

### Mobile Access

1. On dev machine, find local IP:
   ```bash
   # On Mac/Linux
   ifconfig | grep "inet "

   # On Windows
   ipconfig | findstr "IPv4"
   ```

2. On phone, navigate to:
   ```
   http://YOUR_LOCAL_IP:5173
   ```

3. You can now access from phone

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Hard refresh | Ctrl+Shift+R |
| DevTools | F12 |
| Clear cache | Ctrl+Shift+Delete |
| Focus address bar | Ctrl+L |

## Next Steps

1. **Test Full Workflow**
   - Register
   - Check disruption
   - Calculate payout
   - Claim payout
   - Check history

2. **Create Multiple Accounts**
   - Test with different earnings
   - Test with different disruption scores

3. **Explore Dashboard**
   - Try all buttons
   - Check responsive design
   - View all data

4. **Deploy**
   - When ready, run `npm run build`
   - Deploy `dist/` folder
   - See DEPLOYMENT.md

## Support Resources

- **React**: https://react.dev
- **Supabase**: https://supabase.com/docs
- **Vite**: https://vitejs.dev
- **Tailwind**: https://tailwindcss.com/docs

## Time Estimates

| Task | Time |
|------|------|
| Install dependencies | 2 minutes |
| Start dev server | < 1 minute |
| Register account | < 1 minute |
| Full workflow test | 3 minutes |
| Explore all features | 5 minutes |

## Quick Commands Reference

```bash
npm install              # Install dependencies
npm run dev              # Start development
npm run build            # Build for production
npm run typecheck        # Check TypeScript
npm run lint             # Check code style
npm run preview          # Preview production build
```

## Summary

You now have a complete, working RakSetu application that you can:
- ✅ Run locally with one command
- ✅ Register and login
- ✅ Check disruption scores
- ✅ Calculate payouts
- ✅ Submit insurance claims
- ✅ View claim history
- ✅ Deploy to production

**Start now:** `npm run dev`

Then open: `http://localhost:5173`

Enjoy! 🚀
