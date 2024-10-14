const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository')
const UserLogoutUseCase = require('../UserLogoutUseCase')

describe('UserLogoutUseCase', () => {
  it('should throw error if use case payload not contain refresh token', async () => {
    // Arrange
    const useCasePayload = {}
    const userLogoutUseCase = new UserLogoutUseCase({})

    // Action & Assert
    await expect(
      userLogoutUseCase.execute(useCasePayload)
    ).rejects.toThrowError(
      'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN'
    )
  })

  it('should throw error if refresh token not string', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 123
    }
    const userLogoutUseCase = new UserLogoutUseCase({})

    // Action & Assert
    await expect(
      userLogoutUseCase.execute(useCasePayload)
    ).rejects.toThrowError(
      'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })

  it('should orchestrating the delete authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refreshToken'
    }
    const mockAuthenticationRepository = new AuthenticationRepository()
    mockAuthenticationRepository.checkAvailabilityToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockAuthenticationRepository.deleteToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve())

    const userLogoutUseCase = new UserLogoutUseCase({
      authenticationRepository: mockAuthenticationRepository
    })

    // Act
    await userLogoutUseCase.execute(useCasePayload)

    // Assert
    expect(
      mockAuthenticationRepository.checkAvailabilityToken
    ).toHaveBeenCalledWith(useCasePayload.refreshToken)
    expect(mockAuthenticationRepository.deleteToken).toHaveBeenCalledWith(
      useCasePayload.refreshToken
    )
  })
})
