import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from dotenv import load_dotenv

load_dotenv()


EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")


async def send_email(to_email: str, subject: str, message: str):

    if not EMAIL_USER or not EMAIL_PASSWORD:
        raise Exception("Email credentials are missing")

    msg = MIMEMultipart()

    msg["From"] = EMAIL_USER
    msg["To"] = to_email
    msg["Subject"] = subject

    msg.attach(
        MIMEText(message, "plain")
    )

    try:

        with smtplib.SMTP("smtp.gmail.com", 587) as server:

            server.ehlo()

            server.starttls()

            server.ehlo()

            server.login(
                EMAIL_USER,
                EMAIL_PASSWORD
            )

            server.sendmail(
                EMAIL_USER,
                to_email,
                msg.as_string()
            )

    except Exception as e:

        print("EMAIL SMTP ERROR:", e)

        raise Exception(
            f"Email sending failed: {e}"
        )