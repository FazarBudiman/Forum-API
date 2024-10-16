const PostReplies = require('../../Domains/replies/entities/PostReplies')

class RepliesAddUseCase {
  constructor({ repliesRepository, commentRepository, threadRepository }) {
    this._repliesRepository = repliesRepository
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
  }

  async execute(useCasePayload) {
    const postReplies = new PostReplies(useCasePayload)
    await this._threadRepository.checkThreadIsExist(postReplies.threadsId)
    await this._commentRepository.checkCommentIsExist(postReplies.commentsId)
    return this._repliesRepository.addReplies(postReplies)
  }
}
module.exports = RepliesAddUseCase
