![Please Favourite This Project Before Reading](https://github.com/shivamguys/irctc-cypress-automation/assets/25263989/00ea8f09-b0f0-4130-a86d-1aaa6eecb80e)
# IRCTC Tatkal Cypress Automation!

### Now book your Tatkal tickets in under 1 minute at ease by bypassing the captcha and filling in multiple passenger details at once. Let the script book it for you.

> [!NOTE] 
> ```
> This Cypress script for automating IRCTC ticket booking
> is created strictly for educational purposes. The code and its
> usage are intended to showcase Cypress testing capabilities and
> best practices. Any attempt to use this script for unauthorized
> access or activities that violate IRCTC terms of service or legal
> regulations is strictly prohibited. The author(s) and associated
> entities are not responsible for any misuse or legal consequences 
> resulting from the use of this script for any unauthorized 
> activities.
> ```

[![IRCTC Automation](https://img.shields.io/endpoint?url=https://cloud.cypress.io/badge/simple/7afdkj/main&style=for-the-badge&logo=cypress)](https://cloud.cypress.io/projects/7afdkj/runs)

[![IRCTC Automation](https://img.shields.io/endpoint?url=https://cloud.cypress.io/badge/detailed/7afdkj/main&style=for-the-badge&logo=cypress)](https://cloud.cypress.io/projects/7afdkj/runs)

### See the recording of all the runs at Tatkal time here....
####  [Sneak Peek into the runs here...](https://cloud.cypress.io/projects/7afdkj/runs)

### Watch the simple recording here....
####  [Watch the video here](https://i.imgur.com/3U8yKmb.mp4)

[![](https://imgur.com/0xFTYhk.png)](https://i.imgur.com/3U8yKmb.mp4)




## Features it has right now?

- [x] Filling Captchas and retrying untill success
- [x] Signing in with your username and password
- [x] Multiple Passenger 
- [x] Pre filling All Information
- [x] Payment Gateway Automation(Paying With UPI ID OR QR)



## How to Make this work for you?

- Things you need **GOOGLE_APPLICATION_CREDENTIALS** thats it.
- Make relevant changes in the file located at **cypress/fixtures/passenger_data.json**
> [!TIP]
> Filling Your **UPI ID** Will Initiate A Payment Request Directly.
> But it's a bit slow generally would take 2 or 3 sec to arrive request on your smartphone.
> If You are not using this then you can scan and pay directly which would be much faster.



```
{
  "TRAIN_NO": "12318",
  "TRAIN_COACH": "SL",
  "TRAVEL_DATE": "12/09/2023",
  "SOURCE_STATION": "UMB",
  "BOARDING_STATION": null, <-- Change to full station name if required, else leave null
  "DESTINATION_STATION": "BSB",
  "TATKAL": true,
  "UPI_ID": "",
  "PASSENGER_DETAILS": [
    {
      "NAME": "SHIVAM PANDEY",
      "AGE": 25,
      "GENDER": "Male",
      "SEAT": "Side Upper",
      "FOOD" "No Food"
    }
  ],

}
```

- Below are the relevant values you can use for **TRAIN_COACH**, **GENDER** , **SEAT**

***
```
"__valid_coaches__": "SL | 2A | 3A | 3E | 1A | CC | EC | 2S",
"__valid_seats__": "Lower | Middle | Upper | Side Lower | Side Upper | Window Side | No Preference",
"__valid_genders__": "Male | Female | Transgender",
"__valid_food_choices__": "Veg | Non Veg | No Food"

```
***
- You can add multiple passenger object in `PASSENGER_DETAILS`

- Configure `username` , `password` in `cypress.env.json`

> [!TIP]
> If you wish to enter **CAPTCHA** manually, then change `MANUAL_CAPTCHA` to `true`

```
{
    "username": "yourusername",
    "password": "yourpassword",
    "BASE_URL": "http://127.0.0.1:5000/",
    "MANUAL_CAPTCHA": false
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
> [!IMPORTANT]
>  Create Your Google Cloud Account and Enable the billing for cloud vision that would charge you 2₹ or 3₹ and 
> download your credentials file.

- Now navigate to **irctc-cypress-automation/irctc-captcha-solve-server** and install all requirements and run the server
- **Make sure you run this from another terminal window tab** 
- Set the path for your **GOOGLE_APPLICATION_CREDENTIALS** also
```
cd irctc-cypress-automation/irctc-captcha-solve-server
pip3 install -r requirements.txt
export GOOGLE_APPLICATION_CREDENTIALS="your credentials file path goes here please change this............"
python3 app.py
```
> [!IMPORTANT]
> For Windows replace **export** with **set**
Avoid using double quotes around the path. example
```
set GOOGLE_APPLICATION_CREDENTIALS=C:\GOOGLE_APPLICATION_CREDENTIALS\credentials.json
 ```



