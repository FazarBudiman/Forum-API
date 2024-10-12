const PostComment = require('../PostComment')

describe('a PostComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            content: 'P Balap',
            owner: 'user-dada',
            threads_id: 'thread-12121'
        }

        // Action and Assert
        expect(() => new PostComment(payload)).toThrowError('POST_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    })
    
    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            content: 123,
            owner: 'user-dada',
            threadsId: 'thread-12121',
            isDelete: 'daad',
            createdAt: '2024-11-13'
        }

        // Action and Assert
        expect(() => new PostComment(payload)).toThrowError('POST_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })
    it('should create postComment object correctly', () => {
        // Arrange
        const payload = {
            content: 'P Balap',
            owner: 'user-1231',
            threadsId: 'thread-456',
            isDelete: true,
            createdAt: '2024-11-13'
        }

        // Action
        const {content, owner, threads_id, is_delete, createdAt } = new PostComment(payload)

        // Assert
        expect(content).toEqual(payload.content)
        expect(owner).toEqual(payload.owner)
        expect(threads_id).toEqual(payload.threads_id)
        expect(is_delete).toEqual(payload.is_delete)
        expect(createdAt).toEqual(payload.createdAt)
    })
})