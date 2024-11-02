const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper")
const LikesCommentTableTestHelper = require("../../../../tests/LikesCommentTableTestHelper")
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper")
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper")
const pool = require("../../database/postgres/pool")
const LikeCommentRepositoryPostgres = require('../LikeCommentRepositoryPostgres')

describe('LikeCommentRepositoryPostgres', () => {
    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable()
        await ThreadsTableTestHelper.cleanTable()
        await LikesCommentTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
    })

    afterAll(async () => {
        await pool.end()
    })

    describe('likeComment', () => {
        it('should persist like in comment', async () => {
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
            const fakeIdGenerator = () => '123'
            const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, fakeIdGenerator)

            // Action
            await likeCommentRepositoryPostgres.likeComment(idComment, idUser)

            // Assert
            const result = await LikesCommentTableTestHelper.checkLikeInCommentExist('like-123')
            expect(result).toHaveLength(1)
            expect(result[0].is_liked).toStrictEqual(true)
        })
    })

    describe('checkCommentIsLiked', () => {
        it('should return true if comment is liked', async () => {
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
            await LikesCommentTableTestHelper.likeComment({id:'like-123', userId:idUser, commentId:idComment})
            const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, {})

            // Action  and Assert
            await expect(likeCommentRepositoryPostgres.checkCommentIsLiked('like-123')).resolves.toEqual(true)
        }),
        it('should return false if like in comment does not exist', async () => {
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
            await LikesCommentTableTestHelper.likeComment({id:'like-123', userId:idUser, commentId:idComment})
            const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, {})

            // Action  and Assert
            await expect(likeCommentRepositoryPostgres.checkCommentIsLiked('like-433535')).resolves.toEqual(false)
        })
    })

    describe('unlikeComment', () => { 
        it('should persist unlike in comment', async () => {
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
            await LikesCommentTableTestHelper.likeComment({id:'like-123', userId:idUser, commentId:idComment})
            const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, {})

            // Action  
            await likeCommentRepositoryPostgres.unlikeComment('like-123')

            // Assert
            const result = await LikesCommentTableTestHelper.checkLikeInCommentExist('like-123')
            expect(result).toHaveLength(1)
            expect(result[0].is_liked).toStrictEqual(false)
        })
     })
    
})