const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const pool = require('../../database/postgres/pool')
const PostThread = require('../../../Domains/threads/entities/PostThread')
const PostedThread = require('../../../Domains/threads/entities/PostedThread')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addThread function', () => {
    it('should persist post thread and return posted thread correctly', async () => {
      // Add User
      const idUser = 'user-123'
      await UsersTableTestHelper.addUser({
        id: idUser,
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia'
      })

      // Arrange
      const postThread = new PostThread({
        title: 'Senin',
        body: 'Hari ini adalah hari senin',
        owner: idUser,
        createdAt: '2024-12-11'
      })
      const fakeIdGenerator = () => '123' // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // Action
      await threadRepositoryPostgres.addThread(postThread)

      // Assert
      const threads = await ThreadsTableTestHelper.getThreadDetail('thread-123')
      expect(threads).toHaveLength(1)
    })

    it('should return registered thread coorectly', async () => {
      // Add User
      const idUser = 'user-123'
      await UsersTableTestHelper.addUser({
        id: idUser,
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia'
      })

      // Arrange
      const postThread = new PostThread({
        title: 'Senin',
        body: 'Hari ini adalah hari senin',
        owner: idUser,
        createdAt: '2024-12-11'
      })
      const fakeIdGenerator = () => '123' // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // Action
      const postedThread = await threadRepositoryPostgres.addThread(postThread)

      // Assert
      expect(postedThread).toStrictEqual(
        new PostedThread({
          id: 'thread-123',
          title: 'Senin',
          owner: idUser
        })
      )
    })
  })
  describe('checkThreadIsExist function', () => {
    it('should throw NotFoundError when threads not exist', async () => {
      // Arrange
      // Add User
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia'
      })
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action and Assert
      await expect(
        threadRepositoryPostgres.checkThreadIsExist('thread-12345')
      ).rejects.toThrowError(NotFoundError)
    })
    it('should not throw NotFoundError when threads exist', async () => {
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
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action and Assert
      await expect(
        threadRepositoryPostgres.checkThreadIsExist('thread-12345')
      ).resolves.not.toThrowError(NotFoundError)
    })
  })

  describe('getDetailThread function', () => {
    it('should return data thread  if thread exist ', async () => {
      // Arrange
      // Add User
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia'
      })
      // Add Thread
      const date = new Date().toISOString()
      await ThreadsTableTestHelper.addThread({
        id: 'thread-12345',
        title: 'Ngopi',
        body: 'Infokan ngopi sekitaran Bandung',
        date: date,
        owner: 'user-123'
      })
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action
      const result =
        await threadRepositoryPostgres.getDetailThread('thread-12345')

      // Assert
      expect(result).toEqual({
        id: 'thread-12345',
        title: 'Ngopi',
        body: 'Infokan ngopi sekitaran Bandung',
        date: date,
        username: 'dicoding'
      })
    })
    it('should return array empty if data thread not exist', async () => {
      // Arrange
      // Add User
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia'
      })
      // Add Thread
      const date = new Date().toISOString()
      await ThreadsTableTestHelper.addThread({
        id: 'thread-12345',
        title: 'Ngopi',
        body: 'Infokan ngopi sekitaran Bandung',
        date: date,
        owner: 'user-123'
      })
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action
      const result = await threadRepositoryPostgres.getDetailThread('xxx')
      // Assert
      expect(result).toEqual(undefined)
    })
  })
})
