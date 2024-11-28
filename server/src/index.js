/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const express = require('express');
const app = express();
const port = 8080;

app.listen(port, () => {
  console.log(`서버가 실행됩니다. http://localhost:${port}`);
});
