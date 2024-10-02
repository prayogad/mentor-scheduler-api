# Mentor API Spec

## Create or Update Mentor Profile

Endpoint : PUT /mentor/api/profile

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
  "message": "Successfully update mentor profile",
  "data" : {
    "id": 1,
    "email" : "johndoe@example.com",
    "name" : "John Doe",
    "field" : "Web Development",
    "bio" : "I am mentor...."
  }
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

Headers :
- Authorization: token

Response Body (Success) :

```json
{
    "success": true,
    "message": "Successfully get all mentor data",
    "data": [
        {
            "email": "johndoe@example.com",
            "phone": "123456789",
            "name": "John Doe",
            "field": "Web Development",
            "bio": "I am mentor..."
        },
        {
            "email": "janedoe@example.com",
            "phone": "123456789",
            "name": "Jane Doe",
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
  "message" : "Unauthorized",
  "data": null
}
```