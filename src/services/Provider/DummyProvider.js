/**
 * Ce simple "provider" est utilisé pour fournier des données statiques pour les tests
 * 
 * @class
 */
class DummyProvider {
	
    constructor() {
    }

    async dataSet( ) {
        return [ 
			{"date": "19700101", "value" :"4"},
			{"date": "19700201", "value" :"0"},
			{"date": "19700301", "value" :"0"},
			{"date": "19700401", "value" :"3"},
			{"date": "19700501", "value" :"5"}
		]
    }

}

export default DummyProvider