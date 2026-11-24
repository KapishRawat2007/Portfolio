# 📋 Kapish Rawat — Portfolio Action Checklist (TODO.md)

This document tracks all the placeholders in your portfolio that you should replace with your real information, links, and assets as you progress through your BCA journey.

---

## 👤 1. Profile Information (`data/profile.json`)

- [ ] **Email Address**: Replace `"YOUR_EMAIL"` with your real contact email (e.g., `"kapish@example.com"`).
- [ ] **GitHub Profile**: Replace `"YOUR_GITHUB_URL"` with your actual GitHub profile link (e.g., `"https://github.com/kapishrawat"`).
- [ ] **LinkedIn Profile**: Replace `"YOUR_LINKEDIN_URL"` with your LinkedIn profile link.
- [ ] **Instagram Profile**: Replace `"YOUR_INSTAGRAM_URL"` with your Instagram handle or profile URL (or leave empty if you prefer not to display it).
- [ ] **X / Twitter Profile**: Replace `"YOUR_X_URL"` with your X/Twitter profile link (or leave empty).
- [ ] **High School Details**: In the `education` array, replace `"[Your School / College Name]"` and `"[Passing Year, e.g., 2024]"` with your actual 12th-grade institution and year.

> **Note:** If any social link remains as `"YOUR_..."` or empty, the website automatically disables the icon and shows a friendly *"Coming soon"* tooltip.

---

## 🖼️ 2. Images & Assets (`assets/`)

- [ ] **Profile Photograph**:
  - Replace `assets/images/profile.webp` with your real photo.
  - Recommended dimensions: **400 × 400 pixels** (square ratio).
  - Format: WebP or PNG. If you use a `.jpg` or `.png`, update the filename in `data/profile.json`.
- [ ] **Resume PDF**:
  - Replace `assets/resume.pdf` with your real, updated resume or CV.
  - The "Download Resume" button in the Hero section is already configured to download this file.

---

## 💻 3. Real Projects (`data/projects.json`)

Replace the placeholder projects with your actual repositories as you create them:

- [ ] **Project 1 (Python)**:
  - Title, description, and your GitHub repo link.
- [ ] **Project 2 (Web Development)**:
  - Title, description, GitHub repo link, and live URL (e.g., GitHub Pages or Vercel preview).
- [ ] **Project 3 (Unity Game Prototype)**:
  - Title, gameplay summary, GitHub repo or itch.io play link.
- [ ] **Project 4 (C / C++ Programs)**:
  - Title, description of algorithms or data structures, and repo link.

---

## 🏆 4. Community & Achievements (`index.html`)

- [ ] **Timeline & Milestones**:
  - Under the **Community & Involvement** section (`#community`), update the placeholder milestone `[First Campus Hackathon & Technical Workshop]` whenever you attend an IEEE event, GitHub Club meetup, or hackathon.

---

## ✉️ 5. Contact Form & Email Setup (`.env`)

The contact form works in two modes:

### Mode A: Automatic Fallback (No Server Needed / GitHub Pages)
- If hosted statically on GitHub Pages, the form automatically opens the visitor's email client (`mailto:`) with the message pre-filled. No setup required!

### Mode B: Flask Server with SMTP Email Delivery
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your Gmail App Password credentials:
   ```env
   MAIL_SERVER=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USE_TLS=True
   MAIL_USERNAME=your_real_email@gmail.com
   MAIL_PASSWORD=your_gmail_app_password
   MAIL_RECEIVER=your_real_email@gmail.com
   ```
3. Test locally with:
   ```bash
   python app.py
   ```
   Submit the form to verify receipt.

---

## 🚀 6. Publishing / Deployment

- [ ] **GitHub Pages (Static)**:
  1. Initialize git in this folder: `git init`
  2. Commit files: `git add . && git commit -m "Initial portfolio commit"`
  3. Create a GitHub repo named `portfolio` (or `YOUR_USERNAME.github.io`).
  4. Push your code:
     ```bash
     git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
     git branch -M main
     git push -u origin main
     ```
  5. Go to repository **Settings > Pages > Deploy from a branch (main / root)**.
- [ ] **Python Host (Render / Railway / PythonAnywhere)**:
  - Use `gunicorn app:app` for production WSGI server.

