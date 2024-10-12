const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper")
const pool = require("../../database/postgres/pool")


describe('CommentRepositoryPostgres', () => { 
    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable() 
    })

    afterAll(async () => {
        await pool.end()
    })

    describe('addComment function', () => {
        it('should persist post comment and return posted comment correctly', async () => {
            // TODO: Impelement
        })
        it('should return posted comment correctly', async () => {
            // TODO: Impelement
        })
    })

    describe('checkThreadIsExist function', () => { 
        it('should throw NotFoundError when threads not exist', () => {
            // TODO: implement
         })
        it('should not throw NotFoundError when threads exist', () => {
            // TODO: implement
         })
     })
 })