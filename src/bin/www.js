const app = require('../app');
const { DEV_PORT } = require('../common/config');
const { connectToDB } = require('../common/db/mongodb');

// const port = process.env.PORT || DEV_PORT;
const port = 8080;

app.listen(port, () =>
  console.log(`server listening at http://localhost:${port}`)
);

connectToDB();
