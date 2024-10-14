class PostComment {
  constructor(payload) {
    this._verifyPayload(payload)

    const { content, owner, threadsId} = payload

    this.content = content
    this.owner = owner
    this.threadsId = threadsId
  }

  _verifyPayload({ content, owner, threadsId}) {
    if (!content || !owner || !threadsId) {
      throw new Error('POST_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }
    if (
      typeof content !== 'string' ||
      typeof owner !== 'string' ||
      typeof threadsId !== 'string'
    ) {
      throw new Error('POST_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = PostComment
