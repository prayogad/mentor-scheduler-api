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
  "message": "successfully create user",
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
  "message": "successfully login user",
  "data" : {
    "id": 1,
    "email" : "johndoe@example.com",
    "name" : "John Doe",
    "phone" : "123456789",
    "role": "mentor" | "student",
    "access_token": "jwt-access-token",
    "refresh_token": "jwt-refresh-token"
  }
}
```

## Refresh User Access Token

Endpoint : POST /user/refresh-token

Cookies :
- refreshToken: jwt-refresh-token

Response Body (Success) :

```json
{
  "success" : true,
  "message": "successfully login user",
  "data" : {
    "id": 1,
    "email" : "johndoe@example.com",
    "name" : "John Doe",
    "phone" : "123456789",
    "role": "mentor" | "student",
    "access_token": "jwt-access-token",
    "refresh_token": "jwt-refresh-token"
  }
}
```

## Get Current User

Endpoint : GET /user/api/current

Request Headers :
- Authorization : jwt-access-token

Cookies :
- refreshToken: jwt-refresh-token

Response Body (Success) :

```json
{
  "success" : true,
  "message": "successfully get user",
  "data" : {
    "id": 1,
    "email": "johndoe@example.com",
    "name" : "John Doe",
    "phone" : "123456789",
    "role": "mentor" | "student"
  }
}
```

## Update User Data

Endpoint : PUT /user/api/update

Request Headers :
- Authorization : jwt-access-token

Cookies :
- refreshToken: jwt-refresh-token

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
    "id": 1,
    "email" : "johndoe@example.com",
    "name" : "John Doe",
    "phone" : "123456789",
    "role": "mentor" | "student"
  }
}
```

## Get User Dashboard

Endpoint : GET /user/api/dashboard

Request Headers :
- Authorization : jwt-access-token

Cookies :
- refreshToken: jwt-refresh-token

Response Body (Success) :

```json
{
  "success" : true,
  "message": "successfully get user dashboard",
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

Endpoint : POST /user/logout

Request Headers :
- Authorization : jwt-access-token

Cookies :
- refreshToken: jwt-refresh-token

Response Body (Success) :

```json
{
  "success" : true,
  "message": "successfully logout user",
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