/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('comments', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        content: {
            type: 'TEXT',
            notNull: true,
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        threads_id:{
            type:'VARCHAR(50)',
            notNull: true
        },
        is_delete: {
            type: 'BOOLEAN',
            notNull: true
        },
        createdAt: {
            type: 'TIMESTAMP',
            notNull: true,
        }
    })

    pgm.addConstraint('comments', 'fk_comments.owner_users.id', 'FOREIGN KEY (owner) REFERENCES users(id) ON DELETE CASCADE')
    pgm.addConstraint('comments', 'fk_comments.threadsId_threads.id', 'FOREIGN KEY (threads_id) REFERENCES threads(id) ON DELETE CASCADE')
};

exports.down = pgm => {
    pgm.dropConstraint('comments', 'fk_comments.threadsId_threads.id')
    pgm.dropConstraint('comments', 'fk_comments.owner_users.id')
    pgm.dropTable('comments')
};
