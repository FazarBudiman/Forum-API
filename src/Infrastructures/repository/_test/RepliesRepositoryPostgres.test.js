const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const PostedReplies = require('../../../Domains/replies/entities/PostedReplies')
const PostReplies = require('../../../Domains/replies/entities/PostReplies')
const pool = require('../../database/postgres/pool')
const RepliesRepositoryPostgres = require('../RepliesRepositoryPostgres')

describe('RepliesRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addReplies function', () => {
    it('should persist post replies and return posted replies  correctly ', async () => {
      // Creating Dependency (add user and thread)
      const idUser = 'user-2222'
      const idThread = 'thread-2222'
      const idComment = 'comment-123'
      const date = new Date().toISOString()
      await UsersTableTestHelper.addUser({
        id: idUser,
        username: 'yusuf',
        password: 'rahasia',
        fullname: 'Yusuf Aja'
      })
      await ThreadsTableTestHelper.addThread({ id: idThread, owner: idUser })
      await CommentsTableTestHelper.addComment({
        id: idComment,
        content: 'P Balap',
        owner: idUser,
        threadsId: idThread,
        isDelete: false,
        date: date
      })

      // Arrange
      const postReplies = new PostReplies({
        content: 'Gasss',
        owner: idUser,
        threadsId: idThread,
        commentsId: idComment
      })
      const fakeIdGenerator = () => '123'
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // Action
      await repliesRepositoryPostgres.addReplies(postReplies)

      // Assert
      const replies = await RepliesTableTestHelper.getRepliesById('reply-123')
      expect(replies).toHaveLength(1)
    })
    it('should return posted comment correctly', async () => {
      // Creating Dependency (add user and thread)
      const idUser = 'user-2222'
      const idThread = 'thread-2222'
      const idComment = 'comment-123'
      const date = new Date().toISOString()
      await UsersTableTestHelper.addUser({
        id: idUser,
        username: 'yusuf',
        password: 'rahasia',
        fullname: 'Yusuf Aja'
      })
      await ThreadsTableTestHelper.addThread({ id: idThread, owner: idUser })
      await CommentsTableTestHelper.addComment({
        id: idComment,
        content: 'P Balap',
        owner: idUser,
        threadsId: idThread,
        isDelete: false,
        date: date
      })

      // Arrange
      const postReplies = new PostReplies({
        content: 'Gasss',
        owner: idUser,
        threadsId: idThread,
        commentsId: idComment
      })
      const fakeIdGenerator = () => '123'
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // Action
      const postedComment =
        await repliesRepositoryPostgres.addReplies(postReplies)
      // Assert
      expect(postedComment).toStrictEqual(
        new PostedReplies({
          id: 'reply-123',
          content: postReplies.content,
          owner: idUser
        })
      )
    })
    
  })

  describe('checkRepliesIsExist function', () => {
    it('should throw NotFoundError if replies not exist ', async () => {
      // Arrange
      // Add User
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia'
      })
      // Add Thread
      await ThreadsTableTestHelper.addThread({
        id: 'thread-12345',
        owner: 'user-123'
      })

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadsId: 'thread-12345'
      })

      await RepliesTableTestHelper.addReplies({
        id: 'reply-1234',
        content: 'Gass mass',
        owner: 'user-123',
        threads_id: 'thread-12345',
        comments_id: 'comment-123'
      })
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(
        pool,
        {}
      )

      // Action and Assert
      await expect(
        repliesRepositoryPostgres.checkRepliesIsExist('reply-123')
      ).rejects.toThrowError(NotFoundError)
    })
    it('should not throw NotFoundError if replies exist ', async () => {
      // Arrange
      // Add User
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia'
      })
      // Add Thread
      await ThreadsTableTestHelper.addThread({
        id: 'thread-12345',
        owner: 'user-123'
      })

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadsId: 'thread-12345'
      })

      await RepliesTableTestHelper.addReplies({
        id: 'reply-1234',
        content: 'Gass mass',
        owner: 'user-123',
        threads_id: 'thread-12345',
        comments_id: 'comment-123'
      })
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(
        pool,
        {}
      )

      // Action and Assert
      await expect(
        repliesRepositoryPostgres.checkRepliesIsExist('reply-1234')
      ).resolves.not.toThrowError(NotFoundError)
    })
  })

  describe('checkRepliesOwner', () => {
    it('should not throw AuthorizationError when comment is owner', async () => {
      // Arrange
      // Add User
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia'
      })
      // Add Thread
      await ThreadsTableTestHelper.addThread({
        id: 'thread-12345',
        owner: 'user-123'
      })

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadsId: 'thread-12345'
      })

      await RepliesTableTestHelper.addReplies({
        id: 'reply-1234',
        content: 'Gass mass',
        owner: 'user-123',
        threads_id: 'thread-12345',
        comments_id: 'comment-123'
      })
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(
        pool,
        {}
      )

      // Action and Assert
      await expect(
        repliesRepositoryPostgres.checkRepliesOwner('reply-1234', 'user-123')
      ).resolves.not.toThrowError(AuthorizationError)
    })
    it('should throw AuthorizationError when comment is not owner', async () => {
      // Arrange
      // Add User
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia'
      })
      // Add Thread
      await ThreadsTableTestHelper.addThread({
        id: 'thread-12345',
        owner: 'user-123'
      })

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadsId: 'thread-12345'
      })

      await RepliesTableTestHelper.addReplies({
        id: 'reply-1234',
        content: 'Gass mass',
        owner: 'user-123',
        threads_id: 'thread-12345',
        comments_id: 'comment-123'
      })
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(
        pool,
        {}
      )

      // Action and Assert
      await expect(
        repliesRepositoryPostgres.checkRepliesOwner('reply-1234', 'user-12')
      ).rejects.toThrowError(AuthorizationError)
    })
  })

  describe('deleteReplies', () => {
    it('should replies deleted', async () => {
      // Arrange
      // Add User
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia'
      })
      // Add Thread
      await ThreadsTableTestHelper.addThread({
        id: 'thread-12345',
        owner: 'user-123'
      })

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadsId: 'thread-12345'
      })

      await RepliesTableTestHelper.addReplies({
        id: 'reply-1234',
        content: 'Gass mass',
        owner: 'user-123',
        threads_id: 'thread-12345',
        comments_id: 'comment-123'
      })
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(
        pool,
        {}
      )

      // Action
      await repliesRepositoryPostgres.deleteReplies('reply-1234')

      // Assert
      const result = await RepliesTableTestHelper.getRepliesById('reply-1234')
      expect(result[0].is_delete).toStrictEqual(true)
    })
  })

  describe('getRepliesInComment', () => {
    it('should return replies in comment when replies is exist', async () => {
      // Arrange
      // Add User
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia'
      })
      // Add Thread
      await ThreadsTableTestHelper.addThread({
        id: 'thread-12345',
        owner: 'user-123'
      })

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadsId: 'thread-12345'
      })

      const date = new Date().toISOString()
      await RepliesTableTestHelper.addReplies({
        id: 'reply-1234',
        content: 'Gass mass',
        owner: 'user-123',
        threads_id: 'thread-12345',
        comments_id: 'comment-123',
        date: date,
        is_delete: false,
      })
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(
        pool,
        {}
      )

      // Action
      const result = await repliesRepositoryPostgres.getRepliesInComment('comment-123')

      // Asserrt
      expect(result).toHaveLength(1)
      expect(result[0]).toStrictEqual({
        id: 'reply-1234',
        username: 'dicoding',
        date: date,
        content: 'Gass mass',
        is_delete: false
      })
    })
    it('should return array empty  when replies in comment is not exist', async () => {
      // Arrange
      // Add User
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia'
      })
      // Add Thread
      await ThreadsTableTestHelper.addThread({
        id: 'thread-12345',
        owner: 'user-123'
      })

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadsId: 'thread-12345'
      })

      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(
        pool,
        {}
      )

      // Action
      const result = await repliesRepositoryPostgres.getRepliesInComment('comment-123')

      // Asserrt
      expect(result).toHaveLength(0)
    })
    it('should return replies in comment event replies is deleted', async () => {
      // Arrange
      // Add User
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia'
      })
      // Add Thread
      await ThreadsTableTestHelper.addThread({
        id: 'thread-12345',
        owner: 'user-123'
      })

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadsId: 'thread-12345'
      })

      const date= new Date().toISOString()
      await RepliesTableTestHelper.addReplies({
        id: 'reply-1234',
        content: 'Gass mass',
        owner: 'user-123',
        threads_id: 'thread-12345',
        comments_id: 'comment-123',
        date: date
      })
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(
        pool,
        {}
      )

      // Action
      await repliesRepositoryPostgres.deleteReplies('reply-1234')
      const result = await repliesRepositoryPostgres.getRepliesInComment('comment-123')

      // Assert
      expect(result).toHaveLength(1)
      expect(result[0]).toStrictEqual({
        id:'reply-1234',
        username: 'dicoding',
        date: date,
        content: 'Gass mass',
        is_delete: true
      })
     })
  })
})
