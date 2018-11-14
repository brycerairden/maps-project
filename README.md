# Parks Map
The application shows the top parks of Centennial, Colorado on a Google map. Built for the Udacity Front End Developer Nanodegree course. Thanks to Doug Brown, and his walkthrough (https://www.youtube.com/watch?v=NVAVLCJwAAo), used to understand and troubleshoot this project.

The project utilizes the built in service worker that is generated when running the create-react-app command in the terminal. The serviceWorker.js file is imported by the index.js file, which then calls the serviceWorker.register() function. This function registers the service worker in the production build only and will require you utilize the "build" instructions in the Note: section of "How to Launch"

## Table of Contents

* [How to Launch](#how-to-play)
* [Dependencies](#dependencies)

## How to Launch

Download or clone the github repository.

Run "npm install"

Run "npm start" Your system should automatcally design

Note: To build the app follow the below instructions
* After downloading/cloning, use "npm install"
* Run "npm run build"
* Use "yarn global add serve" - this is to allow for a local server
* Use "serve -s build"

## Dependencies

Browser support for HTML5, CSS3, and Javascript with ES6, npm, yarn, Google Maps, Foursquare, google-maps-react
Running "npm install" in the project directory
Google maps API
google-maps-react - https://www.npmjs.com/package/google-maps-react
Foursquare developer API