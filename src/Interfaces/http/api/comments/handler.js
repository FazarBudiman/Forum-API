const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase')
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase')

class CommentHandler {
    constructor(container){
        this._container = container
        this.postCommentHandler = this.postCommentHandler.bind(this)
        this.deleteCommentHandler = this.deleteCommentHandler.bind(this)
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

    async deleteCommentHandler(request, h){
        const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name)
        const {id: commentOwnerId} = request.auth.credentials
        const {threadId, commentId } = request.params
        const payload = {
            threadId,
            commentId,
            commentOwnerId
        }
        await deleteCommentUseCase.execute(payload)
        const response = h.response({
            status: 'success'
        })
        response.code(200)
        return response;
    }
}

module.exports = CommentHandler