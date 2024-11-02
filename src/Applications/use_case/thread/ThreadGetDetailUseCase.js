class ThreadGetDetailUseCase {
  constructor({ commentRepository, threadRepository, repliesRepository }) {
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
        // Ambil balasan untuk setiap komentar
        const replies = await this._repliesRepository.getRepliesInComment(
          comment.id
        )
        // Jika komentar dihapus, ubah kontennya
        if (comment.is_delete) {
          comment.content = '**komentar telah dihapus**'
        }

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
