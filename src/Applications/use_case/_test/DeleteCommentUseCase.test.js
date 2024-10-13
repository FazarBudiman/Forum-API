const DeleteCommentUseCase = require('../DeleteCommentUseCase')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
describe('DeleteCommentUseCase', () => {
    it('should orchenstrating the delete comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123', 
            commentId: 'comment-123', 
            commentOwnerId:'user-123'
        }

        const mockThreadRepository = new ThreadRepository()
        mockThreadRepository.checkThreadIsExist = jest.fn().mockImplementation(() => Promise.resolve())

        const mockCommentRepository = new CommentRepository()
        mockCommentRepository.checkCommentIsExist = jest.fn().mockImplementation(() => Promise.resolve())
        mockCommentRepository.checkCommentOwner = jest.fn().mockImplementation(() => Promise.resolve())
        mockCommentRepository.deleteComment = jest.fn().mockImplementation(() => Promise.resolve())

        const deleteCommentUseCase = new DeleteCommentUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        })

        // Action
        await deleteCommentUseCase.execute(useCasePayload)

        // Assert
        expect(mockThreadRepository.checkThreadIsExist).toHaveBeenCalledWith(useCasePayload.threadId)
        expect(mockCommentRepository.checkCommentIsExist).toHaveBeenCalledWith(useCasePayload.commentId)
        expect(mockCommentRepository.checkCommentOwner).toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.commentOwnerId)
        expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(useCasePayload.commentId)

    })
})