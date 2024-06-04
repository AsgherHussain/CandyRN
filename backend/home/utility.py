from django.core.mail import EmailMessage
from django.utils.translation import ugettext_lazy as _

import requests
from requests.structures import CaseInsensitiveDict

from notifications.models import Notification
from royal_cloud_33498.settings import DEBUG, FCM_SERVER_KEY, SENDGRID_SENDER_IDENTITY, TWILIO_ACCOUNT_SID, TWILIO_ACCOUNT_TOKEN, TWILIO_MESSAGING_SID
from rest_framework.serializers import ValidationError
from rest_framework.authtoken.models import Token
import pyotp
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
from allauth.account.models import EmailAddress

from users.models import User


url = "https://fcm.googleapis.com/fcm/send"

headers = CaseInsensitiveDict()
headers["Accept"] = "application/json"
headers["Authorization"] = "key={}".format(FCM_SERVER_KEY)
headers["Content-Type"] = "application/json"


def send_otp_sms(phone, otp):
    if not DEBUG:
        try:
            client = Client(TWILIO_ACCOUNT_SID, TWILIO_ACCOUNT_TOKEN) 
            message = client.messages.create(  
                                        messaging_service_sid=TWILIO_MESSAGING_SID, 
                                        body='Your OTP is {}'.format(otp),      
                                        to=phone
                                    )
        except TwilioRestException as e:
            raise ValidationError('Please enter a valid North American phone number excluding country code {}'.format(e))
    else:
        email = EmailMessage('OTP Verification', 'Your OTP is {}'.format(otp), from_email=SENDGRID_SENDER_IDENTITY, to=('testemail@gmail.com',))
        email.send()

def send_invoice(user, invoice):
    if user.registration_id:
        payload = {
                'to': user.registration_id,
                'notification': {
                    "title": "You have received an invoice",
                    "text": f"Invoice URL: {invoice}"
                }
            }
        resp = requests.post(url, headers=headers, json=payload)
    Notification.objects.create(
            user=user,
            title="You have received an invoice",
            content=f"Invoice URL: {invoice}"
    )
    if user.phone:
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_ACCOUNT_TOKEN) 
        message = client.messages.create(  
                                    messaging_service_sid=TWILIO_MESSAGING_SID, 
                                    body=f'Here is your confirmed invoice from Candy. {invoice}',      
                                    to=user.phone
                                )
    if user.email:
        email_body = """\
                <html>
                <head>You've received a confirmed invoice from Candy.</head><br>
                <body>
                    <p>
                    Click on the following link to view or download your latest invoice. <br>
                    <br>
                    <a href="%s">%s</a>
                    </p>
                </body>
                </html>
                """ % (invoice, invoice)
        email_msg = EmailMessage("Invoice From Jonathan Chu", email_body, from_email=SENDGRID_SENDER_IDENTITY, to=[user.email])
        email_msg.content_subtype = "html"
        email_msg.send()     

    # Also send the invoice to the admin
    emails = ["invoicecandy@gmail.com"]
    # admin_user = User.objects.filter(is_superuser=True).first()
    # if admin_user:
    #     emails.append(admin_user.email)

    email_body = """\
            <html>
            <head>You've received a confirmed invoice from Candy.</head><br>
            <body>
                <p>
                Click on the following link to view or download your latest invoice. <br>
                <br>
                <a href="%s">%s</a>
                </p>
            </body>
            </html>
            """ % (invoice, invoice)
    email_msg = EmailMessage("Invoice From Jonathan Chu", email_body, from_email=SENDGRID_SENDER_IDENTITY, to=["invoicecandy@gmail.com"])
    email_msg.content_subtype = "html"
    email_msg.send()

def generateOTP(phone=None, user=None):
    if phone and user:
        secret = pyotp.random_base32()
        totp = pyotp.TOTP(secret)
        otp = totp.now()
        user.activation_key = secret
        user.otp = otp
        user.save()
        sliced_otp = str(otp)[:4]
        send_otp_sms(phone=phone, otp=sliced_otp)
        return user


def verifyOTP(otp=None, activation_key=None, user=None):
    if otp and activation_key and user:
        totp = pyotp.TOTP(activation_key)
        sliced_otp = user.otp[:4]
        if otp == sliced_otp:
            return totp.verify(user.otp, valid_window=6)
        return False
    else:
        return False

def auth_token(user):
    token, created = Token.objects.get_or_create(user=user)
    return token


def set_email(email, user):
    EmailAddress.objects.get_or_create(user=user, 
                                     verified=True, 
                                     primary=True, 
                                     email=email)

def send_feedback(title, body, email):
    email_body = """\
            <html>
            <head>%s</head>
            <body>
                <p>
                %s
                </p>
            </body>
            </html>
            """ % (title, body)
    email_msg = EmailMessage("Feedback Response From Jonathan Chu", email_body, from_email=SENDGRID_SENDER_IDENTITY, to=[email])
    email_msg.content_subtype = "html"
    email_msg.send()


def send_notification(user, title, content):
    if user.registration_id:
        payload = {
                'to': user.registration_id,
                'notification': {
                    "title": title,
                    "text": content
                }
            }
        resp = requests.post(url, headers=headers, json=payload)
    Notification.objects.create(
            user=user,
            title=title,
            content=content
    )


def send_notification_to_all(title, content):
    users = User.objects.filter(flagged=False)
    registration_ids = []
    for user in users:
        Notification.objects.create(
            user=user,
            title=title,
            content=content
            )
        if user.registration_id:
            registration_ids.append(user.registration_id)
    if registration_ids:
        payload = {
                'registration_ids': registration_ids,
                'notification': {
                    "title": title,
                    "text": content
                }
            }
        resp = requests.post(url, headers=headers, json=payload)

def send_cancel_email(email):
    email_body = """\
            <html>
            <head></head>
            <body>
                <p>
                Estimado cliente, Le informamos que este modelo se estara cancelando ya que no se pudo completar a paquete.<br>
                Por favor tenga en cuenta que siempre tiene la opcion de comprar un paquete completo para que su pedido sea seguro.
                </p>
            </body>
            </html>
            """
    email_msg = EmailMessage("Cancellation From Jonathan Chu", email_body, from_email=SENDGRID_SENDER_IDENTITY, to=[email])
    email_msg.content_subtype = "html"
    email_msg.send()