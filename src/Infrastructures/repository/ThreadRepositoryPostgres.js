const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const PostedThread = require('../../Domains/threads/entities/PostedThread')
const ThreadRepository = require('../../Domains/threads/ThreadRepository')

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addThread(postThread) {
    const { title, body, owner } = postThread
    const id = `thread-${this._idGenerator()}`
    const query = {
      text: 'INSERT INTO threads(id, title, body, owner) VALUES ($1, $2, $3, $4) RETURNING id, title, owner',
      values: [id, title, body, owner]
    } 
    const result = await this._pool.query(query)
    return new PostedThread(result.rows[0])
  }

  async checkThreadIsExist(id) {
    const query = `SELECT * FROM threads WHERE id  = '${id}'`
    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Threads tidak ada')
    }
  }

  async getDetailThread(id) {
    const query = `SELECT t.id, t.title, t.body, t.date, u.username  FROM threads t right join users u  on t.owner  = u.id  WHERE t.id  = '${id}'`
    const result = await this._pool.query(query)
    return result.rows[0]
  }
}

module.exports = ThreadRepositoryPostgres
