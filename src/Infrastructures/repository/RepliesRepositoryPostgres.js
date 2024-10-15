const PostedReplies = require("../../Domains/replies/entities/PostedReplies");
const RepliesRepository = require("../../Domains/replies/RepliesRepository");

class RepliesRepositoryPostgres extends RepliesRepository {
    constructor(pool, idGenerator){
        super()
        this._pool = pool
        this._idGenerator = idGenerator
    }

    async addReplies(postReplies){
        const { content, owner, threadsId, commentsId} = postReplies
        const id = `reply-${this._idGenerator()}`
        const query = `INSERT INTO replies VALUES('${id}', '${content}','${owner}', 'FALSE', NOW(), '${threadsId}', '${commentsId}') RETURNING id, content, owner`
        const result = await this._pool.query(query)
        return new PostedReplies({...result.rows[0]})

    }
}

module.exports = RepliesRepositoryPostgres;