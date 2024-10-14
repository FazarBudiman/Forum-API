class CommentDeleteUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
  }

  async execute(useCasePayload) {
    const { threadId, commentId, commentOwnerId } = useCasePayload
    await this._threadRepository.checkThreadIsExist(threadId)
    await this._commentRepository.checkCommentIsExist(commentId)
    await this._commentRepository.checkCommentOwner(commentId, commentOwnerId)
    await this._commentRepository.deleteComment(commentId)
  }
}

module.exports = CommentDeleteUseCase
