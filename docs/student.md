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
  "errors" : "Email is already taken"
}
```

## Login User

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
  "errors" : "Username or password incorrect"
}
```

## Book Mentoring Session

Endpoint : POST /student/bookSession

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
  "errors" : "Quota for the session has run out"
}
```

## Get Student Dashboard

Endpoint : GET /student/dashboard

Headers :
- Authorization: token

Response Body (Success) :

```json
{
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
  "errors" : "Unauthorized"
}
```

## Get Current Student

Endpoint : GET /student/current

Headers :
- Authorization: token

Response Body (Success) :

```json
{
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
  "errors" : "Unauthorized"
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
  "errors" : "Password must be at least 6 characters long"
}
```

## Logout Student

Endpoint : DELETE /student/logout

Headers :
- Authorization: token

Response Body (Success) :

```json
{
  "data" : true
}
```

Response Body (Failed) :

```json
{
  "errors" : "Unauthorized"
}
```