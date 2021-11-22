## Information.

This Project Implement From branch **boilerplate-v.1.0.0** .

## Feature

- [x] Ready To Run.
- [x] Postgres Database as Container.
- [x] Config Service
- Read and Ensure .env variable.
- [x] .env Sample.
- [x] Connect Postgres Database.

### MVPs Feature

- [ ] Todo ER Diagram.
- [ ] Authentication
- [ ] Todo.
- [ ] Assign Member.

#### Authentication

- [ ] Register member.
- [ ] Login With Username and Password.
- Return JWT Token.
- [ ] Get Member Profile From JWT Token.
- [ ] validate JWT Token In header **X-Member**

---

## How To Guide.

### Pre Requisite

- docker and docker-compose
- node.js
- nest.js cli

### Prepare Project

1.  Clone Boilerplate Project.
    ```shell
    get clone https://github.com/DrZIn-dev/nest.js_mongo_k8s.git
    ```
2.  Run Project.
    ```
    npm install
    npm run start:dev
    ```
3.  Run Database As Container.
    ```
    docker-compose up -d
    ```

---
