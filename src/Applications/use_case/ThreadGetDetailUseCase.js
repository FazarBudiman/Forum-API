class ThreadGetDetailUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload

    let comments = await this._commentRepository.getCommentInThread(threadId)
    // comments.forEach((comment) => {
    //   if (comment.is_delete) {
    //     comment.content = '**komentar telah dihapus**'
    //   }
    // })
    const thread = await this._threadRepository.checkThreadIsExist(threadId)
    return {
      ...thread,
      comments
    }
  }
}

module.exports = ThreadGetDetailUseCase
