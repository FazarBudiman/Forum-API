class RepliesDeleteuseCase {
  constructor({ threadRepository, commentRepository, repliesRepository }) {
    this._threadRepository = threadRepository
    ;(this._commentRepository = commentRepository),
      (this._repliesRepository = repliesRepository)
  }

  async execute(payload) {
    const { threadId, commentId, replyId, owner } = payload
    await this._threadRepository.checkThreadIsExist(threadId)
    await this._commentRepository.checkCommentIsExist(commentId)
    await this._repliesRepository.checkRepliesIsExist(replyId)
    await this._repliesRepository.checkRepliesOwner(replyId, owner)
    await this._repliesRepository.deleteReplies(replyId)
  }
}

module.exports = RepliesDeleteuseCase
