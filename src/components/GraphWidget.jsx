
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel} from "@material-tailwind/react"

import WidgetContainer from "./WidgetContainer"

import GraphContainer from "./GraphContainer"

import graphData from "../assets/graph-data.js" // les données à afficher


/**
 * widget principal contenant tout les graphiques (navigation par onglets)
 * Configurable au travers de "graph-data.json"
 * 
 * @returns {React.component} 
 */
const GraphWidget = ( ) => {
	
	/**
	 * au click d'un onglet on va ajouter sa clé dans le local storage
	 * au prochain démarrage de l'appli cette closure s'occupera de déterminer l'onglet à afficher, le précédent enregistré ou celui par défaut
	 */
	const selected = (() => {		
	
		// ... on s'assure que c'est bien un onglet qui existe
		const key = localStorage.getItem('graphtab')

		for(let i of graphData) {
			if( i.key == key) {
				// ok, ouverture du précent onglet
				return key
			}
		}

		// oups, onglet par défaut
		return graphData[0].key //... ou on prend le premier 
	})();
		
	/**
	 * enregistrement de l'onglet sélectionné dans le local storage
	 * @NOTA : ce n'est pas la peine de passer par un state, le composant "Tabs" s'occupe déjà en interne de préserver l'état entre les render
	 * 
	 * @param {string} tabId - l'id unique du tab affiché, dépend de la configuration
	 * @returns {void}
	 */
	const changetab = (tabId) => localStorage.setItem( 'graphtab', tabId )

    return (
        <>
			<WidgetContainer>
				<Tabs value={selected}>
					<TabsHeader className='px-4 bg-transparent'
						indicatorProps={{
							className: "bg-gray-900/10 shadow-none !text-gray-900 ",
						}}
					>
						{ graphData.map( ({ key, category, info }) => (
							<Tab key={key} value={key} className="active:text-color-red"
								onClick={e => changetab( e.target.dataset.value )}												
							>
								{category}
							</Tab>
						))}
					</TabsHeader>
					<TabsBody className='p-0'>
						{graphData.map(({ key, dataset, info, config }) => (
							<TabPanel key={key} value={key}>
								<GraphContainer dataset={dataset} info={info} config={config} />                    
							</TabPanel>
						))}
					</TabsBody>
				</Tabs>
			</WidgetContainer>
        </>
    )
}

export default GraphWidget