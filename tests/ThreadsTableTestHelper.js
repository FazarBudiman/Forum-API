const pool = require('../src/Infrastructures/database/postgres/pool')

const ThreadsTableTestHelper = {
    async addThread({
        id = 'thread-12345', title = 'Senin', body = 'Hari ini adalah hari senin', owner = 'user-123', createdAt = '2024-11-12'
    }) {
        const query = `INSERT INTO threads ('${id}', '${title}', '${body}', '${owner}', ${createdAt})`

        await pool.query(query)
    },

    async getThreadDetail(id){
        const query = `SELECT * FROM threads WHERE id = '${id}'`
        const result = await pool.query(query)
        return result.rows
    },

    async cleanTable(){
        await pool.query('DELETE FROM users WHERE 1=1')
    }
}

module.exports = ThreadsTableTestHelper;