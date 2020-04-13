# Coronavirus - (COVID-19) Full Stack Application
The idea behind this application is to displays the statistics of Coronavirus COVID-19 around the world and the data are being collected from [Johns Hopkins University Center for Systems Science and Engineering JHU CSSE](https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data) and it updates the cases constantly on this website around the world. 

## Technical Overview
This is a full-stack application which runs react.js in front-end and node.js in the back-end and it parses the data from (JHU CSSE) and stored in MongoDB database.

And it uses Mapbox to populate the coordinates on the map using GeoJSON format.

<img src="Screenshots/covid19.PNG"/>

### Website Link
[https://covid19.hackbotone.com](https://covid19.hackbotone.com)

### Server Installation
``````````````````````````
cd server 
npm install
node app.js
``````````````````````````
Open [http://localhost:9000](http://localhost:9000) to view it in the browser.

### Client Installation
``````````````````````````
cd client 
npm install
npm start
``````````````````````````````````````````````````````````````````````````````````````````````````````````
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Note
If you face any problem or have any suggestion on improving the code then feel free to raise an issue.


[https://hackbotone.com/blog/covid-19-full-stack-application](https://hackbotone.com/blog/covid-19-full-stack-application)