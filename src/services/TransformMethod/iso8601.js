import { parse } from "date-fns"

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
		"date" : parse(d.date, "yyyy-MM-dd", new Date() ),
		"value" : d.value
	}
}