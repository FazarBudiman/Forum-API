const PostedThread = require('../../../../Domains/threads/entities/PostedThread')
const PostThread = require('../../../../Domains/threads/entities/PostThread')
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository')
const ThreadAddUseCase = require('../ThreadAddUseCase')

describe('ThreadAddUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'Senin',
      body: 'Hari ini adalah hari senin',
      owner: 'user-123'
    }

    const mockPostedThread = new PostedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: useCasePayload.owner
    })

    const mockThreadRepository = new ThreadRepository()

    mockThreadRepository.addThread = jest.fn(() => Promise.resolve(mockPostedThread))

    const getThreadUseCase = new ThreadAddUseCase({
      threadRepository: mockThreadRepository
    })

    // Action
    const postedThread = await getThreadUseCase.execute(useCasePayload)

    // Assert
    expect(postedThread).toStrictEqual(
      new PostedThread({
        id: 'thread-123',
        title: useCasePayload.title,
        owner: useCasePayload.owner
      })
    )

    expect(mockThreadRepository.addThread).toBeCalledWith(
      new PostThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: useCasePayload.owner,
        createdAt: new Date().toISOString().split(10)
      })
    )
  })
})
