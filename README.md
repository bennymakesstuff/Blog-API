# API for BennyMakes Blog
Documentation for the Blog API
The API runs on a node server and interfaces with a MongoDB database


### Requirements
- Mongodb for NodeJS
- ExpressJS

### API Reference

On top of the standard methods included with ExpressJS and the MongoDB npm package the application provides an "app" object that exposes other methods and settings for the application.

| Method | Description | Parameters | Output |
| ------ | ----------- | ---------- | ------ |
| app.checkParams() | Checks a request against a parameters option and verifies that all required parameters are present and returns the request or false(error). | request = the http request body, params = the object containing parameter configuration | true returns array [true, request body], false returns [false, error] |
| app.getVersion() | Returns the software version. | - | Version number as a string |
