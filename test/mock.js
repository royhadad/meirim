const Promise = require('bluebird');

const mockDatabase = {
	 connection: null,

	 initialize: function(clientConnection) {
		if (this.connection != null){
			 return this.connection;
		}

		this.connection = clientConnection;

		console.log('DATABASE CONNECTION CONFIG', this.connection.knex.context.client.config);
		return this.connection;
	 },

	 truncate: function(tables) {
		const connection = this.connection;
		return Promise.each(tables, function (table) {
			return connection.knex.schema.hasTable(table).then(function(exists) {
				if(exists){
					console.log(`dropping table ${table}`);
    			return connection.knex.schema.dropTable(table);
				}
			});
		});
	 },

	 seed: function(tables, seeders) {
		const connection = this.connection;
		return Promise.each(tables, function (table, index) {
			return connection.knex.schema.hasTable(table).then(async function(exists) {
				if(!exists) {
					console.log(`creating table ${table}`);
					await connection.knex.schema.createTable(table, function(t){
						const seeder = seeders[index];
						seeder(t);
					});
					// return connection.knex('person').insert({firstName: 'first'});
   		} 
			});
		});
	}
};

module.exports = {
	mockDatabase
};