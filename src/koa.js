const Koa = require('koa');
const KoaRouter = require('koa-router');
const koaBody = require('koa-bodyparser');
const { graphqlKoa, graphiqlKoa } = require('graphql-server-koa');
const schema = require('./schema');

const app = new Koa();
const router = new KoaRouter();
const PORT = 3000;

// koaBody is needed just for POST.
app.use(koaBody());

router.post('/graphql', graphqlKoa({ endpointURL: '/graphql', schema }));
router.get('/graphql', graphqlKoa({ endpointURL: '/graphql', schema }));
router.post('/graphiql', graphiqlKoa({ endpointURL: '/graphql', schema }));
router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql', schema }));

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(PORT);
