# User API Spec

## Register User

Request Body :

Endpoint : POST /user/register

```json
{
  "email" : "johndoe@example.com",
  "password" : "pass1234",
  "name" : "John Doe",
  "phone" : "123456789",
  "roles": "mentor" | "student"
}
```

Response Body (Success) : 

```json
{
  "success" : true,
  "message": "Successfully register user",
  "data" : {
    "id": 1,
    "email" : "johndoe@example.com",
    "name" : "John Doe",
    "phone" : "123456789",
    "roles": "mentor" | "student"
  }
}
```

## Login User

Endpoint : POST /user/login

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
  "message": "Successfully login user",
  "data" : {
    "id": 1,
    "email" : "johndoe@example.com",
    "name" : "John Doe",
    "phone" : "123456789",
    "roles": "mentor" | "student",
    "token": "uuid
  }
}
```

## Get Current User

Endpoint : GET /user/current

Headers :
- Authorization: token

Response Body (Success) :

```json
{
  "success" : true,
  "message": "Successfully get current user",
  "data" : {
    "username" : "johndoe",
    "phone" : "123456789",
    "name" : "John Doe",
    "roles": "mentor" | "student"
  }
}
```

## Update User Data

Endpoint : PUT /user/update

Headers :
- Authorization: token

Request Body :

```json
{
  "email": "johndoe@example.com", // optional
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

## Get User Dashboard

Endpoint : GET /user/dashboard

Headers :
- Authorization: token

Response Body (Success) :

```json
{
  "success" : true,
  "message": "Successfully get user dashboard",
  "data" : [
    {
      "mentor_name" : "Jane Doe",
      "student_name" : "John Doe",
      "scheduledAt" : "2024-09-28 12:34:56",
      "field" : "Web Development"
    },
    {
      "mentor_name" : "Jane Doe",
      "student_name" : "John Doe",
      "scheduledAt" : "2024-09-28 12:34:56",
      "field" : "Web Development"
    }
  ]
}
```

## Logout User

Endpoint : DELETE /user/logout

Headers :
- Authorization: token

Response Body (Success) :

```json
{
  "success" : true,
  "message": "Successfully logout user",
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