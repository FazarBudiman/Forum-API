const pool = require('../src/Infrastructures/database/postgres/pool')

const CommentsTableTestHelper = {
  async addComment({
    id,
    content = 'P balap',
    owner,
    threadsId,
    isDelete = false,
    createdAt = '2024-11-15'
  }) {
    const query = `INSERT INTO comments VALUES ('${id}', '${content}', '${owner}', '${threadsId}', '${isDelete}', '${createdAt}')`
    await pool.query(query)
  },

  async getCommentById(id) {
    const query = `SELECT * FROM comments WHERE id = '${id}'`
    const result = await pool.query(query)
    return result.rows
  },

  async checkCommentIsDeleted(id) {
    const query = `SELECT * FROM comments WHERE id = '${id}' AND is_delete = true`
    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable() {
    await pool.query(`DELETE FROM comments WHERE 1=1`)
  }
}

module.exports = CommentsTableTestHelper
