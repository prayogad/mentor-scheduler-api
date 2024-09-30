# Session API Spec

## Add Mentor Available Session

Endpoint : POST /mentor/schedule

Headers :
- Authorization: token

Request Body :

```json
{
  "scheduledAt" : "2024-09-28 12:34:56",
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
    "scheduledAt" : "2024-09-28 12:34:56",
    "quota": 5
  }
}
```

## Update Available Session 

Endpoint : PUT /mentor/schedule/:scheduleId

Headers :
- Authorization: token

Request Body :

```json
{
  "scheduledAt" : "2024-09-28 12:34:56", // optional
  "quota": 5 // optional
}
```

Response Body (Success) :

```json
{
  "success" : true,
  "message": "Successfully update schedule",
  "data" : {
    "id": 1,
    "scheduledAt" : "2024-09-28 12:34:56",
    "quota": 5
  }
}
```

## Get Mentor Available Sessions

Endpoint : GET /mentor/:mentorId/schedule

Response Body

```json
{
    "success": true,
    "message": "Successfully get all session data",
    "data": [
        {
            "id": 1,
            "scheduledAt": "2024-09-28 12:34:56",
            "quota": 5
        },
        {
            "id": 2,
            "scheduledAt": "2024-09-29 12:34:56",
            "quota": 2
        }
    ]
}
```

## Remove Available Session

Endpoint : DELETE /mentor/schedule/:scheduleId

Headers :
- Authorization: token

Response Body

```json
{
  "success" : true,
  "message": "Successfully remove session"
}
```

## Book Mentoring Session

Endpoint : POST /student/bookSession

Headers :
- Authorization: token

Request Body :

```json
{
  "mentor_id" : 1,
  "session_id" : 3
}
```

Response Body (Success) :

```json
{
  "success" : true,
  "message": "Successfully book mentoring session",
  "data" : {
    "mentor_name" : "Jane Doe",
    "student_name" : "John Doe",
    "scheduledAt" : "2024-09-28 12:34:56",
    "field" : "Web Development"
  }
}
```

## Error Response

Response Body (Failed) :

```json
{
  "success" : false,
  "message" : "Unauthorized",
  "data": null
}
```