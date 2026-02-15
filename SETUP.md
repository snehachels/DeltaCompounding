# Habit Tracker PWA - Setup Guide

A minimalist habit tracker that works offline on your iPhone. No App Store, no fees, no subscriptions.

## Quick Start (5 minutes)

### Option 1: Free Hosting with GitHub Pages

1. **Create a GitHub account** (if you don't have one)
   - Go to [github.com](https://github.com) and sign up (free)

2. **Create a new repository**
   - Click the "+" icon → "New repository"
   - Name it: `habit-tracker`
   - Make it **Public**
   - Click "Create repository"

3. **Upload the PWA files**
   - Click "uploading an existing file"
   - Drag the entire contents of the `pwa` folder into the upload area
   - Click "Commit changes"

4. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Under "Source", select "Deploy from a branch"
   - Select "main" branch and "/ (root)" folder
   - Click Save
   - Wait 1-2 minutes for deployment

5. **Get your URL**
   - Your app will be live at: `https://YOUR-USERNAME.github.io/habit-tracker/`

### Option 2: Free Hosting with Netlify

1. Go to [netlify.com](https://netlify.com) and sign up (free)
2. Click "Add new site" → "Deploy manually"
3. Drag the `pwa` folder into the upload area
4. Your app will be live at a random URL like `https://random-name.netlify.app`
5. You can customize the URL in site settings

### Option 3: Local Testing

1. Open Terminal
2. Navigate to the pwa folder:
   ```bash
   cd /Users/snehachelimilla/Desktop/Building/Habit_Tracker/pwa
   ```
3. Start a local server:
   ```bash
   python3 -m http.server 8000
   ```
4. Open Safari on your iPhone
5. Go to: `http://YOUR-COMPUTER-IP:8000`
   (Find your IP in System Settings → Wi-Fi → Details)

---

## Installing on Your iPhone

Once the app is hosted (GitHub Pages, Netlify, or local):

1. **Open Safari** on your iPhone (must be Safari, not Chrome)
2. **Go to your app URL**
3. **Tap the Share button** (square with arrow)
4. **Scroll down and tap "Add to Home Screen"**
5. **Name it** "Habits" (or whatever you prefer)
6. **Tap "Add"**

The app now appears on your home screen like a native app!

---

## Features

### Today Tab
- Quick daily check-in
- Tap to mark habits complete
- Completed habits move to bottom
- Shows "All completed" when done

### Habits Tab
- Add, edit, archive, delete habits
- Reorder by drag (coming soon)
- Archive preserves history

### History Tab
- Visual grid of completion
- 7/30/90 day views
- Green = completed, gray = missed

### Insights Tab
- Overall completion percentage
- Per-habit breakdown
- Most/least consistent habits

---

## Data Storage

- All data is stored **locally on your device**
- Data persists even when offline
- No account needed
- No cloud sync (your data stays private)

To clear all data:
1. Settings → Safari → Clear History and Website Data
2. Or delete the app from home screen and re-add

---

## Troubleshooting

### "Add to Home Screen" not showing?
- Make sure you're using Safari (not Chrome or other browsers)
- Make sure the site is served over HTTPS (GitHub Pages and Netlify do this automatically)

### App not working offline?
- Open the app while online at least once
- This allows the service worker to cache all files
- After that, it works completely offline

### Data disappeared?
- Data is stored in the browser's IndexedDB
- Clearing Safari data will erase it
- This is normal for PWAs

### Icons not showing on home screen?
- The app uses an SVG icon
- If it doesn't show, the app will use a screenshot instead
- This doesn't affect functionality

---

## File Structure

```
pwa/
├── index.html          # Main HTML file
├── manifest.json       # PWA configuration
├── service-worker.js   # Offline support
├── css/
│   └── styles.css      # All styling
├── js/
│   ├── db.js           # Database (IndexedDB)
│   ├── app.js          # Main app logic
│   ├── habits.js       # Habits tab
│   ├── today.js        # Today tab
│   ├── history.js      # History tab
│   └── insights.js     # Insights tab
└── icons/
    └── icon.svg        # App icon
```

---

## Customization

### Change the accent color
Edit `pwa/css/styles.css`, find `:root` and change:
```css
--color-primary-accent: #3B82F6;  /* Change this */
--color-success: #10B981;          /* And this */
```

### Change the app name
Edit `pwa/manifest.json`:
```json
"name": "Your App Name",
"short_name": "AppName"
```

---

## Need Help?

The app is self-contained and doesn't require any server or backend. If something isn't working:

1. Make sure you uploaded ALL files in the `pwa` folder
2. Make sure the files are in the root of your repository (not inside another folder)
3. Wait a few minutes for GitHub Pages to deploy
4. Try clearing Safari cache and re-adding to home screen

Enjoy your new habit tracker! 🎯
