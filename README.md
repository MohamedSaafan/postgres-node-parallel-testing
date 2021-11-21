# Parallel Testing with jest

To run the migration in the **windows powershell**
just type the following

`$env:DATABASE_URL="postgres://your_database_username:_your_database_password@localhost/_your_database_name_`; npm run migrate up

---

## solution for the parallel behavior for testing our database

- Create a database for each file

  - but that would have a very big downside to it which is the pain of creating the database itself and writing migrations for each database

- Create a separate schema for each file

---

## Search Path

that feature is used to customize the default schema if no schema provided in the query.

so if you wrote that `SELECT * FROM USERS` which schema will the engine looks into? in most cases the default is the `public schema` but you can custoize that behavior

## `search_path = "$user" public`

---

## setting `search_path`

`SET search_path TO user_name,default_schema_name`

The above line tells postgres to access the `public` schema if no schema provided but if the user name was `user`
