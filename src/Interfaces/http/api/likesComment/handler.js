const LikeCommentUseCase = require("../../../../Applications/use_case/likesComment/LikeCommentUseCase")

class LikesCommentHandler{
    constructor(container){
        this._container = container
        this.putLikeInComment = this.putLikeInComment.bind(this)
    }

    async putLikeInComment(request, h){
        const likeCommentUseCase = this._container.getInstance(LikeCommentUseCase.name)
        const { id: userId } = request.auth.credentials
        const {threadId, commentId} = request.params
        const payload = await { userId, threadId, commentId}

        await likeCommentUseCase.execute(payload)
        const response = h.response({
            status: 'success'
        })
        response.code(200)
        return response
    }
}

module.exports = LikesCommentHandler