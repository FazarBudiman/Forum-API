const pool = require("../src/Infrastructures/database/postgres/pool")

const  CommentsTableTestHelper = {

    async getCommentById(id){
        const query = `SELECT * FROM comments WHERE id = '${id}'`
        const result = await pool.query(query)
        return result.rows
    },
    async cleanTable(){
        await pool.query(
            `DELETE FROM comments WHERE 1=1`
        )
    }
}

module.exports = CommentsTableTestHelper;