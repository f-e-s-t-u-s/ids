import smtplib
import time
import os
import pandas as pd

def send_email(sender, recipient, subject, body):
    with smtplib.SMTP("smtp.gmail.com", 587) as smtp:
        smtp_server = "smtp.gmail.com"
        port = 587

        # Create a secure connection to the SMTP server.
        smtp = smtplib.SMTP(smtp_server, port)
        smtp.starttls()

        # Login to the SMTP server.
        smtp.login(sender, "eiyztdafsyawoblh")


        smtp.sendmail(sender, recipient, f"Subject: {subject}\n\n{body}")
        # Disconnect from the SMTP server.
        smtp.quit()

import re
attacks=["2100498","2000001","2000002","2000003","2000004","2100001","2100002","2100003","2100004","2100005","2100006"]

def check_log_file(filename):
    with open(filename, "r") as f:
        now=pd.to_datetime(pd.Timestamp.now())
        time.sleep(5)
        for line in f:
            event=pd.to_datetime(line[0:20])
            if re.findall(':2\d+:',line)[0].replace(':','') in attacks and event>now:
                print("detected")
                send_email("wschool752@gmail.com", "wschool752@gmail.com", "New ATTACK DETECTED", line)
                print("Email sent")
                break
            else:
                pass

while True:
    check_log_file("/var/log/suricata/fast.log")