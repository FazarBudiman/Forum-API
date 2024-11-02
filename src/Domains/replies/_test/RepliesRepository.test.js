const RepliesRepository = require('../RepliesRepository')

describe('RepliesRepository Interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const repliesRepository = new RepliesRepository()

    // Action and Assert
    await expect(repliesRepository.addReplies({})).rejects.toThrowError(
      'REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )
    await expect(repliesRepository.deleteReplies({})).rejects.toThrowError(
      'REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )
    await expect(
      repliesRepository.checkRepliesIsExist({})
    ).rejects.toThrowError('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(repliesRepository.checkRepliesOwner({})).rejects.toThrowError(
      'REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )
    await expect(repliesRepository.getRepliesInComment({})).rejects.toThrowError(
      'REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )
  })
})
