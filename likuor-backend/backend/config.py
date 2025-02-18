import json

aws_email_sender = "no-reply@likuorapp.com"

import boto3
def get_secrets(name):
    ssm_client = boto3.client('ssm')
    response = ssm_client.get_parameter(
        Name=name,
        WithDecryption=True
    )
    parameter_value = json.loads(response['Parameter']['Value'])
    return parameter_value
