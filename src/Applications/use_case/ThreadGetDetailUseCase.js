class ThreadGetDetailUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload

    const comments = await this._commentRepository.getCommentInThread(threadId)
    const thread = await this._threadRepository.checkThreadIsExist(threadId)
    return {
      ...thread,
      comments
    }
  }
}

module.exports = ThreadGetDetailUseCase
