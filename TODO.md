# 📋 Kapish Rawat — Portfolio Action Checklist (TODO.md)

This document tracks the few remaining items in your portfolio that you can update whenever you're ready: your real resume and your coursework projects.

---

## ✅ Completed & Verified in This Release

- [x] **Profile Photograph**: `assets/images/profile.webp` and `assets/images/profile.jpg` generated with 4:5 portrait crop focused on face/upper body, soft-blob rounded corners, glowing gradient border, dark gradient edge overlay, and `og:image` (1200x630).
- [x] **Contact Email**: Configured `rawatkapish942@gmail.com` across `profile.json`, contact section, mailto fallback, copy-to-clipboard button with toast feedback, and schema.
- [x] **Social Profiles**: Linked Instagram, GitHub, LinkedIn, and X with secure `target="_blank" rel="noopener noreferrer"` attributes.
- [x] **Education Timeline**: Updated with 3 milestones:
  - Swami Rama Himalayan University, Jolly Grant (2026 - Present | BCA 1st Year)
  - Renaissance Dron School, Doiwala (2025 - 26 | Class XII | Stream: PCM | 81%)
  - Renaissance Dron School, Doiwala (2023 - 24 | Class X | 91%)
- [x] **Highlighted Milestone**: Added IEEE Xtreme 20.0 featured achievement card (Team Explorer, All India Rank 40, Global Rank 426) with animated counters.

---

## 📌 Items for You to Replace When Ready

### 📄 1. Resume PDF (`assets/`)
- [ ] **Resume / CV**:
  - Replace `assets/resume.pdf` with your real resume PDF.
  - The "Download Resume" button in the Hero section is already configured to download this file.

---

### 💻 2. Real Coursework & Personal Projects (`data/projects.json`)
As you build more repositories during your BCA journey, update `data/projects.json` with your real GitHub links:

- [ ] **Project 1 (Python / Automation)**:
  - Update title, description, and link to your GitHub repository.
- [ ] **Project 2 (Web Development)**:
  - Update title, description, GitHub repo, and live demo link.
- [ ] **Project 3 (Unity Game Prototype)**:
  - Update title, description, gameplay mechanics, and repo / itch.io link.
- [ ] **Project 4 (C / C++ Algorithms & Data Structures)**:
  - Update title, description, and repo link.

---

## ✉️ 3. Contact Form (Web3Forms Direct Delivery)

The contact form is already configured with your Web3Forms access key (`c3d4c5b9-85fc-481c-852f-45e9617a4498`) in `js/contact.js`.
- It sends messages directly to `rawatkapish942@gmail.com` without opening any email app and requires no backend server.
- If you ever generate a new Web3Forms access key, simply update `WEB3FORMS_ACCESS_KEY` at the top of `js/contact.js`.
- The optional Flask backend in `app.py` remains available if you ever choose to run a custom Python server.
