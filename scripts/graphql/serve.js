import Koa from 'koa';
import mount from 'koa-mount';
import { createHandler } from 'graphql-http/lib/use/koa';
import { user_schema } from './lib/user_schema';

const app = new Koa();


// 定义数据源
const users = [
    { id: '1', name: 'Alice', age: 25, email: 'alice@example.com', posts: [{ id: '1', title: 'First Post', content: 'Hello world!' }] },
    { id: '2', name: 'Bob', age: 30, email: 'bob@example.com', posts: [{ id: '2', title: 'Second Post', content: 'What a wonderful day!' }] },
  ];
// 定义resolvers
const root = {
    hello: () => 'Hello, world!',
    user: ({ id }) => users.find(user => user.id === id),
  };

// 将GraphQL服务挂载到'/graphql'路径下
app.use(mount('/graphql', createHandler({
    schema: user_schema,
    rootValue: root,
    graphiql: true // 开启GraphQL的可视化界面
  })));

// 启动服务器
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
