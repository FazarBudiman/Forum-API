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
    const query = {
      text: 'INSERT INTO replies(id, content, owner, threads_id, comments_id) VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, owner, threadsId, commentsId]
    }
    const result = await this._pool.query(query)
    return new PostedReplies({ ...result.rows[0] })
  }

  async checkRepliesIsExist(replyId) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [replyId]
    }
    const result = await this._pool.query(query)
    if (result.rowCount === 0) {
      throw new NotFoundError('Replies tidak ada')
    }
  }

  async checkRepliesOwner(replyId, replyOwnerId) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1 AND owner = $2',
      values: [replyId, replyOwnerId]
    } 
    const result = await this._pool.query(query)
    if (result.rowCount === 0) {
      throw new AuthorizationError(
        'Replies tidak bisa dihapus, sebab bukan pemilik'
      )
    }
  }

  async deleteReplies(replyId) {
    const query = {
      text: 'UPDATE replies SET is_delete = TRUE WHERE id = $1',
      values: [replyId]
    } 
    await this._pool.query(query)
  }

  async getRepliesInComment(commentId) {
    const query = {
      text:`SELECT r.id, u.username, r.date, r."content", r.is_delete FROM replies r
              INNER join comments c on r.comments_id = c.id
              INNER JOIN users u ON r."owner" = u.id 
              WHERE c.id  = $1 ORDER BY r.date asc`,
      values: [commentId]
    } 

    const result = await this._pool.query(query)
    return result.rows
  }
}

module.exports = RepliesRepositoryPostgres
