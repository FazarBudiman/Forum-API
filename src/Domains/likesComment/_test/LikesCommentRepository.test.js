const LikesCommentRepository = require('../LikesCommentRepository')

describe('LikesCommentRepository Interface', () => {
    it('should throw error when invoke abstract behavior ', async () => {
        // Arrange
        const likeCommentRepository = new LikesCommentRepository()

        // Action and Assert
        await expect(likeCommentRepository.likeComment({})).rejects.toThrowError('LIKES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
        await expect(likeCommentRepository.unlikeComment({})).rejects.toThrowError('LIKES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
        await expect(likeCommentRepository.checkCommentIsLiked({})).rejects.toThrowError('LIKES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
        await expect(likeCommentRepository.getCountLikeInComment({})).rejects.toThrowError('LIKES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    })
})