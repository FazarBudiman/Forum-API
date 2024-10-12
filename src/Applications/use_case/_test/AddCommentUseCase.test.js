const PostedComment = require('../../../Domains/comments/entities/PostedComment')
const PostComment = require('../../../Domains/comments/entities/PostComment')
const AddCommentUseCase = require('../AddCommentUseCase')
const CommentRepository = require('../../../Domains/comments/CommentRepository')


describe('AddCommentUseCase', () => {
    it('should orchestrating the add comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            content: 'P Balap',
            owner: 'user-1231',
            threadsId: 'thread-456',
            isDelete: true,
            createdAt: '2024-11-13'
        }

        const mockPostedComment = new PostedComment({
            id: 'comment-123',
            content: useCasePayload.content,
            owner: useCasePayload.owner
        })

        const mockCommentRepository = new CommentRepository()

        mockCommentRepository.checkThreadIsExist = jest.fn().mockImplementation(() => Promise.resolve())
        mockCommentRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve(mockPostedComment))

        const getCommentUseCase = new AddCommentUseCase({commentRepository: mockCommentRepository})

        // Action
        const postedComment = await getCommentUseCase.execute(useCasePayload)

        // Assert
        expect(postedComment).toStrictEqual(new PostedComment({
            id: 'comment-123',
            content: useCasePayload.content,
            owner: useCasePayload.owner
        }))

        expect(mockCommentRepository.addComment).toBeCalledWith(new PostComment({
            content: 'P Balap',
            owner: 'user-1231',
            threadsId: 'thread-456',
            isDelete: true,
            createdAt: '2024-11-13'  
        }))
    })
})