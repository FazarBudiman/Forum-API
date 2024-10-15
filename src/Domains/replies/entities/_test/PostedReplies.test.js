const PostedReplies = require('../PostedReplies')
describe('a PostedReplies entities', () => {
    it('should throw error when payload did not contain needed property', () => { 
        // Arrange
        const payload = {
            content: 'gass',
            owner: 'user-1233'
        }

        // Action and Assert
        expect(() => new PostedReplies(payload)).toThrowError(
            'POSTED_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY'
        )
    })
    it('should throw error when payload did not meet data type specification', () => { 
        // Arrange
        const payload = {
            id: 12345,
            content: 'gass',
            owner: 'user-1233'
        }

        // Action and Assert
        expect(() => new PostedReplies(payload)).toThrowError(
            'POSTED_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION'
        )
    })

    it('should create object PostedReplies object correctly', () => { 
        // Arrange
        const payload = {
            id: 'reply-12345',
            content: 'gass',
            owner: 'user-1233'
        }

        // Action 
        const {id, content, owner } = new PostedReplies(payload)
        
        // Assert
        expect(id).toEqual(payload.id)
        expect(content).toEqual(payload.content)
        expect(owner).toEqual(payload.owner)
    })
})