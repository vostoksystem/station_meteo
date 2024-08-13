import { Typography } from "@material-tailwind/react"

/**
 * Composant pour afficher un message en attendant le chargement des données
 * 
 * @param {Object} props
 * @param {string} props.message - message optionnel à afficher durant l'attente, sinon "Chargement des données"
 * @return {React.Component}
 */
const DataLoading = ({message}) => {	
	return (
		<>
			<div className="mx-auto flex flex-row py-8 place-content-center">
				<div>
					<div className="rounded-md h-12 w-12 border-4 border-t-4 border-blue-500 animate-spin absolute"></div>
				</div>				
				<Typography variant="h3" color="gray" className="flex1 ml-12 pl-2">
					{ `${message ?? "Chargement des données"}`}
				</Typography>
			</div>			
		</>
	)
}

export default DataLoading