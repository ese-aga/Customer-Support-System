Note: Applications were built with React, Node, Express and Postgres. An admin should be create via Postman
# FOR THE FRONTEND, RUN THE FOLLOWING COMMAND
1. run npm install
2. run npm start

# support-system-api
this is an api for a customer support system and here are the guides on how to use it below:
1. clone the repository
2. create a database called supportsystem
3. copy the sql commands i provided in the code into your psql terminal or sql editor(note, it is postgres)
4. install uuid into your database with this command "CREATE EXTENSION IF NOT EXISTS "uuid-ossp";"
5. run npm install
6. run npm start(to run the app on pm2 cluster) or npm run dev(to run the app on nodemon)
