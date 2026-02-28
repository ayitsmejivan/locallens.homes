# Python Contact Form Backend – Setup Guide

This Flask application handles contact form submissions from `contact.html`,
sends notification emails to the site owner, and sends confirmation emails to
enquirers.

---

## Prerequisites

- Python 3.9 or later
- pip

---

## Local Development

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
RECIPIENT_EMAIL=jivaneklo@gmail.com
ALLOWED_ORIGINS=http://localhost:8080
FLASK_DEBUG=true
```

> **Gmail users**: Enable 2-Step Verification and generate an
> [App Password](https://myaccount.google.com/apppasswords) to use as
> `EMAIL_PASSWORD`.

### 3. Run the server

```bash
python app.py
```

The server starts on `http://localhost:5000`.

### 4. Test the endpoint

```bash
curl -X POST http://localhost:5000/submit \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Hello!"}'
```

---

## Configuring the Contact Form

In `contact.html` the form's `action` attribute points to `/submit`.
When deploying, update it to your server's full URL, e.g.:

```html
<form action="https://your-flask-server.herokuapp.com/submit" ...>
```

---

## Deployment Options

### Heroku

1. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) and log in.

2. Create a `Procfile` in the repository root:

   ```
   web: python app.py
   ```

3. Create and deploy the app:

   ```bash
   heroku create your-app-name
   heroku config:set EMAIL_USER=your-email@gmail.com
   heroku config:set EMAIL_PASSWORD=your-app-password
   heroku config:set RECIPIENT_EMAIL=jivaneklo@gmail.com
   heroku config:set ALLOWED_ORIGINS=https://locallens.homes
   git push heroku main
   ```

4. Update the form `action` in `contact.html` to `https://your-app-name.herokuapp.com/submit`.

---

### Replit

1. Create a new **Python** Repl and upload `app.py`, `requirements.txt`, and `.env`.
2. In the **Secrets** panel, add each key from `.env.example`.
3. Click **Run** – Replit exposes the app on a public URL automatically.
4. Update the form `action` in `contact.html` to the Replit URL + `/submit`.

---

### Custom Server (VPS / shared hosting)

1. Copy `app.py`, `requirements.txt`, and `.env` to the server.
2. Install dependencies: `pip install -r requirements.txt`.
3. Run with a process manager such as **Gunicorn** behind Nginx:

   ```bash
   pip install gunicorn
   gunicorn -w 2 -b 0.0.0.0:5000 app:app
   ```

4. Configure Nginx to proxy `/submit` requests to port 5000.

---

## Environment Variables Reference

| Variable          | Description                                         | Default         |
|-------------------|-----------------------------------------------------|-----------------|
| `EMAIL_HOST`      | SMTP server hostname                                | `smtp.gmail.com`|
| `EMAIL_PORT`      | SMTP server port                                    | `587`           |
| `EMAIL_USER`      | SMTP login / sender address                         | *(required)*    |
| `EMAIL_PASSWORD`  | SMTP password or app password                       | *(required)*    |
| `RECIPIENT_EMAIL` | Address that receives enquiry notifications         | Same as `EMAIL_USER` |
| `ALLOWED_ORIGINS` | CORS origin(s), comma-separated (`*` for all)       | `*`             |
| `FLASK_DEBUG`     | Enable debug mode (`true` / `false`) – **never use in production** | `false` |
| `PORT`            | Port to listen on (set automatically by most hosts) | `5000`          |

---

## API Reference

### `POST /submit`

Accepts `application/json` or `multipart/form-data`.

**Fields**

| Field          | Required | Description              |
|----------------|----------|--------------------------|
| `name`         | Yes      | Enquirer's full name     |
| `email`        | Yes      | Enquirer's email address |
| `phone`        | No       | Phone / WhatsApp number  |
| `message`      | Yes      | Enquiry message          |
| `travel_date`  | No       | Planned travel date      |
| `trip`         | No       | Tour of interest         |

**Success response (200)**

```json
{
  "ok": true,
  "email_sent": true,
  "message": "Message received! I'll be in touch within a few hours."
}
```

**Validation error response (400)**

```json
{
  "ok": false,
  "errors": {
    "name": "Name is required.",
    "email": "A valid email address is required."
  }
}
```

### `GET /health`

Returns `{"status": "ok"}` – useful for uptime monitoring.

---

## Submission Log

All enquiries are appended to `submissions.log` in the working directory.
Review this file to see a record of every form submission.
