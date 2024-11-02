const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper")
const LikesCommentTableTestHelper = require("../../../../tests/LikesCommentTableTestHelper")
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper")
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper")
const pool = require("../../database/postgres/pool")
const LikesCommentRepositoryPostgres = require('../LikesCommentRepositoryPostgres')

describe('LikesCommentRepositoryPostgres', () => {
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
            const likesCommentRepositoryPostgres = new LikesCommentRepositoryPostgres(pool, fakeIdGenerator)

            // Action
            await likesCommentRepositoryPostgres.likeComment(idComment, idUser)

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
            const likesCommentRepositoryPostgres = new LikesCommentRepositoryPostgres(pool, {})

            // Action  and Assert
            await expect(likesCommentRepositoryPostgres.checkCommentIsLiked(idComment, idUser)).resolves.toEqual(true)
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
            const likesCommentRepositoryPostgres = new LikesCommentRepositoryPostgres(pool, {})

            // Action  and Assert
            await expect(likesCommentRepositoryPostgres.checkCommentIsLiked(idComment, 'user-101010')).resolves.toEqual(false)
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
            const likesCommentRepositoryPostgres = new LikesCommentRepositoryPostgres(pool, {})

            // Action  
            await likesCommentRepositoryPostgres.unlikeComment(idComment, idUser)

            // Assert
            const result = await LikesCommentTableTestHelper.checkLikedInComment({commentId:idComment, userId: idUser})
            expect(result).toHaveLength(1)
            expect(result[0].is_liked).toStrictEqual(false)
        })
     })
    
})