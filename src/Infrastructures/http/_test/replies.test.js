const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const container = require('../../container')
const pool = require('../../database/postgres/pool')
const createServer = require('../createServer')

describe('/threads/{threadId}/comments/{commentId}/replies', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await AuthenticationsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and posted replies', async () => {
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
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        headers: {
          authorization: `Bearer ${accessToken}`
        },
        payload: {
          content: 'Gasssss Mas'
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedReply).toBeDefined()
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
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: {
          content: 'Gasssss Mas'
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.error).toEqual('Unauthorized')
    })
    it('should response 404 if thread is not exist ', async () => {
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
        method: 'POST',
        url: `/threads/xxx/comments/${commentId}/replies`,
        headers: {
          authorization: `Bearer ${accessToken}`
        },
        payload: {
          content: 'Gasssss Mas'
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
    })
    it('should response 404 if comment is not exist', async () => {
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
      await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: {
          authorization: `Bearer ${accessToken}`
        },
        payload: {
          content: 'P Balap'
        }
      })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/xxx/replies`,
        headers: {
          authorization: `Bearer ${accessToken}`
        },
        payload: {
          content: 'Gasssss Mas'
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
    })
    it('should response 400 if bad payload', async () => {
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
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        headers: {
          authorization: `Bearer ${accessToken}`
        },
        payload: {
          content: 12332
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
    })
  })
  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 200 and reply deleted', async () => {
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

      const addRepliesResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        headers: {
          authorization: `Bearer ${accessToken}`
        },
        payload: {
          content: 'Gasssss Mas'
        }
      })
      const responseRepliesJSON = JSON.parse(addRepliesResponse.payload)
      const repliesId = responseRepliesJSON.data.addedReply.id

      //  Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${repliesId}`,
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      })
      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })
    it('should response 404 if reply is not exist', async () => {
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

      const addRepliesResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        headers: {
          authorization: `Bearer ${accessToken}`
        },
        payload: {
          content: 'Gasssss Mas'
        }
      })
      const responseRepliesJSON = JSON.parse(addRepliesResponse.payload)
      const repliesId = responseRepliesJSON.data.addedReply.id

      //  Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${repliesId}+123`,
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      })
      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
    })
    it('should response 403 if reply is not owner', async () => {
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

      // Add User 2
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'ucok',
          password: 'secretPassword',
          fullname: 'Dicoding Indonesia'
        }
      })

      // login user 2
      const loginResponse2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'ucok',
          password: 'secretPassword'
        }
      })
      const loginResponse2JSON = JSON.parse(loginResponse2.payload)
      const accessToken2 = loginResponse2JSON.data.accessToken

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

      const addRepliesResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        headers: {
          authorization: `Bearer ${accessToken}`
        },
        payload: {
          content: 'Gasssss Mas'
        }
      })
      const responseRepliesJSON = JSON.parse(addRepliesResponse.payload)
      const repliesId = responseRepliesJSON.data.addedReply.id

      //  Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${repliesId}`,
        headers: {
          authorization: `Bearer ${accessToken2}`
        }
      })
      // Assert
      const responseJson = JSON.parse(response.payload)
      // console.log(responseJson)
      expect(response.statusCode).toEqual(403)
      expect(responseJson.status).toEqual('fail')
    })
  })
})
