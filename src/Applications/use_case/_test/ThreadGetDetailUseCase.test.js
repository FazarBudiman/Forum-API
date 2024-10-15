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

    const expectedComment = [
      {
        id: 'comment-123',
        username: 'johndoe',
        date: "2024-10-15T01:58:30.051Z",
        content: 'sebuah comment',
        is_delete: false
      },
      {
        id: 'comment-456',
        username: 'dicoding',
        date: "2024-10-15T01:58:30.177Z",
        content: 'P Komen',
        is_delete: true
      }
    ]

    const expectedThread = {
      id: "thread-3456",
      title: "sebuah thread",
      body: "sebuah body thread",
      date: "2021-08-08T07:19:09.775Z",
      username: "dicoding",
    }
    mockCommentRepository.getCommentInThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedComment))
    mockThreadRepository.getDetailThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedThread))

    const threadGetDetailUseCase = new ThreadGetDetailUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository
    })

    // Action
    const result = await threadGetDetailUseCase.execute(useCasePayload)

    // Assert
    expect(mockCommentRepository.getCommentInThread).toBeCalledWith(
      useCasePayload.threadId
    )
    expect(mockThreadRepository.getDetailThread).toBeCalledWith(
      useCasePayload.threadId
    )
    expect(result).toEqual({
      id: "thread-3456",
      title: "sebuah thread",
      body: "sebuah body thread",
      date: "2021-08-08T07:19:09.775Z",
      username: "dicoding",
      comments: [
        {
          id: 'comment-123',
          username: 'johndoe',
          date: "2024-10-15T01:58:30.051Z",
          content: 'sebuah comment',
          is_delete: false
        },
        {
          id: 'comment-456',
          username: 'dicoding',
          date: "2024-10-15T01:58:30.177Z",
          content: '**komentar telah dihapus**',
          is_delete: true
        }
      ]
    })

  })
})
