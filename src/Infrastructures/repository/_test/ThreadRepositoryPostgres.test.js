const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper")
const pool = require("../../database/postgres/pool")
const PostThread = require('../../../Domains/threads/entities/PostThread')
const PostedThread = require('../../../Domains/threads/entities/PostedThread')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')
const RegisterUser = require("../../../Domains/users/entities/RegisterUser")
const UserRepositoryPostgres = require("../UserRepositoryPostgres")
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper")

describe('ThreadRepositoryPostgres', () => {
    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable()
    })

    afterAll(async () => {
        await pool.end()
    })

    describe('addThread function', () => {
        it('should persist post thread and return posted thread correctly', async  () => { 
            // Create user for add thread
            const fakeIdGenerator = () => '123'; // stub!

            const registerUser = new RegisterUser({
                username: 'dicoding',
                password: 'secret_password',
                fullname: 'Dicoding Indonesia',
              });
              
              const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
              await userRepositoryPostgres.addUser(registerUser);
              const result = await UsersTableTestHelper.findUsersById('user-123');              
              const { id } = result[0]
              expect(id).toEqual('user-123')
              
            // Arrange
            const postThread = new PostThread({
                title: 'Senin', 
                body:'Hari ini adalah hari senin', 
                owner: id, 
                createdAt:'2024-12-11'
            })
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

            // Action
            await threadRepositoryPostgres.addThread(postThread)

            // Assert
            const threads = await ThreadsTableTestHelper.getThreadDetail('thread-123')
            expect(threads).toHaveLength(1)
         })



         it('should return registered thread coorectly', async () => {
            // Create user for add thread
            const fakeIdGenerator = () => '123'; // stub!

            const registerUser = new RegisterUser({
                username: 'dicoding',
                password: 'secret_password',
                fullname: 'Dicoding Indonesia',
              });
              
              const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
              await userRepositoryPostgres.addUser(registerUser);
              const result = await UsersTableTestHelper.findUsersById('user-123');              
              const { id } = result[0]
              expect(id).toEqual('user-123')
              
            // Arrange
            const postThread = new PostThread({
                title: 'Senin', 
                body:'Hari ini adalah hari senin', 
                owner: id, 
                createdAt:'2024-12-11'
            })
            
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

            // Action
            const postedThread = await threadRepositoryPostgres.addThread(postThread)

            // Assert
            expect(postedThread).toStrictEqual( new PostedThread ({
                id: 'thread-123',
                title: 'Senin',
                owner: id
            }))

         })
    })
})