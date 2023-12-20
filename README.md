# INFO-7255: Adv Big Data Indexing Techniques

## Distributed-Software-Systems: Demo-03

This RESTful API project is a powerful and flexible solution, capable of handling structured JSON data with a comprehensive range of features. It supports CRUD operations, including advanced functionalities like PATCH support and cascaded delete. The API is designed with robust validation and security mechanisms, utilizing a JSON schema for data modeling, and integrates seamlessly with Elastic for search operations, including parent-child indexing.

## Features
- **Supports CRUD operations**: Full support for Create, Read, Update (with Patch support), and Delete (with cascaded delete).
- **Advanced conditional operations**: Update if not changed, conditional read, and conditional write.
- **JSON Schema validation** for data models.
- Data storage in a key-value store (Redis) for efficient data management.
- **Search Capabilities**: Leverages Elastic Search with support for join operations and parent-child indexing.
- **Queueing Mechanism**: Efficient handling of requests and data processing.
- **Security**: Robust security protocols to ensure data safety and integrity.

## Automated Setup

To install all application dependencies [Elasticsearch, Kibana and RabbitMQ], use the `docker-compose.yml` file to deploy all application dependencies using `docker compose`.

1. Create the cluster
   
   ```
   docker compose up
   ```
2. To delete the cluster and the network:
   
   ```
   docker compose down
   ```
3. The default username and password for RabbitMQ is defined in the `docker-compose.yml` file.
   - default username: `guest`
   - default password: `guest`
  
4. The following is a list of the endpoints for the dependencies being created in docker:
   - Elasticsearch: http://localhost:9200
   - Kibana: http://localhost:5610
   - RabbitMQ: http://localhost:15672

## Token Generation Security

### Generating a Private and Public Key Pair

1. **Generate the Key Pair**:
   - Run the command: `openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048`
   - Generate the public key from this private key using: `openssl rsa -pubout -in private_key.pem -out public_key.pem`
   - Keep your private key secure and never expose it publicly.
  
2. **Key Storage**:
   - Store the private key in a secure location on your server. It will be used to sign your tokens.
   - The public key can be distributed to clients or services that need to verify the token's authenticity.

### Generating Tokens

1. **Token Creation**:
   - Use a JWT (JSON Web Token) library to create a token.
   - Include necessary claims in the token payload, such as the user's identity, token issuance time, and expiration time.
   - Sign the token using your private key.

2. **Token Verification**:
   - When a client sends a token for authentication, use the public key to verify the token's signature.
   - Ensure that the token is not expired and that the payload matches the expected format and values.

## Data Model
The data model for this API is defined by the following JSON schema:

```
{
    "planCostShares": {
        "deductible": 2000,
        "_org": "example.com",
        "copay": 23,
        "objectId": "1234vxc2324sdf-501",
        "objectType": "membercostshare"
    },
    "linkedPlanServices": [
        {
            "linkedService": {
                "_org": "example.com",
                "objectId": "1234520xvc30asdf-502",
                "objectType": "service",
                "name": "Yearly physical"
            },
            "planserviceCostShares": {
                "deductible": 10,
                "_org": "example.com",
                "copay": 0,
                "objectId": "1234512xvc1314asdfs-503",
                "objectType": "membercostshare"
            },
            "_org": "example.com",
            "objectId": "27283xvx9asdff-504",
            "objectType": "planservice"
        },
        {
            "linkedService": {
                "_org": "example.com",
                "objectId": "1234520xvc30sfs-505",
                "objectType": "service",
                "name": "well baby"
            },
            "planserviceCostShares": {
                "deductible": 10,
                "_org": "example.com",
                "copay": 175,
                "objectId": "1234512xvc1314sdfsd-506",
                "objectType": "membercostshare"
            },
            "_org": "example.com",
            "objectId": "27283xvx9sdf-507",
            "objectType": "planservice"
        }
    ],
    "_org": "example.com",
    "objectId": "12xvxc345ssdsds-508",
    "objectType": "plan",
    "planType": "inNetwork",
    "creationDate": "12-12-2017"
}
```

## Data Storage
The data is stored in a key-value store using Redis.

> [!WARNING]
> Never expose your private key. It should only be known to the server.

## License
This project is licensed under the [MIT License](LICENSE)

## Author
[Siddharth Gargava](mailto:gargavasiddharth@gmail.com)