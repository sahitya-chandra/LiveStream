# Overlay API Documentation
This API allows users to create, retrieve, update, and delete overlay data stored in a MongoDB database. Overlays can either be text or image types, with defined positions on the screen.

### Base URL
```http://localhost:8080/api/overlays```

### Data Schema
Each overlay has the following structure:
```
{
  "type": "text" | "image",
  "content": "-----",
  "position": {
    "x": number,
    "y": number
  }
}
```
type: Defines the type of overlay. Either "text" or "image".

content:
For "text" type, this will be the text content.
For "image" type, this will be the image URL.

position: Defines the x and y coordinates for positioning the overlay.

## Endpoints

1. Create Overlay
POST /api/overlays

Creates a new overlay.

Request:
Headers: Content-Type: application/json
Body:
```
{
  "type": "text",
  "content": "Hello World",
  "position": { "x": 100, "y": 200 }
}
```
Response: 201 Created
```
{ "message": "Overlay created successfully" }
```

2. Retrieve All Overlays
GET /api/overlays

Retrieves all stored overlays.

Response: 200 OK

```[
  {
    "_id": "64b1e9f8e1d3c2a5f0e4d6b1",
    "type": "text",
    "content": "Hello World",
    "position": { "x": 100, "y": 200 }
  }
]
```

3. Update Overlay
PUT /api/overlays/<id>

Updates an overlay by its ID.

Request:
Headers: Content-Type: application/json
Body:
```
{
  "content": "Updated Content",
  "position": { "x": 150, "y": 250 }
}
```
Response: 200 OK
```
{ "message": "Overlay updated successfully" }
```

4. Delete Overlay
DELETE /api/overlays/<id>

Deletes an overlay by its ID.

Response: 200 OK
```
{ "message": "Overlay deleted successfully" }
```

Notes
The <id> in the URLs refers to the MongoDB ObjectId of the overlay.
No authentication or security measures are implemented.





