## A Sample 2 tier node.js application for saving tasks to mongodb

Start a running mongodb instance for the application
```
docker run -p 27016:27017 --detach mongo
```
Start the web application
```
npm start
```
Open your browser to http://localhost:3001.
The application will communicate with the mongo container running locally on your machine
