
# Backend Take Home Challenge


## Running 
Ensure you have docker compose installed on your system and run  this in the terminal

``` bash 
docker-compose up
```

This will start both the database(postgres) and the rest API. The REST api will be reachable on port 5000. 


## Using The REST api 
The REST api allows users to create, edit, delete and view diagnostic records.  The table below summarizes the api. On success, the server returns 
standard http status code and on failure, the server adds an additional application specific error code to the response as described in table 2. All api responses are in json and the structure is described in table 3. 


Table 1.0
------------ 

| Action     | Method | Endpoint                                    | Body                                                                     | Notes                                                                                                             |
|------------|--------|---------------------------------------------|--------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| Create     | POST   | `/api/v1/diagnostic_records`                |  `full_code`, `revision`, `short_desc`, `full_desc`, `category_name`     |                                                                                                                   |
| Edit       | PUT    | `/api/v1/diagnostic_records/:id`            | `full_code?`, `revision?`, `short_desc?`, `full_desc?`, `category_name?` | 1. All fields are optional but at least one field must  be submitted                                              |
| Delete     | DELETE | `/api/v1/diagnostic_records/:id`            |                                                                          |                                                                                                                   |
| Find By ID | GET    | `/api/v1/diagnostic_records/:id`            |                                                                          |                                                                                                                   |
| List       | GET    | `/api/v1/diagnostic_records/?page={number=1}` |                                                                          | The server returns extra information such as the totalPageCount, currentPage, and the number of entries per page. |


Table 2.0
-----------

| Error code|Description|
|----------|-------------|
|E_VALIDATION | Form/query validation failed |
|E_DUPLICATE | Attempt to add an item that already exists     |
|E_NOT_FOUND  | Attmpted to retrieve or delete a non-existing item | 
|E_UNKNOWN | An unknown error occured |


Table 3.0
---------

|name|description|notes|
|------|----|-------|
|status| the http status code||
|code|the application specific error code|only available when a request errs|
|message|A short description of the response (useful when a request errs)| 
|totalPageCount|the total number of pages| only for list requests (see above)|
|page| the current page|only for list requests|
|value|response data| only exists in `list,findById,edit`
|err|When a requests err, the server sends the error stack to the client | only in development| 



## Testing

1. Ensure that there's a running postgres instance and check that following set up exists
 1. database named `mpharma` exists
 2. postgres user named `postgres` with password `postgres` exists

2. Jump into the project root and run the following in your terminal:
	
   ``` bash
   	npm install --dev 
   	npm install npx typescript -g 
   	npm run migrate
   	npm test 
   ```


## Technical Consideration

I made a few tradeoffs worth m

