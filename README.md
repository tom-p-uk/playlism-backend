# Playlism Backend

The backend for a React Native app that lets users create playlists for friends/other users.

### Technology Used:

* Node
* Express
* MongoDB
* Mongoose
* Passport (JWT/Facebook/Google)
* Babel

### Installation:

Provided Node and NPM are installed, enter the following CLI command to install dependencies:
```
$ npm install
```

### Usage:

A Facebook app ID, Facebook app secret, Google client ID, Google client Secret and valid Mongo URIs are required. Check the documentation for each to set them up. A secret string for JWT validation is also required.
Create a .env file in both the root directory and add values to the following keys:
```
MONGO_URI=""
MONGO_TEST_URI=""
SECRET=""
FACEBOOK_APP_ID=""
FACEBOOK_APP_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
HOST=""
```

To run the API, enter the following command:
```
$ npm run dev
```

To run tests, enter the following command:
```
$ npm run test
```
