# Session API Spec

## Add Mentor Available Session

Endpoint : POST /mentor/api/schedule

Headers :
- Authorization: token

Request Body :

```json
{
  "date" : "2024-09-28",
  "time": "12:34:56",
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
    "date" : "2024-09-28",
    "time": "12:34:56",
    "quota": 5
  }
}
```

## Update Available Session 

Endpoint : PUT /mentor/api/schedule/:scheduleId

Headers :
- Authorization: token

Request Body :

```json
{
  "date" : "2024-09-28", // optional
  "time": "12:34:56", // optional
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
    "date" : "2024-09-28",
    "time": "12:34:56",
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
            "date" : "2024-09-28",
            "time": "12:34:56",
            "quota": 5
        },
        {
            "id": 2,
            "date" : "2024-09-28",
            "time": "12:34:56",
            "quota": 2
        }
    ]
}
```

## Remove Available Session

Endpoint : DELETE /mentor/api/schedule/:scheduleId

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

Endpoint : POST /student/bookSession/:mentorId

Headers :
- Authorization: token

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
  "message": "Successfully book mentoring session",
  "data" : {
    "mentor_name" : "Jane Doe",
    "student_name" : "John Doe",
    "date" : "2024-09-28",
    "time": "12:34:56",
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