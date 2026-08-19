# Tommaso Cristoni — Portfolio Site

Static site (plain HTML/CSS/JS, no build step) for GitHub Pages.

## Before you deploy

1. **Add your real photo.** Drop a photo into `assets/img/profile.jpg` (replacing the placeholder text — the site already points to that file; it'll appear automatically). Recommended: portrait orientation, at least 640x800px.
2. The CV PDF is already included at `assets/cv/Tommaso_Cristoni_CV.pdf`. Replace this file (keep the same name) whenever you update your CV.
3. Open `index.html` and double check the TikTok video IDs / links and stats are still accurate if you post new viral content later — the four featured videos are hard-coded in the "Featured content" section.

## Deploy to GitHub Pages (username: plugman7000)

### Option A — GitHub website (no terminal needed)

1. Go to https://github.com/new, sign in as **plugman7000**.
2. Repository name: `portfolio` (or anything — e.g. `tommaso-cristoni`). Keep it **Public**. Don't initialize with a README (we already have one).
3. Click **Create repository**.
4. On the new repo page, click **uploading an existing file**.
5. Drag in *all* the contents of this `site` folder (index.html, css/, js/, assets/, README.md) — keep the folder structure intact.
6. Commit the upload.
7. Go to **Settings → Pages** (left sidebar).
8. Under "Build and deployment", set **Source: Deploy from a branch**, **Branch: main**, folder **/ (root)**. Save.
9. Wait ~1 minute, then your site is live at:
   `https://plugman7000.github.io/portfolio/` (or whatever repo name you chose).

### Option B — Git command line

```bash
cd site
git init
git add .
git commit -m "Initial portfolio site"
git branch -M main
git remote add origin https://github.com/plugman7000/portfolio.git
git push -u origin main
```

Then enable Pages the same way as steps 7–8 above.

## Updating the site later

Edit the files locally, then either re-upload via the GitHub website, or:

```bash
git add .
git commit -m "Update site"
git push
```

GitHub Pages redeploys automatically within a minute or two of each push.
