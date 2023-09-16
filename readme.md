# IRCTC Tatkal Cypress Automation !

### Now book your tatkal tickets under 1 min at ease by bypassing captcha and filling multiple passenger details at once. Let the script book it for you.

[![IRCTC Automation](https://img.shields.io/endpoint?url=https://cloud.cypress.io/badge/simple/7afdkj/main&style=for-the-badge&logo=cypress)](https://cloud.cypress.io/projects/7afdkj/runs)

[![IRCTC Automation](https://img.shields.io/endpoint?url=https://cloud.cypress.io/badge/detailed/7afdkj/main&style=for-the-badge&logo=cypress)](https://cloud.cypress.io/projects/7afdkj/runs)

### See the recording of all the runs at tatkal time here....
####  [Sneak Peek into the runs here...](https://cloud.cypress.io/projects/7afdkj/runs)

### Watch the simple recording here....
####  [Watch the video here](https://i.imgur.com/3U8yKmb.mp4)

[![](https://imgur.com/0xFTYhk.png)](https://i.imgur.com/3U8yKmb.mp4)




## Features it has right now?

- [x] Filling Captchas and retrying untill success
- [x] Signing in with your username and password
- [x] Multiple Passenger 
- [x] Pre filling All Information
- [x] Payment Gateway Automation(Paying With UPI QR)



## How to Make this work for you?

- Things you need **GOOGLE_APPLICATION_CREDENTIALS** thats it.
- Make relevant changes in file located at **cypress/fixtures/passenger_data.json**
```
{
  "TRAIN_NO": "12318",
  "TRAIN_COACH": "SL",
  "TRAVEL_DATE": "12/09/2023",
  "SOURCE_STATION": "UMB",
  "DESTINATION_STATION": "BSB",
  "TATKAL": true,
  "PASSENGER_DETAILS": [
    {
      "NAME": "SHIVAM PANDEY",
      "AGE": 25,
      "GENDER": "Male",
      "SEAT": "Side Upper"
    }
  ],

}
```

- Below are the relevant values you can use for **TRAIN_COACH**, **GENDER** , **SEAT**

***
```
  "__valid_coaches__": "SL | 2A | 3A | 3E | 1A",
  "__valid_seats__": "Lower| Middle | Upper| Side Lower | Side Upper",
  "__valid_genders__": "Male|Female|Transgender"

```
***
- You can add multiple passenger object in **PASSENGER_DETAILS***

- Configure **Username** , **password** in **cypress.env.json**

```
{
    "username": "yourusername",
    "password": "yourpassword",
    "BASE_URL": "http://127.0.0.1:5000/"
}
```

-  **BASE_URL** is the local python server which you will run is responsible for filling captchas for you.


## Running this whole bunch ?


- clone the repo
- make sure you have Nodejs and npm installed
```
sudo apt update 
sudo apt install nodejs
sudo apt install npm
```
- navigate to **irctc-cypress-automation** and install dependencies

```
cd irctc-cypress-automation
npm install
npx cypress open

```



- Now navigate to **irctc-cypress-automation/irctc-captcha-solve-server** and install all requirements and run the server
- **Make sure you run this from another terminal window tab** 
- Set the path for your **GOOGLE_APPLICATION_CREDENTIALS** also
```
cd irctc-cypress-automation/irctc-captcha-solve-server
pip3 install -r requirements.txt
export GOOGLE_APPLICATION_CREDENTIALS="your credentials file path goes here please change this............"
python3 app.py
```

