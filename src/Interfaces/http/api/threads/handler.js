const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase')
const GetDetailThreadUseCase = require('../../../../Applications/use_case/GetDetailThreadUseCase')

class ThreadsHandler{
    constructor(container){
        this._container = container
        this.postThreadHandler = this.postThreadHandler.bind(this)
        this.getDetailThreadHandler = this.getDetailThreadHandler.bind(this)
    }

    async postThreadHandler(request, h){
        const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name)
        const {id: owner} = request.auth.credentials
        const createdAt = new Date().toISOString()
        const payload = {
            ...request.payload,
            owner,
            createdAt
        }
        const addedThread = await addThreadUseCase.execute(payload)
        const response = h.response({
            status: 'success',
            data: {
                addedThread
            }
        })
        response.code(201)
        return response
    }

    async getDetailThreadHandler(request, h){
        const {threadId} = request.params
        const getDetailThreadUseCase = this._container.getInstance(GetDetailThreadUseCase.name)
        const payload = {
            threadId: threadId
        }
        const thread = await getDetailThreadUseCase.execute(payload)
        const  response = h.response({
            status: 'success',
            data: {
                thread
            }
        })
        response.code(200)
        return response;
    }
}
module.exports = ThreadsHandler;