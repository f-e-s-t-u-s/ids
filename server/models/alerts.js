import logger from '../config/logger.js';
import dbConnection from '../config/database.js';

// Execute query function
const executeQuery = async (query, params = []) => {
  try {
    const db = await dbConnection;
    const stmt = await db.prepare(query);
    const result = await stmt.all(...params);
    await stmt.finalize();
    return result;
  } catch (error) {
    logger.error('Error occurred executing query:', error);
    throw error;
  }
};

class Anomalies {
  async getAnomalies(packets_type) {
    try {
      const query = `
        SELECT * FROM packets WHERE anomaly_flag = ?
      `;
      const params = [packets_type];

      const response = await executeQuery(query, params);
      console.log(response);
      return response;
    } catch (error) {
      logger.error('An error occurred', error);
      throw error;
    }
  }
}

export default Anomalies;
