const LikesCommentRepository = require('../../Domains/likesComment/LikesCommentRepository')

class LikesCommentRepositoryPostgres extends LikesCommentRepository  {
    constructor(pool, idGenerator) {
        super()
        this._pool = pool
        this._idGenerator = idGenerator
    }

    async likeComment(commentId, userId){
        const id = `like-${this._idGenerator()}`
        const query = {
            text:'INSERT INTO likes_in_comment VALUES($1, $2, $3, $4)',
            values:[id, userId, commentId, true]
        }
        await this._pool.query(query)
    }

    async unlikeComment(commentId, userId){
        const query = {
            text: 'UPDATE likes_in_comment SET is_liked = false WHERE comments_id = $1 AND owner = $2',
            values: [commentId, userId]
        }

        await this._pool.query(query)
    }

    async checkCommentIsLiked(commentId, userId){
        const query = {
            text: 'SELECT * FROM likes_in_comment WHERE comments_id = $1 AND owner = $2 AND is_liked = true',
            values:[commentId, userId]
        }
        const result = await this._pool.query(query)
        if (!result.rowCount) {
            return false
        } else {
            return true
        }
    }

    async getCountLikeInComment(commentId){
        const query = {
            text: 'SELECT COUNT(*) FROM likes_in_comment WHERE comments_id = $1 AND is_liked = true',
            values: [commentId]
        }
        const result = await this._pool.query(query)
        return result.rows[0].count
    }
}

module.exports = LikesCommentRepositoryPostgres