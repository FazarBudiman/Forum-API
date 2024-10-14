const UserAddUseCase = require('../../../../Applications/use_case/UserAddUseCase')

class UsersHandler {
  constructor(container) {
    this._container = container

    this.postUserHandler = this.postUserHandler.bind(this)
  }

  async postUserHandler(request, h) {
    const userAddUseCase = this._container.getInstance(UserAddUseCase.name)
    const addedUser = await userAddUseCase.execute(request.payload)

    const response = h.response({
      status: 'success',
      data: {
        addedUser
      }
    })
    response.code(201)
    return response
  }
}

module.exports = UsersHandler
