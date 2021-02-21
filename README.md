# Walmart Challenge

[Demo](https://walmart-challenge-node.herokuapp.com/)

https://walmart-challenge-node.herokuapp.com/

# How to run

# with Docker

This will build a container for `mongodb` with products collection provision and `app`, then it will run both containers

You can access your [docker](localhost:3000) (http://localhost:3000)

```
docker-compose up -d 
```

### If something goes wrong, please use
```
docker-compose down
docker-compose up -d 
```

## To run Unit and Integration Tests
```
docker exec -i -t walmart_app_1 /bin/bash
npm run test
```
## To generate test coverage
```
npm run test-with-coverage
```

# Without Docker

Use the package manager npm

```
cd app
npm install
```

## Usage

```
npm run develop
```

## To run Unit and Integration Tests

```
npm run test
```

## To generate test coverage
```
npm run test-with-coverage
open coverage/index.html
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)