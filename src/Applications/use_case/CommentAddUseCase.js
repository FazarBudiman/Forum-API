const PostComment = require('../../Domains/comments/entities/PostComment')

class CommentAddUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
  }

  async execute(useCasePayload) {
    const postComment = new PostComment(useCasePayload)
    await this._threadRepository.checkThreadIsExist(postComment.threadsId)
    return this._commentRepository.addComment(postComment)
  }
}

module.exports = CommentAddUseCase
