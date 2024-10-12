const PostComment = require('../../Domains/comments/entities/PostComment')
const PostThread = require('../../Domains/threads/entities/PostThread')

class AddCommentUseCase {
    constructor({commentRepository}) {
        this._commentRepository = commentRepository
    }

    async execute(useCasePayload){
        const postComment = new PostComment(useCasePayload)
        await this._commentRepository.checkThreadIsExist(postComment.threadsId)
        return this._commentRepository.addComment(postComment)
    }
}

module.exports = AddCommentUseCase;