const PostedThread = require('../../Domains/thread/entities/PostedThread')
const ThreadRepository = require('../../Domains/thread/ThreadRepository')

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
}

module.exports = ThreadRepositoryPostgres;