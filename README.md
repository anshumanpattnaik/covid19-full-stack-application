# Coronavirus - (COVID-19) Full Stack Application
The idea behind this application is to displays the statistics of Coronavirus COVID-19 around the world and the data are being collected from [Johns Hopkins University Center for Systems Science and Engineering JHU CSSE](https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data) and it updates the cases constantly on this website around the world. 

## Technical Overview
This is a full-stack application which runs react.js in front-end and node.js in the back-end and it parses the data from [JHU CSSE](https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data) and stored in MongoDB database.

And it uses Mapbox to populate the coordinates on the map using GeoJSON format.

<img src="Screenshots/covid19.png"/>

### MongoDB sample database import command
After git clone import the dummy statistics into your local MongoDB database, which will help you to start the project.

``````````````````````````
git clone https://github.com/anshumanpattnaik/covid19-full-stack-application.git

cd covid19-full-stack-application

mongod (Start MongoDB database)

mongoimport --uri "mongodb://127.0.0.1:27017/covid-19" --collection covid_statistics --file dummy_statistics.json
``````````````````````````

### Server Installation
``````````````````````````
cd server 
npm install
npm start
``````````````````````````
Open [http://localhost:9000](http://localhost:9000) to view it in the browser.

### Client Installation
``````````````````````````
cd client 
npm install
npm start
``````````````````````````
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Change the constants values in Client app
````````````````````````````````````````````````
export const BASE_URL = `http://YOUR_LOCAL_IP_ADDRESS:9000`;
export const MAPBOX_ACCESS_TOKEN = `YOUR_MAPBOX_API_TOKEN`;
````````````````````````````````````````````````

### MAPBOX Styles
These two below styles i have made public and it should work when you use your own MAPBOX_API_TOKEN
````````````````````````````````````````````````
mapbox://styles/hackbotone/ck8vtayrp0x5f1io3sakcmpnv
mapbox://styles/hackbotone/ck8vt8vdj2fz91ilax6nwtins
````````````````````````````````````````````````

### Note
If you face any problem or have any suggestion on improving the code then feel free to raise an issue.

### Blog & Youtube explanation
[https://hackbotone.com/blog/covid-19-full-stack-application](https://hackbotone.com/blog/covid-19-full-stack-application)

[https://www.youtube.com/watch?v=dth5jfLDuus](https://www.youtube.com/watch?v=dth5jfLDuus)

### Website Design & Developed by
[Anshuman Pattnaik](https://www.linkedin.com/in/anshuman123/)

### License
This project is licensed under the [MIT License](LICENSE)
