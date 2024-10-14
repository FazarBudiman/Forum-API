class PostThread {
  constructor(payload) {
    this._verifyPayload(payload)

    const { title, body, owner, createdAt } = payload

    this.title = title
    this.body = body
    this.owner = owner
    this.createdAt = createdAt
  }

  _verifyPayload({ title, body, owner, createdAt }) {
    if (!title || !body || !owner || !createdAt) {
      throw new Error('POST_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (
      typeof title !== 'string' ||
      typeof body !== 'string' ||
      typeof owner !== 'string' ||
      typeof createdAt !== 'string'
    ) {
      throw new Error('POST_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = PostThread
