const LikesCommentHandler = require("./handler")
const routes = require("./routes")

module.exports = {
    name:'likeComment',
    register: async (server, { container }) => {
        const likeComment = new LikesCommentHandler(container)
        server.route(routes(likeComment))
    }
}