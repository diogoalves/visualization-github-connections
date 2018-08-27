# visualization-github-connections
Explore your github connections using a network graph visualization.

This app uses:
- react, material-ui and apollo-client in frontend
- html5 canvas, present in react-force-graph component

### Demo
[![Demo](https://img.youtube.com/vi/Qsg7SodoDDA/0.jpg)](https://youtu.be/Qsg7SodoDDA)


### setting up github client id
in order to get a valid [token](https://developer.github.com/v4/guides/forming-calls/#authenticating-with-graphql) to access github api you need first to setup a [github oauth app](https://developer.github.com/apps/building-oauth-apps/).

### deploying in now


### running github authentication proxy locally
first you should provid you previous created github app details in backend/.env file. User backend/env.example as a template.

    cd backend
    npm install
    npm start


# Credits
Favicon made by Smashicons from Flaticon, CC 3.0 BY.
react-force-graph by
