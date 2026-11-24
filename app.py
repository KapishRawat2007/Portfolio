"""
app.py — Flask Backend Server for Kapish Rawat's Portfolio Website

Features:
- Serves the frontend static files (HTML, CSS, JS, Assets, Data)
- POST /api/contact: Validates contact form submission, sanitizes input,
  enforces rate-limiting, and sends an email via Flask-Mail (if configured)
  or logs locally to console/file.
- GET /api/health: Health check endpoint.
"""

import os
import re
import html
import logging
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("portfolio-backend")

# Optional dotenv loading
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    logger.info("python-dotenv not installed, using system environment variables.")

# Optional Flask-CORS
try:
    from flask_cors import CORS
    HAS_CORS = True
except ImportError:
    HAS_CORS = False
    logger.info("flask-cors not installed, running without CORS headers.")

# Optional Flask-Limiter
try:
    from flask_limiter import Limiter
    from flask_limiter.util import get_remote_address
    HAS_LIMITER = True
except ImportError:
    HAS_LIMITER = False
    logger.info("flask-limiter not installed, running without rate limiting.")

# Optional Flask-Mail
try:
    from flask_mail import Mail, Message
    HAS_MAIL = True
except ImportError:
    HAS_MAIL = False
    logger.info("flask-mail not installed, contact messages will be logged locally.")

# Optional email-validator
try:
    from email_validator import validate_email, EmailNotValidError
    HAS_EMAIL_VALIDATOR = True
except ImportError:
    HAS_EMAIL_VALIDATOR = False

# Initialize Flask application
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__, static_folder=BASE_DIR, static_url_path="")
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret-key-kapish-portfolio")

# Setup CORS
if HAS_CORS:
    CORS(app, resources={r"/api/*": {"origins": "*"}})

# Setup Rate Limiter (e.g. 5 requests per minute on contact form)
limiter = None
if HAS_LIMITER:
    try:
        limiter = Limiter(
            key_func=get_remote_address,
            app=app,
            default_limits=["200 per day", "50 per hour"],
            storage_uri="memory://"
        )
    except Exception as e:
        logger.warning(f"Could not initialize Limiter: {e}")
        limiter = None

# Setup Mail Configuration
app.config["MAIL_SERVER"] = os.getenv("MAIL_SERVER", "smtp.gmail.com")
app.config["MAIL_PORT"] = int(os.getenv("MAIL_PORT", 587))
app.config["MAIL_USE_TLS"] = os.getenv("MAIL_USE_TLS", "True").lower() in ("true", "1", "yes")
app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME", "")
app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD", "")
app.config["MAIL_DEFAULT_SENDER"] = os.getenv("MAIL_USERNAME", "no-reply@kapishrawat.dev")

mail = None
if HAS_MAIL and app.config["MAIL_USERNAME"] and app.config["MAIL_PASSWORD"]:
    try:
        mail = Mail(app)
        logger.info("Flask-Mail initialized successfully.")
    except Exception as e:
        logger.warning(f"Failed to initialize Flask-Mail: {e}")
else:
    logger.info("Mail credentials not configured. Messages will be recorded in local logs.")


# --------------------------------------------------------------------------
# Frontend Static Routes
# --------------------------------------------------------------------------
@app.route("/")
def serve_index():
    """Serves the main portfolio HTML page."""
    return send_from_directory(BASE_DIR, "index.html")


@app.route("/<path:path>")
def serve_static(path):
    """Serves CSS, JS, assets, data, and metadata files."""
    if os.path.exists(os.path.join(BASE_DIR, path)):
        return send_from_directory(BASE_DIR, path)
    return send_from_directory(BASE_DIR, "index.html")


# --------------------------------------------------------------------------
# API Endpoints
# --------------------------------------------------------------------------
@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint for monitoring."""
    return jsonify({
        "status": "healthy",
        "service": "Kapish Rawat Portfolio API",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }), 200


def validate_contact_data(name, email_address, message):
    """Validates contact form fields and returns (is_valid, error_message)."""
    if not name or not isinstance(name, str):
        return False, "Name is required."
    name_clean = name.strip()
    if len(name_clean) < 2 or len(name_clean) > 80:
        return False, "Name must be between 2 and 80 characters."

    if not email_address or not isinstance(email_address, str):
        return False, "Email address is required."
    email_clean = email_address.strip()
    
    if HAS_EMAIL_VALIDATOR:
        try:
            validate_email(email_clean, check_deliverability=False)
        except EmailNotValidError as e:
            return False, f"Invalid email format: {str(e)}"
    else:
        # Fallback regex
        email_pattern = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"
        if not re.match(email_pattern, email_clean):
            return False, "Please provide a valid email address."

    if not message or not isinstance(message, str):
        return False, "Message is required."
    msg_clean = message.strip()
    if len(msg_clean) < 10 or len(msg_clean) > 3000:
        return False, "Message must be between 10 and 3000 characters."

    return True, None


@app.route("/api/contact", methods=["POST"])
def contact():
    """
    Handles contact form submissions.
    Expects JSON: { "name": "...", "email": "...", "message": "..." }
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid request body. Expected JSON."}), 400

    name = data.get("name")
    sender_email = data.get("email")
    message = data.get("message")

    is_valid, error_msg = validate_contact_data(name, sender_email, message)
    if not is_valid:
        return jsonify({"error": error_msg}), 400

    # Sanitize inputs against HTML injection
    safe_name = html.escape(name.strip())
    safe_email = html.escape(sender_email.strip())
    safe_message = html.escape(message.strip())

    logger.info(f"Received contact form message from: {safe_name} <{safe_email}>")

    # Send email if configured
    recipient = os.getenv("MAIL_RECEIVER", os.getenv("MAIL_USERNAME"))
    mail_sent = False

    if mail and recipient:
        try:
            msg = Message(
                subject=f"Portfolio Message from {safe_name}",
                recipients=[recipient],
                reply_to=safe_email,
                body=f"Name: {safe_name}\nEmail: {safe_email}\n\nMessage:\n{safe_message}\n\nSent at: {datetime.utcnow()}"
            )
            mail.send(msg)
            mail_sent = True
            logger.info(f"Email successfully delivered to {recipient}")
        except Exception as e:
            logger.error(f"Failed to send email via SMTP: {e}")

    # If mail wasn't configured or failed, record message locally in a contact log
    if not mail_sent:
        log_entry = (
            f"[{datetime.utcnow().isoformat()}] FROM: {safe_name} ({safe_email})\n"
            f"MESSAGE: {safe_message}\n"
            f"{'-' * 60}\n"
        )
        try:
            log_file_path = os.path.join(BASE_DIR, "contact_submissions.log")
            with open(log_file_path, "a", encoding="utf-8") as f:
                f.write(log_entry)
            logger.info("Message saved to contact_submissions.log")
        except Exception as e:
            logger.warning(f"Could not append to contact_submissions.log: {e}")

    return jsonify({
        "success": True,
        "message": f"Thank you, {safe_name}! Your message has been received.",
        "mail_sent": mail_sent
    }), 200


# Error Handlers
@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify({"error": "Too many requests. Please wait a moment before trying again."}), 429


@app.errorhandler(404)
def not_found_handler(e):
    return jsonify({"error": "Resource not found."}), 404


@app.errorhandler(500)
def server_error_handler(e):
    return jsonify({"error": "Internal server error. Please try again later."}), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_ENV", "development").lower() == "development"
    print(f"\n=======================================================")
    print(f"  Kapish Rawat - Personal Portfolio Website Server")
    print(f"  Running at: http://127.0.0.1:{port}")
    print(f"=======================================================\n")
    app.run(host="0.0.0.0", port=port, debug=debug)

