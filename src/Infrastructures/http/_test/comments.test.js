const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper")
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const pool = require("../../database/postgres/pool")
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper")
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper")
const createServer = require("../createServer")
const container = require("../../container")

describe('/threads/{threadId}/comments', () => { 
    afterAll(async () => {
        await pool.end()
    })

    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable()
        await ThreadsTableTestHelper.cleanTable()
        await AuthenticationsTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
    })
    describe('when POST /threads/{threadId}/comments ', () => {
        it('should response 201 and posted comment', async () => { 
            // Arrange
            const server = await createServer(container)

            // Add User
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                username: 'dicoding',
                password: 'secret',
                fullname: 'Dicoding Indonesia',
                },
            });
          
            // login user
            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                username: 'dicoding',
                password: 'secret',
                },
            });
            const { data: { accessToken } } = JSON.parse(loginResponse.payload);

            //   Add Thread
            const AddThreadresponse = await server.inject({
                method: 'POST',
                url: '/threads',
                headers: {
                    authorization : `Bearer ${accessToken}`
                },
                payload:{
                    title: "Senin",
                    body: "Hari ini adalah hari senin"
                }
            })

            const responseThreadJSON = JSON.parse(AddThreadresponse.payload)
            const threadId = responseThreadJSON.data.addedThread.id 
            
            // Action
            const response = await server.inject({
                method: 'POST',
                url:`/threads/${threadId}/comments`,
                headers: {
                    authorization: `Bearer ${accessToken}`
                },
                payload: {
                    "content": "P Balap"
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(201)
            expect(responseJson.status).toEqual('success')
            expect(responseJson.data.addedComment).toBeDefined()
        }),

        it('should response 400 and if bad payload', async () => { 
            // Arrange
            const server = await createServer(container)

            // Add User
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                username: 'dicoding',
                password: 'secret',
                fullname: 'Dicoding Indonesia',
                },
            });
          
            // login user
            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                username: 'dicoding',
                password: 'secret',
                },
            });
            const { data: { accessToken } } = JSON.parse(loginResponse.payload);

            //   Add Thread
            const AddThreadresponse = await server.inject({
                method: 'POST',
                url: '/threads',
                headers: {
                    authorization : `Bearer ${accessToken}`
                },
                payload:{
                    title: "Senin",
                    body: "Hari ini adalah hari senin"
                }
            })

            const responseThreadJSON = JSON.parse(AddThreadresponse.payload)
            const threadId = responseThreadJSON.data.addedThread.id 
            
            // Action
            const response = await server.inject({
                method: 'POST',
                url:`/threads/${threadId}/comments`,
                headers: {
                    authorization: `Bearer ${accessToken}`
                },
                payload: {
                    "contet": 1231141
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.status).toEqual('fail')
        })


        it('should response 401 and if not token authorization', async () => { 
            // Arrange
            const server = await createServer(container)

            // Add User
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                username: 'dicoding',
                password: 'secret',
                fullname: 'Dicoding Indonesia',
                },
            });
          
            // login user
            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                username: 'dicoding',
                password: 'secret',
                },
            });
            const { data: { accessToken } } = JSON.parse(loginResponse.payload);

            //   Add Thread
            const AddThreadresponse = await server.inject({
                method: 'POST',
                url: '/threads',
                headers: {
                    authorization : `Bearer ${accessToken}`
                },
                payload:{
                    title: "Senin",
                    body: "Hari ini adalah hari senin"
                }
            })

            const responseThreadJSON = JSON.parse(AddThreadresponse.payload)
            const threadId = responseThreadJSON.data.addedThread.id 
            
            // Action
            const response = await server.inject({
                method: 'POST',
                url:`/threads/${threadId}/comments`,
                payload: {
                    "contet": 'P Balap'
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(401)
            expect(responseJson.error).toEqual('Unauthorized')
        })

        it('should response 401 and if not token authorization', async () => { 
            // Arrange
            const server = await createServer(container)

            // Add User
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                username: 'dicoding',
                password: 'secret',
                fullname: 'Dicoding Indonesia',
                },
            });
          
            // login user
            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                username: 'dicoding',
                password: 'secret',
                },
            });
            const { data: { accessToken } } = JSON.parse(loginResponse.payload);

            //   Add Thread
            const AddThreadresponse = await server.inject({
                method: 'POST',
                url: '/threads',
                headers: {
                    authorization : `Bearer ${accessToken}`
                },
                payload:{
                    title: "Senin",
                    body: "Hari ini adalah hari senin"
                }
            })

            const responseThreadJSON = JSON.parse(AddThreadresponse.payload)
            const threadId = responseThreadJSON.data.addedThread.id 
            
            // Action
            const response = await server.inject({
                method: 'POST',
                url:`/threads/xxx/comments`,
                headers: {
                    authorization: `Bearer ${accessToken}`
                },
                payload: {
                    "content": 'P Balap'
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(404)
            expect(responseJson.status).toEqual('fail')
        })
    })
 })