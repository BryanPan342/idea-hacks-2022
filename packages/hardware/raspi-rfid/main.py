#!/usr/bin/env/ python

import time
import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

def setup(button_pins):
    # Initialize Firebase
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)

    # Initialize RFID
    GPIO.setmode(GPIO.BOARD)
    for pin in button_pins.keys():
        GPIO.setup(pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)
    
def getFirebaseDict():
    # Get latest database infomation
    snapshots = list(firestore_db.collection(u'devices').get())
    for snapshot in snapshots:
        print(snapshot.to_dict())

    return snapshot.to_dict()

def read(firestore_db):
    id, text = reader.read()
    print(id)
    print(text)

    # Push to firebase
    firestore_db.collection(u'devices').document(u'mfrc522').update({'recent_tile_id': id})

def write(firestore_db):
    # Get text from firebase
    id, text = reader.read()
    print('writing tile id', id, 'for display on react')

    payload = firebase_dict['payload']
    payload['tile_id'] = id

    firestore_db.collection(u'devices').document(u'mfrc522').update({'payload': payload})

def button1_pressed(channel):
    print("Button 1 pressed")
    firestore_db.collection(u'devices').document(u'mfrc522').update({'music': 1})
def button2_pressed(channel):
    print("Button 2 pressed")
    firestore_db.collection(u'devices').document(u'mfrc522').update({'music': 2})    
def button3_pressed(channel):
    print("Button 3 pressed")
    firestore_db.collection(u'devices').document(u'mfrc522').update({'music': 3})

    # Do our stuff
    for pin in button_pins.keys():
        print("test")
        input_value = GPIO.input(pin)
        
        if input_value == False:
            print("Button:", pin, "was pressed")

if __name__ == '__main__':
    setup()
    running = True
    firestore_db = firestore.client()
    reader = SimpleMFRC522()
    button_pins = {11:1, 13:2, 15:3}
    
    GPIO.add_event_detect(11, GPIO.FALLING, 
            callback=button1_pressed, bouncetime=100)
    GPIO.add_event_detect(13, GPIO.FALLING, 
            callback=button2_pressed, bouncetime=100)
    GPIO.add_event_detect(15, GPIO.FALLING, 
            callback=button3_pressed, bouncetime=100)

    firebase_dict = getFirebaseDict()
    readMode = firebase_dict['read_mode']

    while running==True:
        if readMode:
            read(firestore_db)
        else:
            write(firestore_db)

    GPIO.cleanup()