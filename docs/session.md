# Session API Spec

## Add Mentor Available Session

Endpoint : POST /session/api/addSession

Cookies :
- auth: token

Request Body :

```json
{
  "scheduledAt" : "2024-10-03T14:30:00Z",
  "quota": 5
}
```

Response Body (Success) :

```json
{
  "success" : true,
  "message": "Successfully add new schedule",
  "data" : {
    "id": 1,
    "mentor_id" : 1,
    "scheduledAt": "2024-10-03 14:30:00",
    "quota": 5
  }
}
```

## Update Available Session 

Endpoint : PUT /session/api/updateSession/:sessionId

Cookies :
- auth: token

Request Body :

```json
{
  "scheduledAt" : "2024-10-03T14:30:00Z", // optional
  "quota": 5 // optional
}
```

Response Body (Success) :

```json
{
  "success" : true,
  "message": "successfully update mentor session",
  "data" : {
    "id": 1,
    "mentor_id" : 1,
    "scheduledAt": "2024-10-03 14:30:00",
    "quota": 5
  }
}
```

## Get Mentor Available Sessions

Endpoint : GET /session/getSession/:mentorId

Response Body

```json
{
    "success": true,
    "message": "Successfully get all session data",
    "data": [
        {
            "id": 1,
            "mentor_id": 1,
            "scheduledAt" : "2030-10-03 14:30:00",
            "quota": 5
        },
        {
            "id": 2,
            "mentor_id": 1,
            "scheduledAt" : "2030-10-03 14:30:00",
            "quota": 2
        }
    ]
}
```

## Remove Available Session

Endpoint : DELETE /session/api/deleteSession/:sessionId

Cookies :
- auth: token

Response Body

```json
{
  "success" : true,
  "message": "successfully delete mentor session"
}
```

## Book Mentoring Session

Endpoint : POST /session/api/student/bookSession/:mentorId

Cookies :
- auth: token

Request Body :

```json
{
  "session_id" : 3
}
```

Response Body (Success) :

```json
{
  "success" : true,
  "message": "successfully book mentoring session",
  "data" : {
    "scheduledAt" : "2024-10-03 14:30:00",
    "mentor_name" : "Jane Doe",
    "student_name" : "John Doe",
    "field" : "Web Development",
    "bookedAt": "2024-10-03 14:30:00"
  }
}
```

## Error Response

Response Body (Failed) :

```json
{
  "success" : false,
  "message" : "Unauthorized"
}
```