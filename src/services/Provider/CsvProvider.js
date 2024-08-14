import * as d3 from 'd3'

import bigEndian from "../TransformMethod/bigEndian"
import iso8601 from "../TransformMethod/iso8601"


/**
 * @typeref {Object} ParamsCsv - les paramètres pour le type de provider "csv"
 * @property {string} params.url - l'url vers le fichier csv, locale ou distante
 * @property {string} params.separator - le séparateur à utiliser, "," par défaut
 * @property {string} params.transform - le nom de la méthode de transformation à appliquer sur les données, par défaut d3.autoType
 */

/**
 * Ce provider prend en charge la transformation de fichier csv en tableau json
 * Les paramètres sont fournis par le DataService depuis la configuration (datasource.json)
 * 
 * @class
 */
class CsvProvider {
	
	// les types de transformations possibles pour les dates
	#transform = { bigEndian, iso8601 }
	
	// les paramètres de configuration de ce provider comme l'url du fichier source
	#params = {}
	
	/**
	 * 
	 * @param {ParamsCsv} params - les paramètres de configuration de ce provider comme l'url du fichier source
	 * @returns {CsvProvider}
	 */
    constructor( params ) {		
		this.#params = Object.assign( {}, params)
    }

	/**
	 * Recupère les données en fonction des paramètres du dataset et des filtres
	 * @returns {Object[]} - le tableau des valeurs du csv, converties en json
	 * 
	 */
    async dataSet( ) {
		
		// on charge le fichier original, l'url peut être locale, ou distante
		const response = await fetch( this.#params.url )
		
		if( response.ok == false ) {
			throw new Error( `resource ${this.#params.url} inconnu`)
		}

		try {	
			// on applique une methode de convestion correspondant au format du dataset /csv
			const t = this.#params.transform  ? this.#transform[ this.#params.transform  ] : d3.autoType
			
			// et on parse les données
			return d3.dsvFormat( this.#params.separator ?? ",").parse( await response.text(), t )

		}catch(e) {
			console.error(  `erreur lors de la récupation des données depuis ${this.#params.url}`)
		}	
		
		return []
    }

}

export default CsvProvider