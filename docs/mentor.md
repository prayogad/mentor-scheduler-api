# Mentor API Spec

## Register Mentor

Request Body :

Endpoint : POST /mentor/register

```json
{
  "email" : "johndoe@example.com",
  "password" : "pass1234",
  "name" : "John Doe",
  "phone" : "123456789",
  "field": "Web Development"
}
```

Response Body (Success) : 

```json
{
  "success" : true,
  "message": "Successfully register mentor",
  "data" : {
    "id": 1,
    "username" : "johndoe",
    "name" : "John Doe",
    "phone" : "123456789",
    "field": "Web Development"
  }
}
```

Response Body (Failed) :

```json
{
  "success" : false,
  "message" : "Email is already taken",
  "data" : null
}
```

## Login Mentor

Endpoint : POST /mentor/login

Request Body :

```json
{
  "email" : "johndoe@example.com",
  "password" : "pass1234"
}
```

Response Body (Success) :

```json
{
  "success" : true,
  "message": "Successfully login mentor",
  "data" : {
    "id": 1,
    "username" : "johndoe",
    "name" : "John Doe",
    "phone" : "123456789",
    "field": "Web Development",
    "token" : "token"
  }
}
```

Response Body (Failed) :

```json
{
  "success" : false,
  "message" : "Username or password incorrect",
  "data": null
}
```

## Add Schedule Availability

Endpoint : POST /mentor/schedule

Headers :
- Authorization: token

Request Body :

```json
{
  "date" : "September 27 2024",
  "time": "3 PM",
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
    "date" : "September 27 2024",
    "time": "3 PM",
    "quota": 5
  }
}
```

Response Body (Failed) :

```json
{
  "success" : false,
  "message" : "Unauthorize",
  "data": null
}
```

## Get Schedule By Id

Endpoint : GET /mentor/schedule/:scheduleId

Headers :
- Authorization: token

Response Body

```json
{
  "success" : true,
  "message": "Successfully get schedule data",
  "data" : {
    "id": 1,
    "date" : "September 27 2024",
    "time": "3 PM",
    "quota": 5
  }
}
```

Response Body (Failed) :

```json
{
  "success" : false,
  "message" : "Unauthorize",
  "data": null
}
```

## Get All Schedules

Endpoint : GET /mentor/schedule

Headers :
- Authorization: token

Response Body

```json
{
    "success": true,
    "message": "Successfully get all schedule data",
    "data": [
        {
            "id": 1,
            "date": "September 27 2024",
            "time": "3 PM",
            "quota": 5
        },
        {
            "id": 2,
            "date": "September 28 2024",
            "time": "1 PM",
            "quota": 2
        }
    ]
}
```

Response Body (Failed) :

```json
{
  "success" : false,
  "message" : "Unauthorize",
  "data": null
}
```

## Update Schedule Availability

Endpoint : PATCH /mentor/schedule/:scheduleId

Headers :
- Authorization: token

Request Body :

```json
{
  "date" : "September 27 2024", // optional
  "time": "3 PM", // optional
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
    "date" : "September 27 2024",
    "time": "3 PM",
    "quota": 5
  }
}
```

Response Body (Failed) :

```json
{
  "success" : false,
  "message" : "Unauthorize",
  "data": null
}
```

## Remove Schedule

Endpoint : DELETE /mentor/schedule/:scheduleId

Headers :
- Authorization: token

Response Body

```json
{
  "success" : true,
  "message": "Successfully remove schedule"
}
```

Response Body (Failed) :

```json
{
  "success" : false,
  "message" : "Unauthorize"
}
```

## Get Mentor Dashboard

Endpoint : GET /mentor/dashboard

Headers :
- Authorization: token

Response Body (Success) :

```json
{
  "success" : true,
  "message": "Successfully get mentor dashboard",
  "data" : [
    {
      "id" : 1,
      "mentor_name" : "Jane Doe",
      "student_name" : "John Doe",
      "date" : "September 27 2024",
      "time": "3 PM",
      "field" : "Web Development"
    },
    {
      "id" : 2,
      "mentor_name" : "Jane Doe",
      "student_name" : "John Doe",
      "date" : "September 27 2024",
      "time": "3 PM",
      "field" : "Web Development"
    }
  ]
}
```

Response Body (Failed) :

```json
{
  "success" : false,
  "message" : "Unauthorized",
  "data": null
}
```

## Get Mentor By Id

Endpoint : GET /mentor/:mentorId

Headers :
- Authorization: token

Response Body (Success) :

```json
{
  "success" : true,
  "message": "Successfully get mentor data",
  "data" : {
    "username" : "johndoe",
    "phone" : "123456789",
    "name" : "John Doe",
    "field": "Web Development"
  }
}
```

Response Body (Failed) :

```json
{
  "success" : false,
  "message" : "Unauthorized",
  "data": null
}
```

## Get All Mentors

Endpoint : GET /mentor

Headers :
- Authorization: token

Response Body (Success) :

```json
{
    "success": true,
    "message": "Successfully get all mentor data",
    "data": [
        {
            "username": "johndoe",
            "phone": "123456789",
            "name": "John Doe",
            "field": "Web Development"
        },
        {
            "username": "janedoe",
            "phone": "123456789",
            "name": "Jane Doe",
            "field": "Web Development"
        }
    ]
}
```

Response Body (Failed) :

```json
{
  "success" : false,
  "message" : "Unauthorized",
  "data": null
}
```

## Logout Mentor

Endpoint : DELETE /mentor/logout

Headers :
- Authorization: token

Response Body (Success) :

```json
{
  "success" : true,
  "message": "Successfully logout mentor",
}
```

Response Body (Failed) :

```json
{
  "success" : false,
  "errors" : "Unauthorized"
}
```