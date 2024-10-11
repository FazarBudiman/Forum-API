class PostThread {
    constructor(payload) {
        const { title, body } = payload

        this.title = title
        this.body = body

        this._verifyPayload(payload)
    }

    _verifyPayload({title, body}){
        if (!title || !body) {
            throw new Error("POST_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
        }

        if (typeof title !== 'string' || typeof body !== 'string') {
            throw new Error("POST_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
        }
    }
}

module.exports = PostThread;