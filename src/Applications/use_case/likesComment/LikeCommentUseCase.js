class LikeCommentUseCase {
    constructor({commentRepository, threadRepository, likesCommentRepository }){
        this._commentRepository = commentRepository
        this._threadRepository = threadRepository
        this._likesCommentRepository = likesCommentRepository
    }

    async execute(useCasePayload){
        const { threadId, commentId, userId } = useCasePayload
        await this._threadRepository.checkThreadIsExist(threadId)
        await this._commentRepository.checkCommentIsExist(commentId)
        const liked = await this._likesCommentRepository.checkCommentIsLiked(commentId, userId)
        if (liked) {
            await this._likesCommentRepository.unlikeComment(commentId, userId)
        } else {
            await this._likesCommentRepository.likeComment(commentId, userId)
        }
    }
}

module.exports = LikeCommentUseCase