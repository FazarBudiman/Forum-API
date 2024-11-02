const RepliesAddUseCase = require('../../../../Applications/use_case/replies/RepliesAddUseCase')
const RepliesDeleteuseCase = require('../../../../Applications/use_case/replies/RepliesDeleteUseCase')

class RepliesHandler {
  constructor(container) {
    this._container = container
    this.postRepliesHandler = this.postRepliesHandler.bind(this)
    this.deleteRepliesHandler = this.deleteRepliesHandler.bind(this)
  }

  async postRepliesHandler(request, h) {
    const repliesAddUseCase = this._container.getInstance(
      RepliesAddUseCase.name
    )
    const { id: owner } = request.auth.credentials
    const { threadId: threadsId, commentId: commentsId } = request.params

    const payload = await {
      ...request.payload,
      owner,
      threadsId,
      commentsId
    }

    const addedReply = await repliesAddUseCase.execute(payload)
    const response = h.response({
      status: 'success',
      data: {
        addedReply
      }
    })
    response.code(201)
    return response
  }

  async deleteRepliesHandler(request, h) {
    const repliesDeleteUseCase = this._container.getInstance(
      RepliesDeleteuseCase.name
    )

    const { id: owner } = request.auth.credentials
    const { threadId, commentId, replyId } = request.params
    const payload = {
      ...request.payload,
      owner,
      threadId,
      commentId,
      replyId
    }
    await repliesDeleteUseCase.execute(payload)
    const response = h.response({
      status: 'success'
    })
    response.code(200)
    return response
  }
}

module.exports = RepliesHandler
