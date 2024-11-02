const PostedComment = require('../../../../Domains/comments/entities/PostedComment')
const PostComment = require('../../../../Domains/comments/entities/PostComment')
const CommentAddUseCase = require('../CommentAddUseCase')
const CommentRepository = require('../../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository')

describe('CommentAddUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'P Balap',
      owner: 'user-1231',
      threadsId: 'thread-456'
    }

    const mockPostedComment = new PostedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner
    })

    const mockCommentRepository = new CommentRepository()
    const mockThreadRepository = new ThreadRepository()

    mockThreadRepository.checkThreadIsExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockPostedComment))

    const getCommentUseCase = new CommentAddUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository
    })

    // Action
    const postedComment = await getCommentUseCase.execute(useCasePayload)

    // Assert
    expect(postedComment).toStrictEqual(
      new PostedComment({
        id: 'comment-123',
        content: useCasePayload.content,
        owner: useCasePayload.owner
      })
    )

    expect(mockThreadRepository.checkThreadIsExist).toBeCalledWith(
      useCasePayload.threadsId
    )
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new PostComment({
        content: useCasePayload.content,
        owner: useCasePayload.owner,
        threadsId: useCasePayload.threadsId
      })
    )
  })
})
