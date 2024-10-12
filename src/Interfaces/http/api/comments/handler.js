 const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase')

class CommentHandler {
    constructor(container){
        this._container = container
        this.postCommentHandler = this.postCommentHandler.bind(this)
    }

    async postCommentHandler(request, h){
        const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name)
        const { id: owner } = request.auth.credentials
        const createdAt = new Date().toISOString()
        const {threadId: threadsId} = request.params
        const payload = await {
            ...request.payload,
            owner,
            createdAt,
            threadsId,
            isDelete: false,
        }
        const addedComment = await addCommentUseCase.execute(payload)
        const response = h.response({
            status:'success',
            data: {
                addedComment
            }
        })
        response.code(201)
        return response;
    }
}

module.exports = CommentHandler