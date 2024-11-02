const pool = require("../src/Infrastructures/database/postgres/pool")

const LikesCommentTableTestHelper = {
    async checkLikedInComment ({commentId, userId}){
        const query = {
            text: 'SELECT * FROM likes_in_comment WHERE comments_id = $1 AND owner = $2',
            values:[commentId, userId]
        }
        const result = await pool.query(query)
        return result.rows
    },

    async checkLikeInCommentExist (id){
        const query = {
            text: 'SELECT * FROM likes_in_comment WHERE id = $1',
            values:[id]
        }
        const result = await pool.query(query)
        return result.rows
    },

    async likeComment({id, userId, commentId}){
        const query = {
            text: 'INSERT INTO likes_in_comment VALUES($1, $2, $3, true)',
            values:[id, userId, commentId]
        }
        await pool.query(query)
    },

    async unlikeComment(id){
        const query = {
            text: 'UPDATE likes_in_comment SET is_delete = false WHERE id = $1',
            values:[id]
        }
        await pool.query(query)
    },
    
    async cleanTable() {
        await pool.query(`DELETE FROM comments WHERE 1=1`)
      }
}

module.exports = LikesCommentTableTestHelper