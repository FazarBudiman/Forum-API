class CommentRepository {
    async addComment(comment){
        throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    }

    async checkCommentIsExist(id){
        throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    }

    async checkCommentOwner(commentId, commentOwnerId){
        throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    }

    async deleteComment(id){
        throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
        
    }
}

module.exports = CommentRepository;