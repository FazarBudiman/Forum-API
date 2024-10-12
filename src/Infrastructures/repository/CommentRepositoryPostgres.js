const CommentRepository = require('../../Domains/comments/CommentRepository')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const PostedComment = require('../../Domains/comments/entities/PostedComment')

class CommentRepositoryPostgres extends CommentRepository{
    constructor(pool, idGenerator){
        super()
        this._pool = pool
        this._idGenerator = idGenerator
    }

    async addComment(postComment){
        const {content, owner, createdAt, threadsId, isDelete} = postComment
        const id = `comment-${this._idGenerator()}`
        const query = `INSERT INTO comments VALUES ('${id}', '${content}', '${owner}', '${threadsId}', '${isDelete}', '${createdAt}') RETURNING id, content, owner`
        const result = await this._pool.query(query)
        return new PostedComment({...result.rows[0]})
    }

    async checkThreadIsExist(id){
        const query = `SELECT * FROM threads WHERE id = '${id}'`
        const result = await this._pool.query(query)
        if (result.rowCount === 0) {
            throw new NotFoundError('Threads tidak ada')
        }
        
    }
}

module.exports = CommentRepositoryPostgres;