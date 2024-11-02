const CommentRepository = require('../../Domains/comments/CommentRepository')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const PostedComment = require('../../Domains/comments/entities/PostedComment')
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addComment(postComment) {
    const { content, owner, threadsId } = postComment
    const id = `comment-${this._idGenerator()}`
    const query = {
      text: 'INSERT INTO comments(id, content, owner, threads_id) VALUES ($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, owner, threadsId]
    } 
    const result = await this._pool.query(query)
    return new PostedComment({ ...result.rows[0] })
  }

  async checkCommentIsExist(commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId]
    } 
    const result = await this._pool.query(query)
    if (result.rowCount === 0) {
      throw new NotFoundError('Comment tidak ada')
    }
  }

  async checkCommentOwner(commentId, commentOwnerId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, commentOwnerId]
    }
    const result = await this._pool.query(query)
    if (result.rowCount === 0) {
      throw new AuthorizationError(
        'Comment tidak bisa dihapus, sebab bukan pemilik'
      )
    }
  }

  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [commentId]
    }
    await this._pool.query(query)
  }

  async getCommentInThread(threadId) {
    const query = {
      text: `SELECT c.id, u.username, c.date, c."content", c.is_delete FROM comments c  
                RIGHT JOIN threads t ON c.threads_id = t.id 
                RIGHT JOIN users u ON c."owner" = u.id 
                WHERE t.id  = $1 
                ORDER BY c.date ASC`,
      values: [threadId]
    }
    const result = await this._pool.query(query)
    return result.rows
  }
}

module.exports = CommentRepositoryPostgres
