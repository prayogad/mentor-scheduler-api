# Student API Spec

## Register Student

Request Body :

Endpoint : POST /student/register

```json
{
  "email" : "johndoe@example.com",
  "password" : "pass1234",
  "name" : "John Doe",
  "phone" : "123456789"
}
```

Response Body (Success) : 

```json
{
  "success" : true,
  "message": "Successfully register student",
  "data" : {
    "username" : "johndoe",
    "name" : "John Doe",
    "phone" : "123456789"
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

## Login Student

Endpoint : POST /student/login

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
  "message": "Successfully login student",
  "data" : {
    "username" : "johndoe",
    "name" : "John Doe",
    "phone" : "123456789",
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
    "date" : "September 27 2024",
    "time": "3 PM",
    "field" : "Web Development"
  }
}
```

Response Body (Failed) :

```json
{
  "success" : false,
  "message" : "Quota for the session has run out",
  "data": null
}
```

## Get Student Dashboard

Endpoint : GET /student/dashboard

Headers :
- Authorization: token

Response Body (Success) :

```json
{
  "success" : true,
  "message": "Successfully get student dashboard",
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

## Get Current Student

Endpoint : GET /student/current

Headers :
- Authorization: token

Response Body (Success) :

```json
{
  "success" : true,
  "message": "Successfully get current student",
  "data" : {
    "username" : "johndoe",
    "phone" : "123456789",
    "name" : "John Doe"
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

## Update Student

Endpoint : PATCH /student/update

Headers :
- Authorization: token

Request Body :

```json
{
  "password" : "pass1234", // optional
  "name" : "John Doe", // optional
  "phone" : "123456789" // optional
}
```

Response Body (Success) :

```json
{
  "success" : true,
  "message": "Successfully update student",
  "data" : {
    "email" : "johndoe@example.com",
    "name" : "John Doe",
    "phone" : "123456789",
  }
}
```

Response Body (Failed) :

```json
{
  "success" : false,
  "message" : "Password must be at least 6 characters long",
  "data": null
}
```

## Logout Student

Endpoint : DELETE /student/logout

Headers :
- Authorization: token

Response Body (Success) :

```json
{
  "success" : true,
  "message": "Successfully logout student",
}
```

Response Body (Failed) :

```json
{
  "success" : false,
  "errors" : "Unauthorized"
}
```