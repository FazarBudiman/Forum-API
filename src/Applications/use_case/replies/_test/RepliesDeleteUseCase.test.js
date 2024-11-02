const CommentRepository = require('../../../../Domains/comments/CommentRepository')
const RepliesRepository = require('../../../../Domains/replies/RepliesRepository')
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository')
const RepliesDeleteUseCase = require('../RepliesDeleteUseCase')

describe('RepliesDeleteUseCase', () => {
  it('should orchestrating the delete replies action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-12345',
      commentId: 'comment-12342',
      replyId: 'reply-113131',
      owner: 'user-1213313'
    }

    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()
    const mockRepliesRepository = new RepliesRepository()

    mockThreadRepository.checkThreadIsExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.checkCommentIsExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockRepliesRepository.checkRepliesIsExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockRepliesRepository.checkRepliesOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockRepliesRepository.deleteReplies = jest
      .fn()
      .mockImplementation(() => Promise.resolve())

    const repliesDeleteUseCase = new RepliesDeleteUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      repliesRepository: mockRepliesRepository
    })

    // Action
    await repliesDeleteUseCase.execute(useCasePayload)

    // Assert
    expect(mockThreadRepository.checkThreadIsExist).toHaveBeenCalledWith(
      useCasePayload.threadId
    )
    expect(mockCommentRepository.checkCommentIsExist).toHaveBeenCalledWith(
      useCasePayload.commentId
    )
    expect(mockRepliesRepository.checkRepliesIsExist).toHaveBeenCalledWith(
      useCasePayload.replyId
    )
    expect(mockRepliesRepository.checkRepliesOwner).toHaveBeenCalledWith(
      useCasePayload.replyId,
      useCasePayload.owner
    )
    expect(mockRepliesRepository.deleteReplies).toHaveBeenCalledWith(
      useCasePayload.replyId
    )
  })
})
