const app = require('express')();
const { response, request } = require('express');
const faunaDB = require('faunadb');
const { FAUNADB_KEY } = require('../secrets');
const {
	Get,
	Select,
	Ref,
	Collection,
	Match,
	Index,
	Create,
	Paginate,
	Function: Fn,
	Call,
} = faunaDB.query;

const client = new faunaDB.Client({ secret: FAUNADB_KEY });

app.listen(5000, () =>
	console.log('API encendida en http://localhost:5000')
);

app.get('/tweet/:id', async (request, response) => {
	const item = await client
		.query(Get(Ref(Collection('tweets'), request.params.id)))
		.catch((error) => response.send(error));
	response.send(item);
});

app.get('/tweet', async (request, response) => {
	const items = await client
		.query(
			Paginate(
				Match(
					Index('tweets_by_user'),
					Call(Fn('getUser'), 'Alice')
				)
			)
		)
		.catch((error) => console.log(error));
	response.send(items);
});

app.post('/tweet', async (request, response) => {
	const data = {
		user: Call(Fn('getUser'), 'Alice'),
		text: 'Hola Mundo!',
	};
	const item = await client
		.query(Create(Collection('tweets'), { data }))
		.catch((error) => console.log(error));
	response.send(item);
});

app.post('/relationship', async (request, response) => {
	const data = {
		follower: Call(Fn('getUser'), 'Bob'),
		followee: Call(Fn('getUser'), 'Alice'),
	};
	const items = await client.query(
		Create(Collection('relationships'), { data })
	);
});
