exports.up = (pgm) => {
  pgm.createTable('replies', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    content: {
      type: 'TEXT',
      notNull: true
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    is_delete: {
      type: 'BOOLEAN',
      notNull: true,
      default: pgm.func(false),
    },
    date: {
      type: 'VARCHAR(50)',
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    threads_id: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    comments_id: {
      type: 'VARCHAR(50)',
      notNull: true
    }
  })
  pgm.addConstraint(
    'replies',
    'fk_replies.owner_users.id',
    'FOREIGN KEY (owner) REFERENCES users(id) ON DELETE CASCADE'
  )
  pgm.addConstraint(
    'replies',
    'fk_replies.threadsId_threads.id',
    'FOREIGN KEY (threads_id) REFERENCES threads(id) ON DELETE CASCADE'
  )

  pgm.addConstraint(
    'replies',
    'fk_replies.commentsId_comments.id',
    'FOREIGN KEY (comments_id) REFERENCES comments(id) ON DELETE CASCADE'
  )
}

exports.down = (pgm) => {
  pgm.dropConstraint('replies', 'fk_replies.commentsId_comments.id')
  pgm.dropConstraint('replies', 'fk_replies.threadsId_threads.id')
  pgm.dropConstraint('replies', 'fk_replies.owner_users.id')
  pgm.dropTable('replies')
}
