const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper")
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper")
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper")
const pool = require("../../database/postgres/pool")
const PostComment = require('../../../Domains/comments/entities/PostComment')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')
const PostedComment = require("../../../Domains/comments/entities/PostedComment")


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
            await UsersTableTestHelper.addUser({id: idUser, username: 'yusuf', password: 'rahasia', fullname:'Yusuf Aja'})
            await ThreadsTableTestHelper.addThread({id: idThread, owner: idUser})

            // Arrange
            const postComment = new PostComment({
                content: 'P Balap', 
                owner: idUser,  
                createdAt:'2024-11-14', 
                threadsId:idThread, 
                isDelete: false,
            })
            const fakeIdGenerator = () => '123'
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

            // Action
            await commentRepositoryPostgres.addComment(postComment)

            // Assert
            const comment = await CommentsTableTestHelper.getCommentById('comment-123')
            expect(comment).toHaveLength(1)

        })
        it('should return posted comment correctly', async () => {
             // Creating Dependency (add user and thread)
             const idUser = 'user-1111'
             const idThread = 'thread-1111'
             await UsersTableTestHelper.addUser({id: idUser, username: 'yusuf', password: 'rahasia', fullname:'Yusuf Aja'})
             await ThreadsTableTestHelper.addThread({id: idThread, owner: idUser})
 
             // Arrange
             const postComment = new PostComment({
                 content: 'P Balap', 
                 owner: idUser,  
                 createdAt:'2024-11-14', 
                 threadsId:idThread, 
                 isDelete: false,
             })
             const fakeIdGenerator = () => '123'
             const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)
 
             // Action
             const postedComment = await commentRepositoryPostgres.addComment(postComment)
             // Assert
            expect(postedComment).toStrictEqual( new PostedComment({
                id: 'comment-123',
                content: postComment.content,
                owner: idUser
            }))
        })
    })

 })