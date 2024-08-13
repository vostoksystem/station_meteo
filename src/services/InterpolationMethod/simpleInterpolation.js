/**
 * Les méthodes d'interpolation servent à remplacer le nombre de données originale par une nouvelle distribution
 * Associer une interpolation à un dataset (datasource.json) permet d'avoir des répartission propre à chaque jeu de données
 * 
 * C'est une interpolation basique :
 *	- réduit le nombre d'éléments à maxItem ou a vals.length
 *	- retourne 1 sur x élément 
 *	
 *	@example
 *	Avec un tableau de 100 élements et un maxItem à 20 on retournera 1 élément tous les 5, soit un tableau de 20 éléments
 * 
 * @param {Object[]} vals - le tableau des valeurs tels que retourné par le dataLoader
 * @param {Date} vals.date - date correspondant à l'élément
 * @param {number} vals.value - la valeur correspondant à l'élément
 * @param {integer} maxItem - le nombre maximum d'élément à retourner
 */
export default ( vals, maxItem ) => {

	// si on a déjà moins d'éléments que demandé on peut directement retourner le tableua
	if(vals.length <= maxItem) {
		return vals
	}
	
	const modulo = Math.ceil(vals.length / maxItem)

	return vals.filter( (el, index) => {
		return ( ( index % modulo ) == 0 )
	})
}
	