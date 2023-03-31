# nest-auth-api <br/>
Simple nestjs authentication api<br/>
Database operations are done using TypeORM and MongoDB driver<br/>

# API Endpoints and HTTP Methods<br/>
API requires request `body` and/or `header` to have certain field(s) which will be used to validate, authenticate and authorize each request to the target endpoint.<br/>

## POST: '/signup'<br/>
Creates a new user or will return an error message if validation fails<br/>
User id and roles will be set after success full sign up<br/>
Password is hashed using `bcrypt`<br/>
Request `body`:<br/>
```
{  
    "email":"",  
    "password":"",    
    "firstName":"",  
    "lastName":"",  
    "address":""  
}  
```

## POST: '/login'<br/>
Generates a `token` for an existing user which is used to authenticate and authorize subsequent requests<br/>
Will return an error message if validation fails or user does not exist<br/>
Request `body`:<br/>
```
{  
    "email":"",  
    "password":""  
}  
```

## GET: '/hello' <br/>
Returns the details of the user making the request, does not return user's password<br/>
Only accessible to an authenticated user with role `USER`<br/>
Request `header`:<br/>
```
{  
    "Authorization":"Bearer token"
}  
````

## PATCH: '/update_user'<br/>
Updates the `address` field of the user making the request<br/>
Only accessible to an authenticated user with role `USER`<br/>
Request `header`:<br/>
```
{  
    "Authorization":"Bearer token"
}  
```
Request `body`:<br/>
```
{    
    "address":""  
}  
```

## GET: '/all_users'<br/>
Returns all users that have signed up, without their passwords<br/>
Only accessible to an authenticated admin with role `ADMIN`<br/>
Request `heade`r:<br/>
```
{  
    "Authorization":"Bearer token"
}  
```

### To Run this project Clone it and install modules using:<br/>
```
npm install  
```

Then Create .env file add:<br/>
```
`JWT_SIGN` : jwt secret, 
`ADMIN_EMAIL` : an admin email, 
`MONGO_CONNECTION` : mongodb connection string, 
`MONGO_DATABASE` : database name 
```

variables and specify values to each.<br/>
Value specified to `ADMIN_EMAIL` will be used to add `ADMIN` role to a user <br/>
That's it. You are ready to go. To execute this project run:<br/>

```
npm run start:dev  
```

That's it for now!