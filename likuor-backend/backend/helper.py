import boto3
from botocore.exceptions import NoCredentialsError, PartialCredentialsError


def send_email(body_html, email_subject, recipient, sender):
    ses_client = boto3.client('ses')
    sender = sender
    recipient = recipient
    subject = email_subject
    body_html = body_html
    charset = "UTF-8"
    try:
        response = ses_client.send_email(
            Destination={
                'ToAddresses': [
                    recipient,
                ],
            },
            Message={
                'Body': {
                    'Html': {
                        'Charset': charset,
                        'Data': body_html,
                    }
                },
                'Subject': {
                    'Charset': charset,
                    'Data': subject,
                },
            },
            Source=sender,
        )
    except (NoCredentialsError, PartialCredentialsError) as e:
        print(f"Error: {e}")
        raise Exception(e)
    else:
        print("Email sent! Message ID:"),
        print(response['MessageId'])


def email_verification_html(code):
    style = """
    body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #00B0B9;
            color: #ffffff;
            padding: 10px 0;
            text-align: center;
        }
        .header img {
            max-width: 30%;
            height: 30%;
        }
        .content {
            padding: 20px;
            text-align: left;
        }
        .otp {
            font-size: 24px;
            font-weight: bold;
            color: #00B0B9;
            text-align: center;
            margin: 20px 0;
        }
        .footer {
            background-color: #f4f4f4;
            color: #888888;
            text-align: center;
            padding: 10px 0;
            font-size: 12px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 20px 0;
            background-color: #00B0B9;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
        }
    """
    html = f"""
    <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        {style}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://likour.s3.af-south-1.amazonaws.com/assests/static/logo-without-background-Photoroom.png" alt="Company Logo">
        </div>
        <div class="content">
            <p>Hey There,</p>
            <p>Welcome to Likour. Before you can continue we need to verify your email address. Use the following One-Time Password (OTP) to verify your email:</p>
            <div class="otp">[{code}]</div>
            <p>This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
            <p>Best regards,<br>Likour</p>
        </div>
        <div class="footer">
            <p>&copy; 2025 Likour. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    """
    return html
