const PostReplies = require('../PostReplies')
describe('a PostReplies entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'gass',
      owner: 'user-133',
      threadsId: 'thread-123'
    }

    // Action and Assert
    expect(() => new PostReplies(payload)).toThrowError(
      'POST_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123131,
      owner: 'user-133',
      threadsId: 'thread-123',
      commentsId: 'comment-12324'
    }

    // Action and Assert
    expect(() => new PostReplies(payload)).toThrowError(
      'POST_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })

  it('should create object PostReplies object correctly', () => {
    // Arrange
    const payload = {
      content: 'gass',
      owner: 'user-133',
      threadsId: 'thread-123',
      commentsId: 'comment-12324'
    }

    // Action
    const { content, owner, threadsId, commentsId } = new PostReplies(payload)

    // Assert
    expect(content).toEqual(payload.content)
    expect(owner).toEqual(payload.owner)
    expect(threadsId).toEqual(payload.threadsId)
    expect(commentsId).toEqual(payload.commentsId)
  })
})
