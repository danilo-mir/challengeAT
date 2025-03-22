import smtplib
import ssl
from email.mime.text import MIMEText


def send_email(sender, password, recipient, subject, body):
    message = MIMEText(body)
    message["Subject"] = subject
    message["From"] = sender
    message["To"] = recipient

    context = ssl.create_default_context()

    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as smtp_server:
        smtp_server.login(
            user=sender,
            password=password
        )
        smtp_server.sendmail(
            from_addr=sender,
            to_addrs=recipient,
            msg=message.as_string()
        )
    print(f"[INFO] Email sent to {recipient}")
