class GetDetailThreadUseCase {
    constructor({commentRepository, threadRepository}) {
        this._commentRepository = commentRepository
        this._threadRepository = threadRepository
    }

    async execute(useCasePayload){
        const {threadId} = useCasePayload
        
        const comments = await this._commentRepository.getCommentInThread(threadId)
        const thread = await this._threadRepository.getThreadDetail(threadId)
        return {
            ...thread,
            comments
        }
    }
    
}

module.exports = GetDetailThreadUseCase