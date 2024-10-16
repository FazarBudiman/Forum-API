const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const pool = require('../../database/postgres/pool')
const PostComment = require('../../../Domains/comments/entities/PostComment')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')
const PostedComment = require('../../../Domains/comments/entities/PostedComment')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addComment function', () => {
    it('should persist post comment and return posted comment correctly', async () => {
      // Creating Dependency (add user and thread)
      const idUser = 'user-2222'
      const idThread = 'thread-2222'
      await UsersTableTestHelper.addUser({
        id: idUser,
        username: 'yusuf',
        password: 'rahasia',
        fullname: 'Yusuf Aja'
      })
      await ThreadsTableTestHelper.addThread({ id: idThread, owner: idUser })

      // Arrange
      const postComment = new PostComment({
        content: 'P Balap',
        owner: idUser,
        createdAt: '2024-11-14',
        threadsId: idThread,
        isDelete: false
      })
      const fakeIdGenerator = () => '123'
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // Action
      await commentRepositoryPostgres.addComment(postComment)

      // Assert
      const comment =
        await CommentsTableTestHelper.getCommentById('comment-123')
      expect(comment).toHaveLength(1)
    })
    it('should return posted comment correctly', async () => {
      // Creating Dependency (add user and thread)
      const idUser = 'user-1111'
      const idThread = 'thread-1111'
      await UsersTableTestHelper.addUser({
        id: idUser,
        username: 'yusuf',
        password: 'rahasia',
        fullname: 'Yusuf Aja'
      })
      await ThreadsTableTestHelper.addThread({ id: idThread, owner: idUser })

      // Arrange
      const postComment = new PostComment({
        content: 'P Balap',
        owner: idUser,
        createdAt: '2024-11-14',
        threadsId: idThread,
        isDelete: false
      })
      const fakeIdGenerator = () => '123'
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // Action
      const postedComment =
        await commentRepositoryPostgres.addComment(postComment)
      // Assert
      expect(postedComment).toStrictEqual(
        new PostedComment({
          id: 'comment-123',
          content: postComment.content,
          owner: idUser
        })
      )
    })
  })

  describe('checkCommentIsExist function', () => {
    it('should throw NotFoundError when comment is not exist', async () => {
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

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      //  Action and Assert
      await expect(
        commentRepositoryPostgres.checkCommentIsExist('comment-123')
      ).rejects.toThrowError(NotFoundError)
    })
    it('should not throw NotFoundError when comment exist', async () => {
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
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      //  Action and Assert
      await expect(
        commentRepositoryPostgres.checkCommentIsExist('comment-123')
      ).resolves.not.toThrowError(NotFoundError)
    })
  })

  describe('checkCommentOwner function', () => {
    it('should not throw Authorization error when comment is owner ', async () => {
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
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      //  Action and Assert
      await expect(
        commentRepositoryPostgres.checkCommentOwner('comment-123', 'user-123')
      ).resolves.not.toThrowError(AuthorizationError)
    })
    it('should throw Authorization error when comment is not owner ', async () => {
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
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      //  Action and Assert
      await expect(
        commentRepositoryPostgres.checkCommentOwner('comment-123', 'user-12345')
      ).rejects.toThrowError(AuthorizationError)
    })
  })

  describe('deleteComment function', () => {
    it('should comment deleted', async () => {
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
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      //  Action
      await commentRepositoryPostgres.deleteComment('comment-123')

      // Assert
      const result =
        await CommentsTableTestHelper.checkCommentIsDeleted('comment-123')
      expect(result[0].is_delete).toStrictEqual(true)
    })
  })

  describe('getCommentInThread function', () => {
    it('should return comment in thread if comment exist', async () => {
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

      const date = new Date().toISOString()
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadsId: 'thread-12345',
        date: date,
        isDelete: false,
        content: 'P Balap'
      })
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action
      const result =
        await commentRepositoryPostgres.getCommentInThread('thread-12345')

      // Assert
      expect(result).toHaveLength(1)
      expect(result[0]).toStrictEqual({
        id: 'comment-123',
        username: 'dicoding',
        date: date,
        content: 'P Balap',
        is_delete: false
      })
    }),
    it('should return array empty  if comment in thread not exist', async () => {
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

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action
      const result =
        await commentRepositoryPostgres.getCommentInThread('thread-12345')

      // Assert
      expect(result).toHaveLength(0)
    }),
    it('should comment in thread is exist even comment is_delete', async () => {
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

        const date = new Date().toISOString()
        await CommentsTableTestHelper.addComment({
          id: 'comment-123',
          owner: 'user-123',
          threadsId: 'thread-12345',
          date: date,
          content: 'Gasss'
        })
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {}
        )

        // Action
        await commentRepositoryPostgres.deleteComment('comment-123')
        const result =
          await commentRepositoryPostgres.getCommentInThread('thread-12345')

        // Assert
        expect(result).toHaveLength(1)
        expect(result[0]).toStrictEqual({
          id: 'comment-123',
          username: 'dicoding',
          date: date,
          content: 'Gasss',
          is_delete: true
        })
    })
  })
})
