class ThreadGetDetailUseCase {
  constructor({ likesCommentRepository, commentRepository, threadRepository, repliesRepository }) {
    this._likesCommentRepository = likesCommentRepository
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
    this._repliesRepository = repliesRepository
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload

    const thread = await this._threadRepository.getDetailThread(threadId)

    const commentDetail =
      await this._commentRepository.getCommentInThread(threadId)

    const comments = await Promise.all(
      commentDetail.map(async (comment) => {
        const likeComment = await this._likesCommentRepository.getCountLikeInComment(comment.id)
        const likeCount = parseInt(likeComment)
        
        // Jika komentar dihapus, ubah kontennya
        if (comment.is_delete) {
          comment.content = '**komentar telah dihapus**'
        }

        // Ambil balasan untuk setiap komentar
        const replies = await this._repliesRepository.getRepliesInComment(
          comment.id
        )

        // Map balasan untuk membangun struktur balasan
        const mappedReplies = replies.map((reply) => ({
          id: reply.id,
          content:
            reply.is_delete == true
              ? '**balasan telah dihapus**'
              : reply.content,
          date: reply.date,
          username: reply.username
        }))

        return {
          id: comment.id,
          username: comment.username,
          date: comment.date,
          content: comment.content,
          likeCount: likeCount,
          replies: mappedReplies
        }
      })
    )
    return {
      ...thread,
      comments
    }
  }
}

module.exports = ThreadGetDetailUseCase
