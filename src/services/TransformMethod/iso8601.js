import moment from "moment"

/**
 *  Convertisseur à utiliser lors du chargement des données depuis l'import csv (entre autre)
 *  Il remplace une date en fomat texte 'YYYY-MM-DD' en un objet Date
 * 
 * @params {Object} d : l'objet source
 * @param {string} date - la date sous format YYYYMMDD
 * @param {(float|integer)} value - le nombre associer 
 * @return {DataPoint}
 */
export default (d) => {
	return {
		"date" : moment(d.date, 'YYYY-MM-DD').toDate(),
		"value" : d.value
	}
}