const InvariantError = require('../../Commons/exceptions/InvariantError')
const AuthenticationRepository = require('../../Domains/authentications/AuthenticationRepository')

class AuthenticationRepositoryPostgres extends AuthenticationRepository {
  constructor(pool) {
    super()
    this._pool = pool
  }

  async addToken(token) {
    const query = `INSERT INTO authentications VALUES ('${token}')`
    await this._pool.query(query)
  }

  async checkAvailabilityToken(token) {
    const query = `SELECT * FROM authentications WHERE token = '${token}'`
    const result = await this._pool.query(query)

    if (result.rows.length === 0) {
      throw new InvariantError('refresh token tidak ditemukan di database')
    }
  }

  async deleteToken(token) {
    const query = `DELETE FROM authentications WHERE token = '${token}'`
    await this._pool.query(query)
  }
}

module.exports = AuthenticationRepositoryPostgres
