const pool = require("../src/Infrastructures/database/postgres/pool")

const RepliesTableTestHelper = {
    async addReplies({id, content, owner, is_delete=false, date, threads_id, comments_id}){
        const query = `INSERT INTO replies VALUES('${id}', '${content}', '${owner}', '${is_delete}', '${date}', '${threads_id}' '${comments_id}')`
        await pool.query(query)
    },

    async getRepliesById(id){
        const query = `SELECT * FROM replies WHERE id = '${id}'`
        const result = await pool.query(query)
        return result.rows
    },

    async cleanTable(){
        await pool.query('DELETE FROM replies WHERE 1=1')
    }
}

module.exports = RepliesTableTestHelper;