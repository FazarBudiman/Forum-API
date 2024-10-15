const pool = require('../src/Infrastructures/database/postgres/pool')

const ThreadsTableTestHelper = {
  async addThread({
    id,
    title = 'Senin',
    body = 'Hari ini adalah hari senin',
    owner,
    date = '2024-11-12'
  }) {
    const query = `INSERT INTO threads VALUES ('${id}', '${title}', '${body}', '${owner}', '${date}')`
    await pool.query(query)
  },

  async getThreadDetail(id) {
    const query = `SELECT * FROM threads WHERE id = '${id}'`
    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1')
  }
}

module.exports = ThreadsTableTestHelper
