const CommentAddUseCase = require('../../../../Applications/use_case/CommentAddUseCase')
const CommentDeleteUseCase = require('../../../../Applications/use_case/CommentDeleteUseCase')

class CommentHandler {
  constructor(container) {
    this._container = container
    this.postCommentHandler = this.postCommentHandler.bind(this)
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this)
  }

  async postCommentHandler(request, h) {
    const commentAddUseCase = this._container.getInstance(
      CommentAddUseCase.name
    )
    const { id: owner } = request.auth.credentials
    const { threadId: threadsId } = request.params
    const payload = await {
      ...request.payload,
      owner,
      threadsId
    }
    const addedComment = await commentAddUseCase.execute(payload)
    const response = h.response({
      status: 'success',
      data: {
        addedComment
      }
    })
    response.code(201)
    return response
  }

  async deleteCommentHandler(request, h) {
    const commentDeleteUseCase = this._container.getInstance(
      CommentDeleteUseCase.name
    )
    const { id: commentOwnerId } = request.auth.credentials
    const { threadId, commentId } = request.params
    const payload = {
      threadId,
      commentId,
      commentOwnerId
    }
    await commentDeleteUseCase.execute(payload)
    const response = h.response({
      status: 'success'
    })
    response.code(200)
    return response
  }
}

module.exports = CommentHandler
