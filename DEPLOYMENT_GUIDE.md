# InfinityFree Deployment Guide
## Acier-Building-soft

### Deployment URL: https://mkposs.gt.tc/

---

## Pre-Deployment Checklist

### 1. Database Setup
- **Database Name**: if0_42333746_mk_pos
- **Username**: if0_42333746
- **Password**: VHxnlDleyPf09
- **Host**: sql107.infinityfree.com

### 2. Import Database Schema
1. Log in to InfinityFree control panel
2. Go to MySQL Databases
3. Open phpMyAdmin
4. Select database: `if0_42333746_mk_pos`
5. Import `database/schema.sql`
6. Verify all tables are created

---

## Deployment Steps

### Step 1: Upload Files via FTP

Use FileZilla or similar FTP client with your InfinityFree credentials:

**Files to upload to `htdocs/` directory:**
```
htdocs/
├── .htaccess
├── Frontend/
│   └── dist/
│       ├── index.html
│       └── assets/
├── backend/
│   └── php-backend/
│       ├── api.php
│       ├── config/
│       │   └── Database.php
│       ├── controllers/
│       │   ├── ProcurementController.php
│       │   ├── RAContractorController.php
│       │   └── TaxAitController.php
│       └── middleware/
│           └── AuthMiddleware.php
└── database/
    └── schema.sql (for reference)
```

**Do NOT upload:**
- `node_modules/`
- `src/` (source files)
- `package.json`
- `package-lock.json`
- `.git/`
- `backend/server.ts` (Node.js backend - not needed for PHP hosting)

### Step 2: Set File Permissions

Via FTP client or file manager:
- `.htaccess`: 644
- All PHP files: 644
- `Frontend/dist/`: 755
- `Frontend/dist/assets/`: 755

### Step 3: Verify Configuration

The database credentials are already configured in:
- `backend/php-backend/config/Database.php`

### Step 4: Test Deployment

1. Visit: https://mkposs.gt.tc/
2. Check if React app loads
3. Test API endpoints:
   - https://mkposs.gt.tc/api/v1/health
   - https://mkposs.gt.tc/api/v1/ra-bills

---

## Troubleshooting

### 500 Internal Server Error
- Check `.htaccess` syntax
- Verify PHP file permissions
- Check error logs in InfinityFree control panel

### Database Connection Failed
- Verify credentials in `Database.php`
- Ensure database exists on InfinityFree
- Check if MySQL server is accessible

### 404 Not Found
- Verify `.htaccess` is uploaded
- Check file paths in `.htaccess`
- Ensure `Frontend/dist/index.html` exists

### CORS Errors
- The API already includes CORS headers
- Check browser console for specific errors

---

## Post-Deployment

### Security Recommendations
1. Change JWT secret in `AuthMiddleware.php`
2. Enable HTTPS (already available on InfinityFree)
3. Regular database backups
4. Monitor error logs

### Performance Optimization
- Enable gzip compression in `.htaccess` (optional)
- Consider CDN for static assets
- Optimize database queries if needed

---

## API Endpoints

### Health Check
```
GET /api/v1/health
```

### RA Bills
```
GET /api/v1/ra-bills
POST /api/v1/ra-bills/approve
```

### Procurement
```
GET /api/v1/store/stock
POST /api/v1/procurement/grn
```

### Tax/AIT
```
POST /api/v1/tax/ait
```

---

## Support

For InfinityFree-specific issues:
- https://forum.infinityfree.net/

For project-specific issues:
- Check error logs in InfinityFree control panel
- Verify database connectivity via phpMyAdmin
