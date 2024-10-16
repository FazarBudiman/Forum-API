class PostReplies {
  constructor(payload) {
    this._verifyPayload(payload)

    const { content, owner, threadsId, commentsId } = payload

    this.content = content
    this.owner = owner
    this.threadsId = threadsId
    this.commentsId = commentsId
  }

  _verifyPayload({ content, owner, threadsId, commentsId }) {
    if (!content || !owner || !threadsId || !commentsId) {
      throw new Error('POST_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY')
    }
    if (
      typeof content !== 'string' ||
      typeof owner !== 'string' ||
      typeof threadsId !== 'string' ||
      typeof commentsId !== 'string'
    ) {
      throw new Error('POST_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = PostReplies
