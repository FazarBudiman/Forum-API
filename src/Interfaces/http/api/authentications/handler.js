const UserLoginUseCase = require('../../../../Applications/use_case/UserLoginUseCase')
const AuthenticationRefreshUseCase = require('../../../../Applications/use_case/AuthenticationRefreshUseCase')
const UserLogoutUseCase = require('../../../../Applications/use_case/UserLogoutUseCase')

class AuthenticationsHandler {
  constructor(container) {
    this._container = container

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this)
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this)
    this.deleteAuthenticationHandler =
      this.deleteAuthenticationHandler.bind(this)
  }

  async postAuthenticationHandler(request, h) {
    const userLoginUseCase = this._container.getInstance(UserLoginUseCase.name)
    const { accessToken, refreshToken } = await userLoginUseCase.execute(
      request.payload
    )
    const response = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken
      }
    })
    response.code(201)
    return response
  }

  async putAuthenticationHandler(request) {
    const authenticationRefreshUseCase = this._container.getInstance(
      AuthenticationRefreshUseCase.name
    )
    const accessToken = await authenticationRefreshUseCase.execute(
      request.payload
    )

    return {
      status: 'success',
      data: {
        accessToken
      }
    }
  }

  async deleteAuthenticationHandler(request) {
    const UserlogoutUseCase = this._container.getInstance(
      UserLogoutUseCase.name
    )
    await UserlogoutUseCase.execute(request.payload)
    return {
      status: 'success'
    }
  }
}

module.exports = AuthenticationsHandler
