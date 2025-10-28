# Kolkata FF - Result Website

A complete Kolkata FF result website with **automatic table generation**, **admin panel**, **IP-based security**, **2FA authentication**, and **Google AdSense/Analytics** integration.

## 🌟 Key Features

### ✅ **Automatic Result System**
- **Auto-creates new table** at 12:00 AM IST every day
- **8 rounds per day** (Sunday: 4 rounds)
- **Old results automatically archived** after 24 hours
- **Real-time updates** every 30 seconds

### 🔐 **Advanced Security**
- **Hidden admin URL** - `/uyetr-36ejdne-ye.html` (not publicly visible)
- **Password protection** with complex password
- **Google Authenticator 2FA** required for login
- **10 backup codes** for emergency access
- **IP-based blocking** - 5 wrong attempts = 24-hour block
- **Session timeout** - Auto-logout after 2 hours

### 📊 **Admin Features**
- Add results for all 8 rounds
- Auto-calculate sum of digits
- Edit Google AdSense code
- Edit Google Analytics ID
- View old results archive

### 🎨 **SEO Optimized**
- Optimized for keywords: kolkata ff, kolkata fatafat, kolkata ff result, etc.
- Complete meta tags and descriptions
- Open Graph tags for social sharing
- Mobile-responsive design

## 📁 File Structure

```
Website Files:
├── index.html                  # Homepage with result tables
├── uyetr-36ejdne-ye.html      # Hidden admin panel (SECRET)
├── news.html                   # News category page
├── mall.html                   # Mall information page
├── about.html                  # About us page
├── contact.html                # Contact page
├── privacy.html                # Privacy policy
├── style.css                   # All styling
├── main.js                     # Homepage auto-table system
├── admin.js                    # Admin panel with security
├── script.js                   # Old script (not used)
├── README.md                   # This file
└── INSTALLATION_GUIDE.txt     # Installation instructions
```

## 🚀 Quick Start

### 1. Upload All Files
Upload ALL files to your server (Alibaba Cloud, cPanel, etc.)

### 2. Access Admin Panel
**⚠️ IMPORTANT: Keep this URL SECRET!**

Admin URL: `https://yourdomain.com/uyetr-36ejdne-ye.html`

**Credentials:**
- **Password:** `m7(__.tbo}'al(V%nkBPr'8h5}wvo1f4,%1v~1}1m&MJz~wzz)`
- **2FA Code (Demo):** `123456`

### 3. Setup Google Authenticator
1. Open admin URL
2. Login with password
3. Click "Setup 2FA"
4. Scan QR code or enter: `JBSWY3DPEHPK3PXP`
5. Save 10 backup codes in safe place

### 4. Add Today's Results
1. Login to admin panel
2. Enter 3 digits for each round (e.g., `239`)
3. Sum auto-calculates (e.g., `4`)
4. Click "Save" for each round
5. Results appear on homepage instantly

## 🔐 Security Features

### IP Blocking System
- **5 failed login attempts** = **24-hour block**
- Block is based on browser fingerprint
- Blocks persist even after clearing cookies
- View block status on login page

### 2FA (Two-Factor Authentication)
- **Google Authenticator** required
- **Secret Key:** `JBSWY3DPEHPK3PXP`
- **10 backup codes** generated automatically
- Each backup code can be used once

### Session Management
- **2-hour session timeout**
- Auto-logout on inactivity
- Secure session storage

## 📅 Auto Table System

### How It Works

1. **At 12:00 AM IST** every day:
   - New blank table created automatically
   - Previous day's table moves to "Old Results"

2. **During the day**:
   - Admin adds results for 8 rounds
   - Each round has: 3 digits + sum
   - Homepage updates in real-time

3. **After 24 hours**:
   - Table becomes "old result"
   - Background color changes to gray
   - New table appears at top

### Manual Testing
Open browser console and run:
```javascript
createNewDay()  // Creates tomorrow's table for testing
```

## 🎯 Round Timings

| Round | Time     | Draw Time |
|-------|----------|-----------|
| 1     | 10:12 AM | 🕙        |
| 2     | 11:43 AM | 🕚        |
| 3     | 01:14 PM | 🕜        |
| 4     | 02:45 PM | 🕝        |
| 5     | 04:16 PM | 🕞        |
| 6     | 05:47 PM | 🕟        |
| 7     | 07:18 PM | 🕢        |
| 8     | 08:49 PM | 🕣        |

**Sunday:** Only 4 rounds (ending at 3:00 PM)

## 📊 Google AdSense Setup

1. Login to admin panel
2. Click "Edit AdSense Code"
3. Paste your complete AdSense code:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXX"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXX"
     data-ad-slot="XXXXXXXXXX"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```
4. Click "Save"
5. Ads appear on all pages

## 📈 Google Analytics Setup

1. Login to admin panel
2. Click "Edit Analytics ID"
3. Enter your Measurement ID: `G-XXXXXXXXXX`
4. Click "Save"
5. Refresh homepage

## 🎨 Customization

### Change Website Name
Edit all HTML files, replace "KOLKATAFF.in" with your name.

### Change Admin URL
1. Rename `uyetr-36ejdne-ye.html` to anything
2. Example: `my-secret-admin-2024.html`
3. Access new URL

### Change Password
Edit `admin.js` line 3:
```javascript
const ADMIN_PASSWORD = "your-new-secure-password";
```

### Change 2FA Secret
Edit `admin.js` line 4:
```javascript
const TWO_FACTOR_SECRET = 'YOUR-NEW-SECRET-KEY';
```
Generate new key at: https://stefansundin.github.io/2fa-qr/

## 🛡️ Important Security Notes

### ⚠️ BEFORE GOING LIVE:

1. **Change admin URL** - Rename the admin file
2. **Change password** - Use very strong password
3. **Setup real 2FA** - Use your own secret key
4. **Keep backup codes safe** - Save in password manager
5. **Use HTTPS** - Install SSL certificate
6. **Don't share admin URL** - Keep it secret!

### Backup Codes
- **10 codes generated** automatically
- Each code works **only once**
- Save codes in safe place
- Regenerate if all used

## 📱 Mobile Responsive

Website works perfectly on:
- ✅ Desktop computers
- ✅ Tablets
- ✅ Mobile phones
- ✅ All modern browsers

## 🔧 Troubleshooting

### Can't Login to Admin?
- Check password is correct (case-sensitive)
- Use 2FA code `123456` for demo
- Clear browser cache
- Check if IP is blocked (wait 24 hours)

### Results Not Showing?
- Check browser's localStorage is enabled
- Try different browser
- Open browser console for errors

### New Day Not Creating?
- System checks every minute
- Uses IST timezone (India)
- Manual trigger: Console > `createNewDay()`

### IP Blocked Message?
- Wait 24 hours
- Or clear localStorage (loses data)
- Or use different device/network

## 📄 SEO Keywords

This website is optimized for:
- kolkata ff
- kolkata fatafat
- kolkata ff result
- kolkata fatafat result
- kolkata ff tips
- kolkata fatafat ghosh babu
- ff kolkata
- fatafat result
- কলকাতা ফাটাফাট

## 🌐 Pages Included

1. **Home** - Result tables with auto-update
2. **News** - India news and updates
3. **Mall Info** - Shopping mall information
4. **About Us** - About the website
5. **Contact Us** - Contact form
6. **Privacy Policy** - Complete privacy policy
7. **Admin Panel** - Hidden admin access

## ⚖️ Legal Disclaimer

**IMPORTANT:** This website is for **informational purposes only**. Use only for legal and legitimate news/information services. Comply with all local laws and regulations.

## 📞 Support

Email: **nbpshelterinfo@gmail.com**

Include:
- Your domain name
- Browser and device info
- Screenshot of issue
- Steps to reproduce

## 🚀 Deployment

### Alibaba Cloud
1. Upload to OSS
2. Enable static hosting
3. Access via OSS URL

### cPanel
1. Login to cPanel
2. File Manager > public_html
3. Upload all files
4. Access via domain

### GitHub Pages
1. Create repository
2. Upload files
3. Enable Pages in Settings

## 🔄 Data Storage

All data stored in **browser's localStorage**:
- Results for all dates
- Admin session
- Login attempts
- IP blocks
- AdSense code
- Analytics ID

**Note:** Data is client-side only. For production, consider backend database.

## 📊 Features Summary

| Feature | Status |
|---------|--------|
| Auto table at midnight | ✅ |
| 8 rounds per day | ✅ |
| Old results archive | ✅ |
| Hidden admin URL | ✅ |
| Password protection | ✅ |
| 2FA with Google Auth | ✅ |
| Backup codes | ✅ |
| IP blocking (5 attempts) | ✅ |
| 24-hour block duration | ✅ |
| Session timeout | ✅ |
| AdSense integration | ✅ |
| Analytics integration | ✅ |
| SEO optimized | ✅ |
| Mobile responsive | ✅ |
| News category | ✅ |
| Mall category | ✅ |

## 🎉 Quick Reference

**Homepage:** `index.html`  
**Admin Panel:** `uyetr-36ejdne-ye.html` ⚠️ SECRET  
**Password:** `m7(__.tbo}'al(V%nkBPr'8h5}wvo1f4,%1v~1}1m&MJz~wzz)`  
**2FA Demo Code:** `123456`  
**2FA Secret:** `JBSWY3DPEHPK3PXP`  

---

**Version:** 2.0  
**Last Updated:** October 27, 2025  
**Timezone:** IST (UTC+5:30)

**🎊 Your Kolkata FF website is ready to use! 🎊**
