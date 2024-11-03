const LikesCommentTableTestHelper = require("../../../../tests/LikesCommentTableTestHelper")
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper")
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper")
const pool = require("../../database/postgres/pool")
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper")
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper")
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper")
const createServer = require("../createServer")
const container = require("../../container")

describe('/threads/{threadId}/comments/{commentId}/likes', () => {
    afterAll(async () => {
        await pool.end()
    })

    afterEach(async () => {
        await RepliesTableTestHelper.cleanTable()
        await CommentsTableTestHelper.cleanTable()
        await LikesCommentTableTestHelper.cleanTable()
        await ThreadsTableTestHelper.cleanTable()
        await AuthenticationsTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
    })

    describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
        it('should response 200 when like or unlike comment', async () => { 
            // Arrange
            const server = await createServer(container)

            // Add User
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                username: 'dicoding',
                password: 'secret',
                fullname: 'Dicoding Indonesia'
                }
            })

            // login user
            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                username: 'dicoding',
                password: 'secret'
                }
            })
            const {
                data: { accessToken }
            } = JSON.parse(loginResponse.payload)

            //   Add Thread
            const AddThreadresponse = await server.inject({
                method: 'POST',
                url: '/threads',
                headers: {
                authorization: `Bearer ${accessToken}`
                },
                payload: {
                title: 'Senin',
                body: 'Hari ini adalah hari senin'
                }
            })

            const responseThreadJSON = JSON.parse(AddThreadresponse.payload)
            const threadId = responseThreadJSON.data.addedThread.id

            // Add Comment
            const addCommentResponse = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                headers: {
                authorization: `Bearer ${accessToken}`
                },
                payload: {
                content: 'P Balap'
                }
            })

            const responseCommentJSON = JSON.parse(addCommentResponse.payload)
            const commentId = responseCommentJSON.data.addedComment.id

            // Action
            const response = await server.inject({
                method:'PUT',
                url: `/threads/${threadId}/comments/${commentId}/likes`,
                headers: {
                    authorization: `Bearer ${accessToken}`
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(200)
            expect(responseJson.status).toEqual('success')
        })

        it('should response 401 if no token authentication', async () => { 
            // Arrange
            const server = await createServer(container)

            // Add User
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                username: 'dicoding',
                password: 'secret',
                fullname: 'Dicoding Indonesia'
                }
            })

            // login user
            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                username: 'dicoding',
                password: 'secret'
                }
            })
            const {
                data: { accessToken }
            } = JSON.parse(loginResponse.payload)

            //   Add Thread
            const AddThreadresponse = await server.inject({
                method: 'POST',
                url: '/threads',
                headers: {
                authorization: `Bearer ${accessToken}`
                },
                payload: {
                title: 'Senin',
                body: 'Hari ini adalah hari senin'
                }
            })

            const responseThreadJSON = JSON.parse(AddThreadresponse.payload)
            const threadId = responseThreadJSON.data.addedThread.id

            // Add Comment
            const addCommentResponse = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                headers: {
                authorization: `Bearer ${accessToken}`
                },
                payload: {
                content: 'P Balap'
                }
            })

            const responseCommentJSON = JSON.parse(addCommentResponse.payload)
            const commentId = responseCommentJSON.data.addedComment.id

            // Action
            const response = await server.inject({
                method:'PUT',
                url: `/threads/${threadId}/comments/${commentId}/likes`,
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(401)
            expect(responseJson.error).toEqual('Unauthorized')
        })
        it('should response 404 when invalid thread', async () => { 
            // Arrange
            const server = await createServer(container)

            // Add User
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                username: 'dicoding',
                password: 'secret',
                fullname: 'Dicoding Indonesia'
                }
            })

            // login user
            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                username: 'dicoding',
                password: 'secret'
                }
            })
            const {
                data: { accessToken }
            } = JSON.parse(loginResponse.payload)

            //   Add Thread
            const AddThreadresponse = await server.inject({
                method: 'POST',
                url: '/threads',
                headers: {
                authorization: `Bearer ${accessToken}`
                },
                payload: {
                title: 'Senin',
                body: 'Hari ini adalah hari senin'
                }
            })

            const responseThreadJSON = JSON.parse(AddThreadresponse.payload)
            const threadId = responseThreadJSON.data.addedThread.id

            // Add Comment
            const addCommentResponse = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                headers: {
                authorization: `Bearer ${accessToken}`
                },
                payload: {
                content: 'P Balap'
                }
            })

            const responseCommentJSON = JSON.parse(addCommentResponse.payload)
            const commentId = responseCommentJSON.data.addedComment.id

            // Action
            const response = await server.inject({
                method:'PUT',
                url: `/threads/xxx/comments/${commentId}/likes`,
                headers: {
                    authorization: `Bearer ${accessToken}`
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(404)
            expect(responseJson.status).toEqual('fail')
        })
        it('should response 404 when invalid comment', async () => { 
            // Arrange
            const server = await createServer(container)

            // Add User
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                username: 'dicoding',
                password: 'secret',
                fullname: 'Dicoding Indonesia'
                }
            })

            // login user
            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                username: 'dicoding',
                password: 'secret'
                }
            })
            const {
                data: { accessToken }
            } = JSON.parse(loginResponse.payload)

            //   Add Thread
            const AddThreadresponse = await server.inject({
                method: 'POST',
                url: '/threads',
                headers: {
                authorization: `Bearer ${accessToken}`
                },
                payload: {
                title: 'Senin',
                body: 'Hari ini adalah hari senin'
                }
            })

            const responseThreadJSON = JSON.parse(AddThreadresponse.payload)
            const threadId = responseThreadJSON.data.addedThread.id

            // Add Comment
            const addCommentResponse = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                headers: {
                authorization: `Bearer ${accessToken}`
                },
                payload: {
                content: 'P Balap'
                }
            })

            const responseCommentJSON = JSON.parse(addCommentResponse.payload)
            const commentId = responseCommentJSON.data.addedComment.id

            // Action
            const response = await server.inject({
                method:'PUT',
                url: `/threads/${threadId}/comments/${commentId}xxx/likes`,
                headers: {
                    authorization: `Bearer ${accessToken}`
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(404)
            expect(responseJson.status).toEqual('fail')
        })
    })
})