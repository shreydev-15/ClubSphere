## Events

### Event Model
- title
- description
- date
- startTime
- endTime
- location
- club
- createdBy

### APIs
POST   /api/clubs/:clubId/events
GET    /api/clubs/:clubId/events
GET    /api/clubs/:clubId/events/:eventId
PATCH  /api/clubs/:clubId/events/:eventId
DELETE /api/clubs/:clubId/events/:eventId

### Authorization
Create / Update / Delete
→ Club Admin only

Get events
→ Authenticated users

### Phase 4
- Event CRUD implemented
- Club-level authorization implemented
- API testing completed