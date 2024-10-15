const CommentRepository = require("../../../Domains/comments/CommentRepository")
const PostedReplies = require("../../../Domains/replies/entities/PostedReplies")
const PostReplies = require("../../../Domains/replies/entities/PostReplies")
const RepliesRepository = require("../../../Domains/replies/RepliesRepository")
const ThreadRepository = require("../../../Domains/threads/ThreadRepository")
const RepliesAddUseCase = require('../RepliesAddUseCase')

describe('RepliesAddUseCase', () => { 
    it('should orchestrating the add replies action correctly ', async () => { 
        // Arrange
        const useCasePayload = {
            content : 'Gass ngopi', 
            owner: 'user-1010', 
            threadsId: 'thread-1111', 
            commentsId: 'comment-1212'
        }

        const mockPostedReplies = new PostedReplies({
            id : 'reply-12345', 
            content: useCasePayload.content, 
            owner: useCasePayload.owner
        })

        const mockRepliesRepository = new RepliesRepository()
        const mockCommentRepository = new CommentRepository()
        const mockThreadRepository = new ThreadRepository()

        mockThreadRepository.checkThreadIsExist = jest.fn().mockImplementation(() => Promise.resolve())
        mockCommentRepository.checkCommentIsExist = jest.fn().mockImplementation(() => Promise.resolve())
        mockRepliesRepository.addReplies = jest.fn().mockImplementation(() => Promise.resolve(mockPostedReplies))

        const repliesAddUseCase = new RepliesAddUseCase({
            repliesRepository : mockRepliesRepository,
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository
        })

        // Action
        const postedReplies = await repliesAddUseCase.execute(useCasePayload)

        // Assert
        expect(postedReplies).toStrictEqual(new PostedReplies({
            id: 'reply-12345',
            content: useCasePayload.content,
            owner: useCasePayload.owner
        }))
        expect(mockThreadRepository.checkThreadIsExist).toBeCalledWith(useCasePayload.threadsId)
        expect(mockCommentRepository.checkCommentIsExist).toBeCalledWith(useCasePayload.commentsId)
        expect(mockRepliesRepository.addReplies).toBeCalledWith(
            new PostReplies({
                content : useCasePayload.content, 
                owner: useCasePayload.owner, 
                threadsId: useCasePayload.threadsId, 
                commentsId: useCasePayload.commentsId
            })
        )
     })
})