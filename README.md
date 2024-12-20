# Project Happy Thoughts API
This project is a Happy Thoughts Messaging API built with Express and MongoDB. It lets users create new thoughts, view the latest ones, and like a thought by adding hearts. I connected the project with my frontend Happy Thoughts project, enabling the API to handle requests and interact with the frontend.

## The problem
This project uses Express for the backend API, MongoDB with Mongoose for data storage, and dotenv for environment variable management. CORS handles cross-origin requests, and list-endpoints-express lists available API routes.  I started with connecting the project to MongoDB Atlas and then built the required endpoints step by step. I made a small mistake when importing the express-list-endpoints, which caused my endpoints to appear incorrectly. After realizing the mistake, I was able to fix it and get the home route to display the endpoints in a structured order. 

## View it live
https://project-happy-thoughts-api-pxns.onrender.com/