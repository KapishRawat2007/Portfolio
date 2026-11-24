# PRD — Kapish Rawat Portfolio Website

**Version:** 1.0
**Owner:** Kapish Rawat
**Status:** Ready for development

---

## 1. Overview

A single-page, animated, professional portfolio website for Kapish Rawat, a BCA 1st-year student at Swami Rama Himalayan University. The site showcases his skills, projects, and community involvement (IEEE and GitHub Club), and gives visitors an easy way to contact him.

## 2. Goals

1. Create a strong first impression with a modern, animated design.
2. Present skills and projects clearly and honestly.
3. Build a personal brand for internships, hackathons, and collaborations.
4. Serve as a live project that demonstrates front-end ability.
5. Be easy for a beginner to maintain and extend.

## 3. Target Audience

- Recruiters and internship hiring managers
- Professors and university mentors
- Hackathon and club organizers
- Fellow developers and potential collaborators

## 4. Success Metrics

| Metric | Target |
|---|---|
| Lighthouse Performance | ≥ 90 |
| Lighthouse Accessibility | ≥ 95 |
| First Contentful Paint | < 1.5 s |
| Works on mobile, tablet, desktop | 100% |
| Contact form delivers a message | Yes |
| Zero console errors | Yes |

## 5. Scope

### In Scope
- Single-page portfolio with 9 sections
- Dark and light themes
- Animations and interactive effects
- Contact form (Flask backend, optional)
- SEO and social-share meta tags
- Deployment to GitHub Pages (static) or any Flask-friendly host

### Out of Scope (v1)
- Blog or CMS
- User login
- Database
- Multi-language support

## 6. Sections and Functional Requirements

### 6.1 Preloader
- Animated initials "KR" with a progress fill, fading out within 2 seconds.

### 6.2 Navbar
- Sticky, glass-blur background, logo, links: Home, About, Skills, Projects, Community, Education, Contact.
- Active-link highlighting on scroll, hamburger menu on mobile, theme toggle button.
- Scroll progress bar at the top.

### 6.3 Hero
- Heading: "Hi, I'm **Kapish Rawat**".
- Typed.js rotating roles: BCA Student · Python Developer · Game Dev Enthusiast · IEEE Member · GitHub Club Member.
- Short tagline.
- Two CTAs: **View Projects** and **Download Resume** (placeholder PDF path).
- Social icon row (from `profile.json`).
- Particle background and a floating code-card or avatar with a tilt effect.

### 6.4 About
- Short bio (3–4 sentences), a profile photo placeholder, and animated counters (Languages known, Projects, Communities, Years learning).

### 6.5 Skills
Grouped cards with animated progress or radial indicators.

| Group | Items |
|---|---|
| Languages | Python, C, C++ |
| Web | HTML, CSS |
| Game Dev | Unity |
| Database | MySQL |
| Tools | Git, GitHub |

Skill levels must be honest (beginner / intermediate), shown as labels rather than inflated percentages.

### 6.6 Projects
- Responsive grid of project cards with 3D tilt, tech-stack tags, and "Live" and "GitHub" buttons.
- Category filter: All, Web, Python, C/C++, Unity.
- Pull data from `/data/projects.json`. Ship with 3–4 clearly marked placeholder projects.

### 6.7 Community and Achievements
- Cards for **IEEE Member** and **GitHub Club Member** at Swami Rama Himalayan University.
- Timeline layout for events, workshops, and hackathons (placeholders).

### 6.8 Education
- Vertical animated timeline: BCA (1st Year), Swami Rama Himalayan University, plus a placeholder for schooling.

### 6.9 Contact
- Form fields: Name, Email, Message, with validation and a success/error toast.
- Direct links: Email, GitHub, LinkedIn, Instagram, X/Twitter (all from `profile.json`).
- Backend: `POST /api/contact` (Flask), with a `mailto:` fallback when no backend is available.

### 6.10 Footer
- Copyright, quick links, social icons, back-to-top button.

## 7. Design Requirements

- **Theme:** Dark futuristic (default) with a light mode.
- **Colors:** Background `#0a0b14`, Surface `#12142a`, Primary `#7c5cff`, Accent `#00e5ff`, Text `#e8eaf6`, Muted `#8a8fb0`.
- **Fonts:** Poppins (headings), Inter (body), JetBrains Mono (accents).
- **Components:** Glassmorphism cards, gradient text for the name, glowing hover borders.
- **Responsive:** Mobile-first; tested at 360px, 768px, 1024px, 1440px.

## 8. Animation and Effects Requirements

| Effect | Tool |
|---|---|
| Preloader | CSS + GSAP |
| Particle background | tsParticles |
| Role typing | Typed.js |
| Scroll reveals | GSAP ScrollTrigger / AOS |
| Card tilt | Vanilla-Tilt |
| Custom glowing cursor | Vanilla JS |
| Magnetic buttons | Vanilla JS |
| Counters | Vanilla JS + IntersectionObserver |
| Scroll progress bar | Vanilla JS |

All motion must respect `prefers-reduced-motion`.

## 9. Non-Functional Requirements

- **Performance:** Total page weight under 2 MB, images lazy-loaded and in WebP.
- **Accessibility:** WCAG 2.1 AA, keyboard navigable, ARIA labels on icon-only buttons.
- **SEO:** Title, meta description, Open Graph and Twitter cards, `sitemap.xml`, `robots.txt`, JSON-LD `Person` schema.
- **Browser support:** Latest Chrome, Edge, Firefox, Safari.
- **Security:** Sanitize form input, rate-limit the contact endpoint, store secrets in `.env`.

## 10. Data Model (JSON)

`/data/profile.json`
```json
{
  "name": "Kapish Rawat",
  "tagline": "BCA student building things with code.",
  "email": "YOUR_EMAIL",
  "resume": "assets/resume.pdf",
  "socials": {
    "github": "YOUR_GITHUB_URL",
    "linkedin": "YOUR_LINKEDIN_URL",
    "instagram": "YOUR_INSTAGRAM_URL",
    "twitter": "YOUR_X_URL"
  }
}
```

`/data/projects.json`
```json
[
  {
    "title": "[Project Title]",
    "description": "[One-line description]",
    "tags": ["Python"],
    "category": "Python",
    "github": "",
    "live": ""
  }
]
```

## 11. Milestones

| # | Milestone | Deliverable |
|---|---|---|
| 1 | Setup | File structure, base HTML, CSS variables |
| 2 | Layout | All sections, navbar, footer, responsive |
| 3 | Animations | Preloader, particles, GSAP, tilt, cursor |
| 4 | Content | Projects and profile JSON, community, education |
| 5 | Backend | Flask contact endpoint, validation |
| 6 | Polish | SEO, accessibility, Lighthouse tuning |
| 7 | Deploy | GitHub Pages / hosting, final QA |

## 12. Acceptance Criteria

- All 9 sections render and animate correctly on mobile and desktop.
- Theme toggle works and persists after refresh.
- Contact form validates and shows feedback.
- No fabricated achievements. All placeholders are clearly marked.
- Lighthouse scores meet the targets in Section 4.
- Zero console errors and no broken links.

## 13. Risks

| Risk | Mitigation |
|---|---|
| Too many animations hurt performance | Lazy-init effects, respect reduced motion |
| Missing real content | Placeholders plus a `TODO.md` checklist |
| Backend hosting cost | Static fallback with `mailto:` or a form service |

