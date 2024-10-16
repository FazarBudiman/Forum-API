const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const PostedReplies = require('../../Domains/replies/entities/PostedReplies')
const RepliesRepository = require('../../Domains/replies/RepliesRepository')

class RepliesRepositoryPostgres extends RepliesRepository {
  constructor(pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addReplies(postReplies) {
    const { content, owner, threadsId, commentsId } = postReplies
    const id = `reply-${this._idGenerator()}`
    const query = `INSERT INTO replies VALUES('${id}', '${content}','${owner}', 'FALSE', NOW(), '${threadsId}', '${commentsId}') RETURNING id, content, owner`
    const result = await this._pool.query(query)
    return new PostedReplies({ ...result.rows[0] })
  }

  async checkRepliesIsExist(replyId) {
    const query = `SELECT * FROM replies WHERE id = '${replyId}'`
    const result = await this._pool.query(query)
    if (result.rowCount === 0) {
      throw new NotFoundError('Replies tidak ada')
    }
  }

  async checkRepliesOwner(replyId, replyOwnerId) {
    const query = `SELECT * FROM replies WHERE id = '${replyId}' AND owner = '${replyOwnerId}'`
    const result = await this._pool.query(query)
    if (result.rowCount === 0) {
      throw new AuthorizationError(
        'Replies tidak bisa dihapus, sebab bukan pemilik'
      )
    }
  }

  async deleteReplies(replyId) {
    const query = `UPDATE replies SET is_delete = TRUE WHERE id = '${replyId}'`
    await this._pool.query(query)
  }

  async getRepliesInComment(commentId) {
    const query = `SELECT r.id, u.username, r.date, r."content", r.is_delete FROM replies r
				INNER join comments c on r.comments_id = c.id
                INNER JOIN users u ON r."owner" = u.id 
                WHERE c.id  = '${commentId}'
                ORDER BY r.date asc`

    const result = await this._pool.query(query)
    return result.rows
  }
}

module.exports = RepliesRepositoryPostgres
