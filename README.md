# 🚀 Kapish Rawat — Portfolio

A modern, animated, and fully responsive personal portfolio built with **HTML, CSS, JavaScript**, and an optional **Python (Flask)** backend for the contact form.

> BCA 1st Year · Swami Rama Himalayan University · IEEE Member · GitHub Club Member

---

## ✨ Features

- Dark futuristic theme with a light-mode toggle
- Animated preloader, particle background, and typing effect
- Scroll-triggered animations (GSAP ScrollTrigger)
- 3D tilt cards, magnetic buttons, and a glowing custom cursor
- Skills, projects (with category filter), community, and education sections
- Contact form with validation (Flask backend, `mailto:` fallback)
- Fully responsive and accessible
- SEO-optimized with Open Graph tags

## 🛠️ Tech Stack

| Area | Tools |
|---|---|
| Frontend | HTML5, CSS3, JavaScript (ES6+) |
| Animations | GSAP, ScrollTrigger, tsParticles, Typed.js, Vanilla-Tilt, AOS |
| Backend (optional) | Python 3.10+, Flask |
| Tools | Git, GitHub |

## 📁 Project Structure

```
portfolio/
├── index.html
├── css/
│   ├── style.css
│   ├── animations.css
│   └── responsive.css
├── js/
│   ├── main.js
│   ├── nav.js
│   ├── hero.js
│   ├── animations.js
│   ├── theme.js
│   └── contact.js
├── data/
│   ├── profile.json
│   └── projects.json
├── assets/
│   ├── images/
│   ├── icons/
│   └── resume.pdf
├── app.py                # Flask server (contact form)
├── requirements.txt
├── .env.example
├── agent.md
├── prd.md
├── TODO.md
└── README.md
```

## ⚙️ Getting Started

### Option 1: Static only (simplest)
Just open `index.html` in your browser, or use the VS Code **Live Server** extension.

### Option 2: With Flask backend
```bash
# 1. Clone
git clone https://github.com/KapishRawat2007/portfolio.git
cd portfolio

# 2. Create a virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
source venv/bin/activate       # macOS / Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set up environment variables
cp .env.example .env           # then edit the values

# 5. Run
python app.py
```
Open **http://127.0.0.1:5000** in your browser.

## 🔐 Environment Variables

Create a `.env` file (never commit it):

```
SECRET_KEY=change_this_to_a_random_string
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_RECEIVER=rawatkapish942@gmail.com
```

## ✏️ Customize

1. Edit `data/projects.json` to add your projects.
2. Replace `assets/resume.pdf` with your real resume.
3. Tweak colors in the `:root` block of `css/style.css` if desired.

## 🚢 Deployment

- **GitHub Pages:** push the static files and enable Pages in repo settings. The form falls back to `mailto:`.
- **Render / Railway / PythonAnywhere:** deploy the Flask app with `gunicorn app:app`.

## 📊 Quality Targets

Lighthouse: Performance ≥ 90 · Accessibility ≥ 95 · Best Practices ≥ 95 · SEO ≥ 95

## 🤝 Connect With Me

- GitHub: [https://github.com/KapishRawat2007](https://github.com/KapishRawat2007)
- LinkedIn: [https://www.linkedin.com/in/kapishrawat](https://www.linkedin.com/in/kapishrawat)
- Instagram: [https://www.instagram.com/kapish_rawat_2007](https://www.instagram.com/kapish_rawat_2007)
- X / Twitter: [https://x.com/kapishrawat2007](https://x.com/kapishrawat2007)
- Email: [rawatkapish942@gmail.com](mailto:rawatkapish942@gmail.com)

## 📄 License

MIT License. Free to use and learn from. Please give credit if you fork it.

---

Made with ❤️ by **Kapish Rawat**

