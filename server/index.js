import app from './express.js'
import logger from './config/logger.js';

const port = 3000;
// start server
app.listen(port, () => {
    logger.info(`Server started on http://localhost:${port}`);
  });
