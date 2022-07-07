# AITC Software Engineering Internship Task

**Demo API server for a hypothetical commerce-based service.**

---

## Technologies used and concepts applied:
- NodeJS + Express API Server
- MongoDB Database + Mongoose ODM
- PassportJS Local Authentication 
- Heroku
---

## How to test/use
```bash 
npm i
echo "MONGODB_USER_URL=<your_mongodb_connection_string>" >> .env
echo "SESSION_SECRET=<your_secret_key>" >> .env
npm start
```
You can test the API endpoints using your favorite HTTP client (browser, vscode extention, postman, whatever).

---

## API Endpoints 
All endpoints start with `/api`. For a more detailed expected data types, please check [`/models`](/models)
- **POST** `/login` {username (use email), password}
- **POST** `/logout`
- **POST** `/register` {username, email, password}
- **GET** `/product` -- get all products
- **GET** `/product?name=` -- get a single product by full/partial(regex) match of product name
- **GET** `/product/:pid` -- get product by id
- **POST** `/product/add-one` {name, brand, description, images, categories, price, quantity} -- create a new product
- **DELETE** `/product/:pid` -- delete by id
- **PUT** `/product/:pid` -- update by id
