const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper")
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper")
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper")
const container = require("../../container")
const pool = require("../../database/postgres/pool")
const createServer = require("../createServer")

describe('/threads endpoint', () => { 
    afterAll(async () => {
        await pool.end()
    })

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
        await AuthenticationsTableTestHelper.cleanTable()
    })

    describe('when POST /threads', () => {
        it('should return 201 and posted thread', async () => { 
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

            //   Action
            const response = await server.inject({
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

            //   Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(201)
            expect(responseJson.status).toEqual('success')
            expect(responseJson.data.addedThread).toBeDefined()
        }),

        it('should return 400 if bad payload', async () => { 
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

            //   Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                headers: {
                    authorization : `Bearer ${accessToken}`
                },
                payload:{
                    title: 123,
                    body: "Hari ini adalah hari senin"
                }
            })

            //   Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.status).toEqual('fail')
        }),

        it('should return 401 if no token authorizaation', async () => { 
            // Arrange
            const server = await createServer(container)

            //   Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload:{
                    title: 123,
                    body: "Hari ini adalah hari senin"
                }
            })

            //   Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(401)
            expect(responseJson.error).toEqual('Unauthorized')
        })
    })
 })