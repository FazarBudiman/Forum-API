const CommentRepository = require('../../../../Domains/comments/CommentRepository')
const LikesCommentRepository = require('../../../../Domains/likesComment/LikesCommentRepository')
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository')
const LikeCommentUseCase = require('../LikeCommentUseCase')

describe('LikeCommentUseCase', () => { 
    it('should orchestrating the like comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-12345',
            commentId: 'comment-5677',
            userId: 'user-999'
        }
        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()
        const mockLikesCommentRepository = new LikesCommentRepository()

        mockThreadRepository.checkThreadIsExist = jest.fn().mockImplementation(() => Promise.resolve())
        mockCommentRepository.checkCommentIsExist = jest.fn().mockImplementation(() => Promise.resolve())
        mockLikesCommentRepository.checkCommentIsLiked = jest.fn().mockImplementation(() => Promise.resolve(false))
        mockLikesCommentRepository.likeComment = jest.fn().mockImplementation(() => Promise.resolve())

        const likesCommentUsecase = new LikeCommentUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
            likesCommentRepository: mockLikesCommentRepository
        })

        // Action
        await likesCommentUsecase.execute(useCasePayload)

        // Assert
        expect(mockThreadRepository.checkThreadIsExist).toHaveBeenCalledWith(useCasePayload.threadId)
        expect(mockCommentRepository.checkCommentIsExist).toHaveBeenCalledWith(useCasePayload.commentId)
        expect(mockLikesCommentRepository.checkCommentIsLiked).toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.userId)
        expect(mockLikesCommentRepository.likeComment).toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.userId)
    })

    it('should orchestrating the unlike comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-12345',
            commentId: 'comment-5677',
            userId: 'user-999'
        }
        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()
        const mockLikesCommentRepository = new LikesCommentRepository()

        mockThreadRepository.checkThreadIsExist = jest.fn().mockImplementation(() => Promise.resolve())
        mockCommentRepository.checkCommentIsExist = jest.fn().mockImplementation(() => Promise.resolve())
        mockLikesCommentRepository.checkCommentIsLiked = jest.fn().mockImplementation(() => Promise.resolve(true))
        mockLikesCommentRepository.unlikeComment = jest.fn().mockImplementation(() => Promise.resolve())

        const likesCommentUsecase = new LikeCommentUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
            likesCommentRepository: mockLikesCommentRepository
        })

        // Action
        await likesCommentUsecase.execute(useCasePayload)

        // Assert
        expect(mockThreadRepository.checkThreadIsExist).toHaveBeenCalledWith(useCasePayload.threadId)
        expect(mockCommentRepository.checkCommentIsExist).toHaveBeenCalledWith(useCasePayload.commentId)
        expect(mockLikesCommentRepository.checkCommentIsLiked).toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.userId)
        expect(mockLikesCommentRepository.unlikeComment).toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.userId)
    })
})