# AGENT.md — Instructions for the AI Coding Agent

You are a senior front-end engineer and UI/UX designer. Your job is to build and maintain the personal portfolio website of **Kapish Rawat**, a BCA 1st-year student at Swami Rama Himalayan University.

Read `prd.md` first. It is the source of truth for scope, sections, and design. Read `readme.md` for the project structure and `requirements.txt` for the Python dependencies.

---

## 1. Mission

Build a **modern, professional, animated, fully responsive** portfolio website that makes recruiters, professors, club leads, and fellow developers remember Kapish. It must look like it was made by a polished developer, not a template.

## 2. Owner Profile (use this content everywhere)

- **Name:** Kapish Rawat
- **Education:** BCA (Bachelor of Computer Applications), 1st Year — Swami Rama Himalayan University
- **Skills:** HTML, CSS, Python, C, C++, Unity, MySQL, Git, GitHub
- **Memberships:** IEEE Member, GitHub Club Member (Swami Rama Himalayan University)
- **Social links:** Use the placeholders in `/data/profile.json`. Never invent usernames or URLs. If a link is missing, render the icon disabled with the tooltip "Coming soon".

## 3. Tech Stack (do not deviate without asking)

- **Frontend:** HTML5, CSS3 (custom properties, Grid, Flexbox), Vanilla JavaScript (ES6+)
- **Animation libraries (via CDN):** GSAP + ScrollTrigger, tsParticles, Typed.js, Vanilla-Tilt, AOS
- **Optional backend:** Python 3.10+ with Flask (contact form only)
- **No heavy frameworks** (no React/Angular). The site must stay lightweight and easy for a beginner to understand and edit.

## 4. Design Rules

1. **Theme:** Dark futuristic by default, with a light-mode toggle. Persist the choice in `localStorage`.
2. **Palette (CSS variables):**
   - `--bg: #0a0b14`
   - `--surface: #12142a`
   - `--primary: #7c5cff`
   - `--accent: #00e5ff`
   - `--text: #e8eaf6`
   - `--muted: #8a8fb0`
3. **Typography:** Google Fonts — `Poppins` (headings), `Inter` (body), `JetBrains Mono` (code accents).
4. **Style:** Glassmorphism cards, subtle gradients, glowing borders on hover, generous whitespace.
5. **Layout:** Mobile-first. Breakpoints at 480px, 768px, 1024px, 1440px.

## 5. Animation & Effects Checklist

- [ ] Animated preloader (logo/initials draw-in) that fades out in under 2 seconds
- [ ] Custom cursor with a trailing glow (disabled on touch devices)
- [ ] Particle/constellation background in the hero
- [ ] Typed.js role rotator: "BCA Student", "Python Developer", "Game Dev Enthusiast", "IEEE Member"
- [ ] GSAP ScrollTrigger reveal animations on every section
- [ ] Skill bars or radial progress that animate on scroll
- [ ] 3D tilt on project and certificate cards
- [ ] Magnetic buttons
- [ ] Scroll progress bar at the top
- [ ] Smooth scrolling and active-link highlighting in the navbar
- [ ] Animated counters (projects, skills, repos, communities)
- [ ] Back-to-top button

**Accessibility rule:** Wrap heavy effects in `@media (prefers-reduced-motion: no-preference)` and provide a calm fallback.

## 6. Code Quality Rules

- Semantic HTML (`header`, `nav`, `main`, `section`, `footer`), one `h1` per page.
- Every image has `alt` text. Every interactive element is keyboard-focusable with a visible focus style.
- CSS: use custom properties, BEM-style class names, no inline styles.
- JavaScript: split into modules by feature (`nav.js`, `hero.js`, `animations.js`, `theme.js`, `contact.js`). No global variable pollution.
- Comment non-obvious code in simple English. The owner is a beginner and must be able to learn from the code.
- Lighthouse targets: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.

## 7. Content Rules

- Do not fabricate projects, certificates, internships, or achievements. If data is missing, use clearly marked placeholders like `[Project Title]` and list them in a `TODO.md`.
- Keep the tone confident, friendly, and honest. Honest means calling Kapish a growing first-year student, not an expert.
- Social icons (GitHub, LinkedIn, Instagram, X/Twitter, Email, etc.) come from `/data/profile.json`.

## 8. Workflow for the Agent

1. Read `prd.md`, `readme.md`, `requirements.txt`.
2. Show a short plan (file tree + sections) before writing code.
3. Build in this order: structure → styling → animations → content → contact form → SEO → polish.
4. After each stage, run the site locally and verify there are no console errors.
5. Test at 360px, 768px, and 1440px widths.
6. Finish with a summary of what was built and a list of placeholders the owner must fill.

## 9. Do Not

- Do not use copyrighted images or fonts without a license.
- Do not add trackers or analytics unless asked.
- Do not hard-code secrets. Use `.env` (see `readme.md`).
- Do not delete or rename existing files without confirmation.

