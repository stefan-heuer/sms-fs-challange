sms-fs-challange

## requirements

node >= v10.15.0

Running postgres server >= 9.5.14

## install

```
npm install
```

## build

```
npm run build
```

## Test

Before running tests you need to create the followig postgres user by running psql as postgres user

```
sudo su postgres
psql
```

and enter the following commands

```
DROP ROLE IF EXISTS conferences_event_repository;
CREATE USER conferences_event_repository WITH PASSWORD 'password';
ALTER USER conferences_event_repository CREATEDB;
```

To run the tests enter

```
npm test
```

## Start the server

Before starting the server you need to create the followig postgres user by running psql as postgres user

```
sudo su postgres
psql
```

and enter the following commands

```
DROP ROLE IF EXISTS conferences_event_repository;
CREATE USER conferences_event_repository WITH PASSWORD 'password';
```

and create the database

```
create database conferences_event;
grant all privileges on database conferences_event to conferences_event_repository;
```

### REST API

Base endpoint http://localhost:8000/api

#### Create example

Post /conference/
{
    "city": "Düssedlorf",
    "start_date": "3/7/2015",
    "end_date": "3/7/2015",
    "price": "156",
    "status": "Often",
    "color": "#2434"
}

Error codes 400 Bad service on wrong payload
All properties are required

response 200 OK example

{
    "id": 156
}

#### Read example

Get /conference/156

Error codes 404 Not Found on unknown id

response 200 OK example

{
    "id": 156,
    "city": "Düssedlorf",
    "start_date": "3/7/2015",
    "end_date": "3/7/2015",
    "price": "156",
    "status": "Often",
    "color": "#2434"
}

#### Update example

PUT /conference/156
{
    "city": "Düssedlorf",
    "start_date": "3/7/2015",
    "end_date": "3/7/2015",
    "price": "156",
    "status": "Often",
    "color": "#2434"
}

Error codes 404 Not Found on unknown id
All properties are optional

response 200 OK example

{
    "id": 156,
    "city": "Düssedlorf",
    "start_date": "3/7/2015",
    "end_date": "3/7/2015",
    "price": "156",
    "status": "Often",
    "color": "#2434"
}
