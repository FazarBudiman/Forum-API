const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper")
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper")
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper")
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper")
const PostReplies = require("../../../Domains/replies/entities/PostReplies")
const pool = require("../../database/postgres/pool")
const RepliesRepositoryPostgres = require("../RepliesRepositoryPostgres")

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
            await CommentsTableTestHelper.addComment({id: idComment, content:'P Balap', owner: idUser, threadsId: idThread, isDelete: false, date: date})


            // Arrange
            const postReplies = new PostReplies({
                content : 'Gasss',
                owner : idUser,
                threadsId : idThread,
                commentsId: idComment
            })
            const fakeIdGenerator = () => '123'
            const repliesRepositoryPostgres  = new RepliesRepositoryPostgres(
                pool,
                fakeIdGenerator
            )

            // Action
            await repliesRepositoryPostgres.addReplies(postReplies)

            // Assert
            const replies = await RepliesTableTestHelper.getRepliesById('reply-123')
            expect(replies).toHaveLength(1)
        })
     })
})