# Mentor API Spec

## Create or Update Mentor Profile

Endpoint : PUT /mentor/api/profile

Request Headers :
- Authorization : jwt-access-token

Cookies :
- refreshToken: jwt-refresh-token

Request Body :

```json
{
  "field" : "Web Development",
  "bio" : "I am mentor...."
}
```

Response Body (Success) :

```json
{
  "success" : true,
  "message": "successfully update mentor profile",
  "data" : {
    "id": 1,
    "email" : "johndoe@example.com",
    "name" : "John Doe",
    "phone": "12345678",
    "field" : "Web Development",
    "bio" : "I am mentor...."
  }
}
```

## Get Mentor By Id

Endpoint : GET /mentor/:mentorId

Response Body (Success) :

```json
{
  "success" : true,
  "message": "successfully get mentor by id",
  "data" : {
    "id": 1,
    "email" : "johndoe@example.com",
    "phone" : "123456789",
    "name" : "John Doe",
    "field": "Web Development",
    "bio": "I am mentor..."
  }
}
```

## Get All Mentors

Endpoint : GET /mentor

Response Body (Success) :

```json
{
    "success": true,
    "message": "successfully get all mentors",
    "data": [
        {
            "id": 1,
            "email": "johndoe@example.com",
            "name": "John Doe",
            "phone": "123456789",
            "field": "Web Development",
            "bio": "I am mentor..."
        },
        {
            "id": 2,
            "email": "janedoe@example.com",
            "name": "Jane Doe",
            "phone": "123456789",
            "field": "Machine Learning",
            "bio": "I am mentor..."
        }
    ]
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