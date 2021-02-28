const fs = require('fs');
const http = require('http');
const parse = require('node-html-parser').parse;
const axios = require('axios');

const URLS = {
	proveedores:
		'https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json',
	clientes:
		'https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json'
};

const getFileContent = (callback) => {
	fs.readFile('index.html', (err, data) => {
		callback(data.toString());
	});
};

function setProveedores(callback) {
	axios
		.get(URLS['proveedores'])
		.then((response) => {
			let json = response.data;
			fs.readFile('index.html', (err, data) => {
				if (err) throw err;

				const root = parse(data.toString());
				const body = root.querySelector('body');
				const table = body.querySelector('#table1');

				const thead = table.querySelector('thead');
				const tbody = table.querySelector('tbody');

				const tTitle = thead.querySelector('#tTitle');
				const tSubtitles = thead.querySelector('#tSubtitles');

				const keys = [ 'idproveedor', 'nombrecompania', 'nombrecontacto' ];

				tTitle.appendChild(parse('<h1>Listado de Proveedores</h1>'));

				let keysAppend = [];

				keys.forEach((key) => keysAppend.push(parse('<th scope="col">' + key + '</th>')));

				tSubtitles.set_content(keysAppend);

				let itemsAppend = [];

				json.forEach((item) => {
					let row = '';
					keys.forEach((key) => (row += '<th>' + item[key] + '</th>'));
					itemsAppend.push(parse('<tr>' + row + '</tr>'));
				});
				tbody.set_content(itemsAppend);

				callback(root.toString());
			});
		})
		.catch(function(error) {
			// handle error
			console.log(error);
		})
		.then(function() {
			// always executed
		});
}

function setClientes(callback) {
	axios
		.get(URLS['clientes'])
		.then((response) => {
			let json = response.data;
			fs.readFile('index.html', (err, data) => {
				if (err) throw err;

				const root = parse(data.toString());
				const body = root.querySelector('body');
				const table = body.querySelector('#table1');

				const thead = table.querySelector('thead');
				const tbody = table.querySelector('tbody');

				const tTitle = thead.querySelector('#tTitle');
				const tSubtitles = thead.querySelector('#tSubtitles');

				const keys = [ 'idCliente', 'NombreCompania', 'NombreContacto' ];

				tTitle.appendChild(parse('<h1>Listado de Clientes</h1>'));

				let keysAppend = [];

				keys.forEach((key) => keysAppend.push(parse('<th scope="col">' + key + '</th>')));

				tSubtitles.set_content(keysAppend);

				let itemsAppend = [];

				json.forEach((item) => {
					let row = '';
					keys.forEach((key) => (row += '<th>' + item[key] + '</th>'));
					itemsAppend.push(parse('<tr>' + row + '</tr>'));
				});
				tbody.set_content(itemsAppend);

				callback(root.toString());
			});
		})
		.catch(function(error) {
			// handle error
			console.log(error);
		})
		.then(function() {
			// always executed
		});
}

http
	.createServer((req, res) => {
		if (req.url == '/api/proveedores') {
			setProveedores((data) => {
				res.end(data);
			});
		}
		else if (req.url == '/api/clientes') {
			setClientes((data) => {
				res.end(data);
			});
		}
		else {
			res.end('Esta página no existe');
		}
	})
	.listen(8081);
