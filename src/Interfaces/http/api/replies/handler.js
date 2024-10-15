const RepliesAddUseCase = require("../../../../Applications/use_case/RepliesAddUseCase")

class RepliesHandler {
    constructor(container){
        this._container = container
        this.postRepliesHandler = this.postRepliesHandler.bind(this)


    }

    async postRepliesHandler (request, h){
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
}

module.exports = RepliesHandler;