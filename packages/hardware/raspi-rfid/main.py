#!/usr/bin/env/ python

import time
import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Initialize Firebase
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

firestore_db = firestore.client()

# Initialize RFID
GPIO.setmode(GPIO.BOARD)
button_pins = {11:1}
for pin in button_pins.keys():
    GPIO.setup(pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)

reader = SimpleMFRC522()
running = True

while running==True:
    # Get latest database infomation
    snapshots = list(firestore_db.collection(u'devices').get())
    for snapshot in snapshots:
        print(snapshot.to_dict())

    firebase_dict = snapshot.to_dict()

    # Get the mode from firebase
    readMode = firebase_dict['read_mode']

    if readMode:
        id, text = reader.read()
        print(id)
        print(text)

        # Push to firebase
        firestore_db.collection(u'devices').document(u'mfrc522').update({'recent_tile_id': id})

    else:
        # Get text from firebase
        id, text = reader.read()
        print('writing tile id', id, 'for display on react')

        payload = firebase_dict['payload']
        payload['tile_id'] = id

        firestore_db.collection(u'devices').document(u'mfrc522').update({'payload': payload})

    # Do our stuff
    for pin in button_pins.keys():
        print("test")
        input_value = GPIO.input(pin)

        if input_value == False:
            print("Button:", pin, "was pressed")
            firestore_db.collection(u'devices').document(u'mfrc522').update({'music': button_pins[pin]})

GPIO.cleanup()
