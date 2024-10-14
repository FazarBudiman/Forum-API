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
    const { title, body, owner} = postThread
    const id = `thread-${this._idGenerator()}`
    const query = `INSERT INTO threads VALUES ('${id}', '${title}', '${body}', '${owner}', NOW()) RETURNING id, title, owner`
    const result = await this._pool.query(query)
    return new PostedThread({ ...result.rows[0] })
  }

  async checkThreadIsExist(id) {
    const query = `SELECT t.id, t.title, t.body, t."createdAt" as date, u.username  FROM threads t right join users u  on t.owner  = u.id  WHERE t.id  = '${id}'`
    const result = await this._pool.query(query)
    if (result.rowCount === 0) {
      throw new NotFoundError('Threads tidak ada')
    }
    return result.rows[0]
  }
}

module.exports = ThreadRepositoryPostgres