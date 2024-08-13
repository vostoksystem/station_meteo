
import hash from 'object-hash'

import DummyProvider from "./Provider/DummyProvider"
import CsvProvider from "./Provider/CsvProvider"

import simpleInterpolation from "./InterpolationMethod/simpleInterpolation"

import datasource from "../assets/datasource.json"

/**
 * @typedef {Object} DataPoint - décrit un point sur le pg
 * @property {Date} date - date correspondant à la mesure 
 * @property {(float|integer)} value - la valeur associé à la date
 */


/**
 * Ce service permet de centraliser les demandes d'accès aux données, en fonction d'un id, est ce quel que soit leurs localisations ou leurs formats source.
 * Avec un service on peut aussi ajouter une gestion de cache, une gestion fifo des demandes, appliquer des régles de sécurités ou de validation des données reçues
 * 
 * @class
 */
class DataService {

	/**
	 * Liste des provider connus
	 * Un provider permet de retrouver des données, leurs configuration est défini dans "datasource.json"
	 * 
	 * @private
	 */
    #providerFactory = { DummyProvider, CsvProvider }

	/**
	 * Liste des méthodes d'interpolation de données connues
	 * Les méthodes d'interpolation servent à remplacer le nombre de données originale par une nouvelle distribution
	 * @private
	 */
	#interpolationFactory = { simpleInterpolation }
    
	// on met en place un cache local afin de minimiser les requettes
	// Ici comme exemple simplement au niveau du singleton main on pourait aussi l'ajouter au local storage afin de faire de l'affichage hors connexion
    #cache = {}

    /**
     * Création du service, à ne pas utiliser directement, passer par getInstance()
	 * @private
     */
    constructor() {
    }

    /**
     * retourne l'instance du service
     * @returns {DataService}
     */
    static getInstance() {
        if (!this.instance) {
            console.log( "... Initialisation du dataService")
            this.instance = new DataService()
        }

        return this.instance;
    }

    /**
     * Récupére un set de données, borné à maxitem
	 * Les filtres sont préalablement appliqué dans l'ordre du tableau.
	 * Les filtres doivennt être nommé implicitement en fonction du filtrage réalisé. Deux filtres s'applicant sur des dates différentes doivent être nommé différement
	 * 
     * @param {string} id - l'id du type de données attendu
	 * @param {integer} maxItem - nombre maximum d'éléments à retourner depuis le dataset (0 pour tous)
	 * @param {Filter[]} filters - liste de filtre à appliquer sur les données 
     * @returns {DataPoint[]}
     */
    async dataSet( id, maxItem = 0, filters = [] ) {
        console.log(`chargement dataset : ${id}`)
       
        // verifier si dans le cache
		const key = this.hashKey(id, maxItem, filters)
		
		console.log(`key : ${key}`)
		
		// @nota : dans une "full" application il faudrait mettre en place une fifo sur les demandes afin de traiter les requettes multiples  avec une latence courte 
		if( this.#cache[key]) {
			console.log(`requette sur ${id} depuis le cache`)
			return this.#cache[key]
		}
		
        // on verifie si ce dataset peut être résolu
        if( datasource[id] == undefined) {
            throw new Error( `datasource ${id} inconnu`)
        }

		// nouveau set de données, on va recherche dans la liste des provider celui correspondant à "id", les données seront ensuite converti dans le format souhaité pour l'affichage par la méthode d'interpolation associée
        try {
            const provider = new (this.#providerFactory[ datasource[id].provider ])(datasource[id].params)
            
			// on récupére les données depuis le provider, déjà formaté 
            let data = await provider.dataSet( datasource[id].params )
			
			// on applique les filtres demandés
			try {
				for( const filter of filters) {
				   data = data.filter( filter.fn )
				}	
			}catch(e) {
				console.log(`erreur sur les filtres ${datasource[id]}`)
			}
			
			// on applique la méthode d'interpolation			
			if( datasource[id].interpolation && maxItem ) {
				try {					
					data = this.#interpolationFactory[ datasource[id].interpolation ](data, maxItem )					
				}catch(e) {
					console.error( `interpolation ${datasource[id].interpolation} inconnue`)
				}	
				
				// pas d'interpolation mais taille limite
			} else if( maxItem ) {
				data = data.slice(0, maxItem)
			}
            
            //on ajoute au cache
			this.#cache[key] = data
				
            return data
            
        } catch( e ) {
            console.error( `Erreur lors de la création du provider ${datasource[id].provider}` )    
        }

		// erreur, rien à retourner
        return []
    }
	
	/**
	 * calcule une clé de hash en fonction des paramètres de recherche du dataset
	 * @param {string} id - l'id du data set
	 * @param {integer} maxItem - le nombre maximun d'échantillon à retourner
	 * @param {Filter[]} filters - les filtres à appliquer
	 * @returns {string} - une clé de hashage unique pour ces paramètres
	 */
	hashKey( id, maxItem = 0, filters = []) {	
		return hash( [
		   id,
		   maxItem,
		   filters.reduce( (accumulator, currentValue) => accumulator + currentValue.id, "")
		], {algorithm: 'md5'} )
	}

}

export default DataService