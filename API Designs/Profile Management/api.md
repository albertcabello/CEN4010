# API Design

* **POST** `/login`: Logs in a given user

  Body:
  ```
  {
  	"username": "alberto",
	"password": "alberto123"
  }
  ```

  Responses:
  - 200 `Accepted`
  - 400 `Failed`

* **POST** `/update`: Updates a users login information

  Body:
  ```
  {
  	"username": "alberto", //Can be the same as before 
	"password": "alberto1234" //Can't be the same as before
	"nickname": "albert"
  }
  ```
  Responses:
  - 200 `Accepted`
  - 400 `Failed`

* **POST** `/register`: Registers a user

  Body:
  ```
  {
  	"username": "alberto",
	"password": "alberto123",
	"email": "acabe019@fiu.edu",
	"nickname": "albert",
	"shipping": ["some address 1", "some address 2"]
  }
  ```
  Responses:
  - 200 `Accepted`
  - 400 `Failed`

* **POST** `/addcard`: Adds a credit card to the user account

  Body:
  ```
  {
  	"cardNumber": "123456789",
	"ccv": "222",
	"billingAddress": "some address",
	"name": "alberto",
	"expiration": "01/20",
	"cardName": "some card name, user decides"
  }
  ```

  Responses:
  - 200 `Accepted`
  - 400 `Failed`

* **GET** `/removecard/:cardName`: Removes a given cardName from the user account
