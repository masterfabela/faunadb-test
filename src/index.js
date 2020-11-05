const app = require('express')();
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

app.post('/tweet', async (request, response) => {
	const data = {
		user: Select(
			'ref',
			Get(Match(Index('users_by_name'), 'Alice'))
		),
		text: 'Hola Mundo!',
	};
	const item = await client
		.query(Create(Collection('tweets'), { data }))
		.catch((error) => console.log(error));
	response.send(item);
});
