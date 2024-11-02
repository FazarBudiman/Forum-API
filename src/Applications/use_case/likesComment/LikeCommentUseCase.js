class LikeCommentUseCase {
    constructor({commentRepository, threadRepository, likesCommentRepository }){
        this._commentRepository = commentRepository
        this._threadRepository = threadRepository
        this._likesCommentRepository = likesCommentRepository
    }

    async execute(useCasePayload){
        const { threadId, commentId } = useCasePayload
        await this._threadRepository.checkThreadIsExist(threadId)
        await this._commentRepository.checkCommentIsExist(commentId)
        const liked = await this._likesCommentRepository.checkCommentIsLiked(useCasePayload)
        if (liked) {
            await this._likesCommentRepository.unlikeComment(useCasePayload)
        } else {
            await this._likesCommentRepository.likeComment(useCasePayload)
        }
    }
}

module.exports = LikeCommentUseCase