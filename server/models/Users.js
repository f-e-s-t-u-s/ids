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
    console.error('Error executing query:', error);
    throw error;
  }
};

class Users {
  async findUserByEmail(email) {
    try {
      const query = `
        SELECT * FROM users WHERE email = ?
      `;
      const params = [email];
      const response = await executeQuery(query, params);
      return response ? response[0] : null;
    } catch (error) {
      logger.error('Error occurred executing query', error);
      throw error;
    }
  }

  async registerUser(data) {
    try {
      const query = `
        INSERT INTO users (name, company_name, email, password) VALUES (?, ?, ?, ?)
      `;
      const params = [data.name, data.company_name, data.email, data.password];
      const response = await executeQuery(query, params);
      return response;
    } catch (error) {
      logger.error('Error occurred executing query', error);
      throw error;
    }
  }

  async updateUserPassword(data) {
    try {
      const query = `
        UPDATE users
        SET password = ?
        WHERE user_id = ?
      `;
      const params = [data.password, data.user_id];
      const response = await executeQuery(query, params);
      return response;
    } catch (error) {
      logger.error('Error occurred executing query', error);
      throw error;
    }
  }

  async createForgotPasswordCode(data) {
    try {
      const query = `
        INSERT INTO forgotpasswordcodes (user_id, reset_code, expiration_time, creation_timestamp, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const params = [
        data.user_id,
        data.reset_code,
        data.expiration_time,
        data.creation_timestamp,
        data.ip_address,
        data.user_agent
      ];
      const response = await executeQuery(query, params);
      return response;
    } catch (error) {
      logger.error('Error occurred executing query', error);
      throw error;
    }
  }
  async createUserCode(userId, code) {
    const query = "INSERT INTO codes (userId,code) VALUES (?,?)";
    const result = await executeQuery(query, [userId, code]);
    return result;
  };

  // delete old codes
  async deleteVerifyOldCodes(userId) {
    const query = "DELETE FROM forgotpasswordcodes WHERE user_id = ?";
    const result = await executeQuery(query, [userId]);
    return result;
  };
}

export default Users;
