const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const PostedThread = require('../../Domains/threads/entities/PostedThread')
const ThreadRepository = require('../../Domains/threads/ThreadRepository')

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator){
        super()
        this._pool = pool
        this._idGenerator = idGenerator
    }

    async addThread(postThread){
        const {title, body, owner, createdAt } = postThread
        const id = `thread-${this._idGenerator()}`
        const query = `INSERT INTO threads VALUES ('${id}', '${title}', '${body}', '${owner}', '${createdAt}') RETURNING id, title, owner`
        const result = await this._pool.query(query)
        return new PostedThread({...result.rows[0]})
    }

    async checkThreadIsExist(id){
        const query = `SELECT * FROM threads WHERE id = '${id}'`
        const result = await this._pool.query(query)
        if (result.rowCount === 0) {
            throw new NotFoundError('Threads tidak ada')
        }
    }
}

module.exports = ThreadRepositoryPostgres;