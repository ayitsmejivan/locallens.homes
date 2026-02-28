"""
LocalLens.Homes – Contact Form Handler
Flask application to process enquiry submissions and send emails.
"""

import os
import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, origins=os.environ.get('ALLOWED_ORIGINS', '*'))

logging.basicConfig(
    filename='submissions.log',
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(message)s'
)


def send_emails(name, email, phone, message, travel_date='', trip=''):
    """Send notification to site owner and confirmation to enquirer."""
    host = os.environ.get('EMAIL_HOST', 'smtp.gmail.com')
    port = int(os.environ.get('EMAIL_PORT', 587))
    user = os.environ.get('EMAIL_USER', '')
    password = os.environ.get('EMAIL_PASSWORD', '')
    recipient = os.environ.get('RECIPIENT_EMAIL', user)

    if not user or not password:
        logging.warning('Email credentials not configured – skipping email send.')
        return False

    timestamp = datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')

    # Notification to site owner
    owner_body = (
        f"New enquiry from your website:\n\n"
        f"Name:         {name}\n"
        f"Email:        {email}\n"
        f"Phone:        {phone or 'Not provided'}\n"
        f"Travel Date:  {travel_date or 'Not provided'}\n"
        f"Tour:         {trip or 'Not provided'}\n\n"
        f"Message:\n{message}\n\n"
        f"Submitted: {timestamp}"
    )
    owner_msg = MIMEMultipart('alternative')
    owner_msg['Subject'] = f'New Enquiry from {name}'
    owner_msg['From'] = user
    owner_msg['To'] = recipient
    owner_msg.attach(MIMEText(owner_body, 'plain'))

    # Confirmation to enquirer
    confirm_body = (
        f"Hi {name},\n\n"
        f"Thanks for getting in touch! I've received your message and will "
        f"get back to you within a few hours.\n\n"
        f"If it's urgent, call or WhatsApp me directly at +977 9828768566.\n\n"
        f"– Jivan Parajuli\n"
        f"The Fixer Nepal\n"
        f"https://locallens.homes"
    )
    confirm_msg = MIMEMultipart('alternative')
    confirm_msg['Subject'] = 'Thanks for reaching out – Jivan Parajuli'
    confirm_msg['From'] = user
    confirm_msg['To'] = email
    confirm_msg.attach(MIMEText(confirm_body, 'plain'))

    try:
        with smtplib.SMTP(host, port) as server:
            server.ehlo()
            server.starttls()
            server.login(user, password)
            server.sendmail(user, recipient, owner_msg.as_string())
            server.sendmail(user, email, confirm_msg.as_string())
        return True
    except Exception as exc:
        logging.error('Email send error: %s', exc)
        return False


@app.route('/submit', methods=['POST'])
def submit():
    """Handle contact form submissions."""
    if request.is_json:
        data = request.get_json(silent=True) or {}
    else:
        data = request.form

    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip()
    phone = (data.get('phone') or '').strip()
    message = (data.get('message') or '').strip()
    travel_date = (data.get('travel_date') or '').strip()
    trip = (data.get('trip') or '').strip()

    # Server-side validation
    errors = {}
    if not name:
        errors['name'] = 'Name is required.'
    parts = email.split('@')
    domain = parts[1] if len(parts) == 2 else ''
    if (not email or len(parts) != 2 or not parts[0]
            or '.' not in domain or domain.startswith('.') or domain.endswith('.')
            or '..' in domain):
        errors['email'] = 'A valid email address is required.'
    if not message:
        errors['message'] = 'Message is required.'

    if errors:
        return jsonify({'ok': False, 'errors': errors}), 400

    logging.info('Submission: %s <%s> – %s', name, email, message[:80])

    email_sent = send_emails(name, email, phone, message, travel_date, trip)

    return jsonify({
        'ok': True,
        'email_sent': email_sent,
        'message': "Message received! I'll be in touch within a few hours."
    })


@app.route('/health', methods=['GET'])
def health():
    """Simple health check endpoint."""
    return jsonify({'status': 'ok'})


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    if debug:
        import warnings
        warnings.warn('FLASK_DEBUG=true – do not use in production.', RuntimeWarning)
    app.run(host='0.0.0.0', port=port, debug=debug)
