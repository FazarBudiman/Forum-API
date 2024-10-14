class PostComment {
  constructor(payload) {
    this._verifyPayload(payload)

    const { content, owner, createdAt, threadsId, isDelete } = payload

    this.content = content
    this.owner = owner
    this.createdAt = createdAt
    this.threadsId = threadsId
    this.isDelete = isDelete
  }

  _verifyPayload({ content, owner, createdAt, threadsId, isDelete }) {
    if (!content || !owner || !createdAt || !threadsId) {
      throw new Error('POST_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }
    if (
      typeof content !== 'string' ||
      typeof owner !== 'string' ||
      typeof createdAt !== 'string' ||
      typeof threadsId !== 'string' ||
      typeof isDelete !== 'boolean'
    ) {
      throw new Error('POST_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = PostComment
