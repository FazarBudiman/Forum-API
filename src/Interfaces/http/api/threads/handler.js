const ThreadAddUseCase = require('../../../../Applications/use_case/ThreadAddUseCase')
const ThreadGetDetailUseCase = require('../../../../Applications/use_case/ThreadGetDetailUseCase')

class ThreadsHandler {
  constructor(container) {
    this._container = container
    this.postThreadHandler = this.postThreadHandler.bind(this)
    this.getDetailThreadHandler = this.getDetailThreadHandler.bind(this)
  }

  async postThreadHandler(request, h) {
    const threadAddUseCase = this._container.getInstance(ThreadAddUseCase.name)
    const { id: owner } = request.auth.credentials
    const createdAt = new Date().toISOString()
    const payload = {
      ...request.payload,
      owner,
      createdAt
    }
    const addedThread = await threadAddUseCase.execute(payload)
    const response = h.response({
      status: 'success',
      data: {
        addedThread
      }
    })
    response.code(201)
    return response
  }

  async getDetailThreadHandler(request, h) {
    const { threadId } = request.params
    const threadGetDetailUseCase = this._container.getInstance(
      ThreadGetDetailUseCase.name
    )
    const payload = {
      threadId: threadId
    }
    const thread = await threadGetDetailUseCase.execute(payload)
    const response = h.response({
      status: 'success',
      data: {
        thread
      }
    })
    response.code(200)
    return response
  }
}
module.exports = ThreadsHandler
