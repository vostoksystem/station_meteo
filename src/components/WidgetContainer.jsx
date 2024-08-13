/**
 * Ce composant sert de conteneur graphique, il permet d'unifier le look and feel de l'application
 * 
 * @param {Object} props - les propriétés (react) pour l'affichage du composant 
 * @param {string} props.className - classes css à ajouter, optionnel
 * @param {Object} props.children - le composant react à contenir
 * @returns {React.Component}
 */
const WidgetContainer = ({className, children}) => {	
	return(
		<>
			<div className={ `p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-2 ${className}` }>
				{children}
			</div>
		</>
	)
}

export default WidgetContainer