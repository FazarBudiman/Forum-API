/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const UsersTableTestHelper = {
  async addUser({
    id = 'user-123', username = 'dicoding', password = 'secret', fullname = 'Dicoding Indonesia',
  }) {
    const query = `INSERT INTO users VALUES('${id}', '${username}', '${password}', '${fullname}')`
    await pool.query(query);
  },

  async findUsersById(id) {
    const query = `SELECT * FROM users WHERE id = '${id}'`
    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM users WHERE 1=1');
  },
};

module.exports = UsersTableTestHelper;
