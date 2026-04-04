# RakSetu - Deployment & Production Guide

## Current Environment

- **Frontend**: Running on Vite dev server (localhost:5173)
- **Backend**: Supabase (Cloud-hosted PostgreSQL + Auth)
- **Database**: Supabase PostgreSQL with RLS
- **Environment**: Development

## Production Build

### Build the Application

```bash
npm run build
```

This creates an optimized production build in `dist/` folder with:
- Minified JavaScript (~84KB gzipped)
- Optimized CSS
- Automatic code splitting
- Source maps for debugging

### Files Generated

```
dist/
├── index.html           # Main HTML file
├── assets/
│   ├── index-XXXXX.js  # Minified JavaScript
│   └── index-XXXXX.css # Minified CSS
```

## Deployment Options

### Option 1: Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Steps:
1. Connect your GitHub repository
2. Vercel auto-detects React + Vite
3. Deploys to `your-app.vercel.app`
4. Automatic builds on each push

### Option 2: Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

Steps:
1. Build: `npm run build`
2. Connect repository
3. Set build command: `npm run build`
4. Set publish directory: `dist`

### Option 3: Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "preview"]
```

Build and run:

```bash
docker build -t raksetu .
docker run -p 5173:5173 raksetu
```

### Option 4: Traditional Hosting (AWS, GCP, etc.)

1. Build the app: `npm run build`
2. Upload `dist/` folder to your static hosting
3. Configure web server to serve `index.html` for all routes
4. Set appropriate cache headers

## Environment Configuration

### Production Environment Variables

The `.env` file is already configured with Supabase credentials that work for both development and production.

If deploying to different Supabase projects:

```
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

## Security Checklist

- ✅ HTTPS/TLS enabled
- ✅ Supabase RLS policies active
- ✅ JWT tokens properly secured
- ✅ No sensitive data in frontend code
- ✅ CORS configured correctly
- ✅ Database backups enabled
- ✅ Authentication enforced

## Performance Optimization

### Already Implemented

- Vite build optimization
- Tree-shaking unused code
- CSS minification
- JavaScript minification
- Image optimization

### Additional Steps

1. **Enable Caching**
   ```
   Cache-Control: max-age=31536000 (assets)
   Cache-Control: max-age=3600 (index.html)
   ```

2. **Enable Compression**
   - GZIP compression enabled by default
   - Brotli for advanced use cases

3. **CDN Integration**
   - Vercel: Built-in CDN
   - Netlify: Built-in CDN
   - Self-hosted: Use CloudFlare

## Database Backups

Supabase automatically handles:
- Daily automated backups
- Point-in-time recovery
- Replication for redundancy

To backup manually:

```sql
-- Export data
SELECT * FROM gig_workers TO stdout;
SELECT * FROM disruption_checks TO stdout;
SELECT * FROM claims TO stdout;
```

## Monitoring

### Application Monitoring

```bash
# Check build size
npm run build

# Run lighthouse audit
npx lighthouse https://your-app.vercel.app
```

### Database Monitoring

Via Supabase Dashboard:
- Query performance
- Storage usage
- Auth logs
- Real-time activity

## Scaling Considerations

### For Growth to 100K Users

1. **Database**: Supabase handles auto-scaling
2. **Frontend**: CDN caching (built-in with Vercel/Netlify)
3. **Auth**: Supabase supports unlimited users
4. **Storage**: Add indexes on frequently queried columns

### Optimization for Scale

```sql
-- Add indexes for common queries
CREATE INDEX idx_gig_workers_user_id ON gig_workers(user_id);
CREATE INDEX idx_disruption_checks_user_id ON disruption_checks(user_id);
CREATE INDEX idx_claims_user_id ON claims(user_id);
CREATE INDEX idx_claims_created_at ON claims(created_at);
```

## Troubleshooting Production Issues

### Issue: 404 Errors on Refresh

Solution: Configure web server to serve `index.html` for all routes

**Vercel**: Automatic
**Netlify**: Automatic
**Others**: Add rewrite rule

### Issue: Slow Database Queries

Solution:
1. Add indexes
2. Check query performance in Supabase dashboard
3. Enable query caching

### Issue: Authentication Failing

Solution:
1. Verify `.env` variables
2. Check Supabase project is active
3. Clear browser cache
4. Verify CORS settings

### Issue: Build Fails

Solution:
```bash
npm run typecheck  # Check types
npm run lint       # Check linting
npm run build      # Try building locally first
```

## Rollback Plan

1. Keep previous builds archived
2. Use git tags for version control
3. Vercel/Netlify have automatic rollback

```bash
git tag -a v1.0.0 -m "Production release"
git push origin v1.0.0
```

## Post-Deployment

1. ✅ Test all features in production
2. ✅ Monitor error logs
3. ✅ Check performance metrics
4. ✅ Gather user feedback
5. ✅ Set up monitoring alerts

## CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run typecheck
      - run: npm run lint
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Maintenance Schedule

- **Weekly**: Check error logs, monitor performance
- **Monthly**: Review user feedback, plan updates
- **Quarterly**: Security audit, dependency updates
- **Annually**: Major version upgrades, architecture review

## Support & Documentation

- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev

---

**Ready for production!** Deploy with confidence.
