const ThreadRepository = require('../../threads/ThreadRepository')
const CommentRepository = require('../CommentRepository')

describe('CommentRepository', () => { 
    it('should throw error when invoke abstract behavior', async () => { 
        // Arrange
        const commentRepository = new CommentRepository()
        const threadRepository = new ThreadRepository()

        // Action and Assert
        await expect(commentRepository.addComment({})).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
        await expect(threadRepository.checkThreadIsExist({})).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
     })
 })