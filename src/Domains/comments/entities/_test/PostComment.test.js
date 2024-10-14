const PostComment = require('../PostComment')

describe('a PostComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'P Balap',
      owner: 'user-dada',
    }

    // Action and Assert
    expect(() => new PostComment(payload)).toThrowError(
      'POST_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
      owner: 'user-dada',
      threadsId: 'thread-12121',
    }

    // Action and Assert
    expect(() => new PostComment(payload)).toThrowError(
      'POST_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })
  it('should create postComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'P Balap',
      owner: 'user-1231',
      threadsId: 'thread-456',
    }

    // Action
    const { content, owner, threadsId} = new PostComment(payload)

    // Assert
    expect(content).toEqual(payload.content)
    expect(owner).toEqual(payload.owner)
    expect(threadsId).toEqual(payload.threadsId)
  })
})
