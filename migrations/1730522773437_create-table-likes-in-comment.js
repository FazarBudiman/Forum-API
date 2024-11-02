exports.up = pgm => {
    pgm.createTable('likes_in_comment', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        comments_id :{
            type:'VARCHAR(50)',
            notNull: true
        },
        is_liked: {
            type: 'BOOLEAN',
            notNull: true,
        }
    })

    pgm.addConstraint(
        'like_in_comment',
        'fk_like-in-comment.owner_users.id',
        'FOREIGN KEY (owner) REFERENCES users(id) ON DELETE CASCADE'
    )
    pgm.addConstraint(
        'like_in_comment',
        'fk_like-in-comment.commentsId_comments.id',
        'FOREIGN KEY (comments_id) REFERENCES comments(id) ON DELETE CASCADE'
    )
};

exports.down = pgm => {
    pgm.addConstraint('like_in_comment', 'fk_like-in-comment.owner_users.id')
    pgm.addConstraint('like_in_comment','fk_like-in-comment.commentsId_comments.id')
    pgm.dropTable('like_in_comment')
};
