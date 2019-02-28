# Database Design

Table Name: users

| id | username | password | email | nickname | shipping | defaultShipping |
| --- | --- | --- | --- | --- | --- | --- |

Table Name: credits

| id | credit card | 
| --- | --- |

Table Name: addresses

| id | fullName | firstLine | secondLine | city | state | zip | instr | code |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

Table Name: userAddresses

| userId | addressId | 
| ------ | --------- |
