# Description
Everyday Newsletter for your favorite channels in Reddit

# Instruccions
- To run the app please input
```
npm start
```
# api points

### Users
- GET /api/v1/user/all - Get all Users
- GET /api/v1/user/:userId - Get User by ID
- PUT /api/v1/user/:userId/edit - Edit User by ID
- POST /api/v1/user/add - Add new User

### Channels
- GET /api/v1/channel/all - Get all Channels
- GET /api/v1/channel/:channelId - Get Channel by ID
- PUT /api/v1/channel/:channelId/edit - Edit Channel by ID
- POST /api/v1/channel/add - Add new Channel

**NOTES:**
- I cover all the points mention in the code challenge pdf
- The folder cronjobs have a file with instruccions to send emails everyday at 8am with the top 3 news of users favorite channels
- The folder postman has all the api end points with the correspondant parameters
- DB configuration in config/database.js
- There is no images in the posts from reedit so I didnt add any image like the one it shows in the design provided
- I didn't add unit test just because of the short amount of time
- To change the status of the recieve newsletter or not, you can edit user and change it, I didn't create a specific endpoint
- Also if you want to add favorites to a user you can do it throught edit user
- the table channels needs to be feed with valid channels from reddit in order to work for example worldnews, technology, funny etc...