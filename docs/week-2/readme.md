# Week 2

## Endpoints

Web login flow:

`GET /signup` - Show registration page
`POST /signup` - Register
`GET /login` - Show login page
`POST /login` - Login
`GET /logout` - Perform Logout

OAuth Flow:
`POST /api/oauth/authorize` - Authorize Client
```
{
    "clientId": "c61df35f-8fd4-4599-9a4d-18262c8ee671", 
    "clientSecret": "task-tracker-client-secret", 
}
```
Response
```
{
    "clientId": "c61df35f-8fd4-4599-9a4d-18262c8ee671",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXRhZGF0YSI6ImNsaWVudF9tZXRhZGF0YSIsImlhdCI6MTcwOTI5NzIzNCwiZXhwIjoxNzA5Mjk3NDE0fQ.j_JohFfZjJJ7Np-PMl_fq-5O3X7FY0E4ym0nNVsYs6A"
}
```

`POST /api/oauth/verify` - Verify token
```
{
    "clientId": "c61df35f-8fd4-4599-9a4d-18262c8ee671",
    "metadata": "client_metadata",
    "iat": 1709341275
}
```
