const PostedComment = require('../PostedComment')
describe('a PostedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'P Balap',
      owner: 'user-12334'
    }

    // Action and Assert
    expect(() => new PostedComment(payload)).toThrowError(
      'POSTED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })
  it('should create PostedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'P Balap',
      owner: 'user-12334'
    }

    // Action and Assert
    expect(() => new PostedComment(payload)).toThrowError(
      'POSTED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })
  it('should create PostedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'P Balap',
      owner: 'user-12334'
    }

    // Action
    const { id, content, owner } = new PostedComment(payload)

    // Assert
    expect(id).toEqual(payload.id)
    expect(content).toEqual(payload.content)
    expect(owner).toEqual(payload.owner)
  })
})
