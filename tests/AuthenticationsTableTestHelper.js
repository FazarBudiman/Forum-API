/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const AuthenticationsTableTestHelper = {
  async addToken(token) {
    const query = `INSERT INTO authentications VALUES('${token}')`
    await pool.query(query)
  },

  async findToken(token) {
    const query = `SELECT token FROM authentications WHERE token = '${token}'`
    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable() {
    await pool.query('DELETE FROM authentications WHERE 1=1')
  }
}

module.exports = AuthenticationsTableTestHelper
