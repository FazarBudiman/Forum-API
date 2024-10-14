const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ThreadGetDetailUseCase = require('../ThreadGetDetailUseCase')

describe('ThreadGetDetailUseCase', () => {
  it('should orchestrating the get detail action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-12345'
    }

    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()

    mockCommentRepository.getCommentInThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockThreadRepository.checkThreadIsExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve())

    const threadGetDetailUseCase = new ThreadGetDetailUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository
    })

    // Action
    await threadGetDetailUseCase.execute(useCasePayload)

    // Assert
    expect(mockCommentRepository.getCommentInThread).toBeCalledWith(
      useCasePayload.threadId
    )
    expect(mockThreadRepository.checkThreadIsExist).toBeCalledWith(
      useCasePayload.threadId
    )
  })
})
