import cloneDeep from 'lodash.clonedeep'
import merge from 'lodash.merge'

import React from 'react'
import { useEffect, useState, useRef, useCallback } from "react"

import { Card, CardBody, CardHeader } from "@material-tailwind/react"
import { Typography, IconButton } from "@material-tailwind/react"
import Chart from "react-apexcharts"

import DatePicker from "./DatePicker"

import DataLoading from "./DataLoading"

import DataService from "../services/DataService"

import graphConfig from "../assets/graph-config.json" // la configuration générale du graphique


/**
 * @typeref {Object} GraphInfo - permet de garder une trace des changements de taille sur le graphique
 * @property {integer} width - taille actuelle de la fenêtre du graphique
 * @property {integer} size - taille actuelle du nombre de données récupérées depuis le dataset 
 */

/**
 * @typeref {Object} Filter - description d'un filtre pour ... filtrer les données
 * @property {string} id - l'identifiant unique de ce filtre
 * @property {function] fn - la fonction - qui sera passé à Array.filters - correspondant au filtre
 * 
 */

/**
 * Conteneur pour un graphique
 * Celui ci affichera le descriptif, des selecteurs pour filtrer les résultats et un graphique pour afficher les données
 * 
 * @param {Object} props - la liste des propriétés du composant
 * @param {string} props.dataset - le nom du dataset à afficher
 * @param {Object} props.info - les informations pour le descriptif de l'onglet
 * @param {Object} props.config - la configuration pour l'affichage du graphique, viendra remplacer la configuration par défaut (config apexcharts)
 * @returns {React.component}
 */
const GraphContainer = ({dataset, info, config}) => {

	/**
	 * Référence sur le dom qui va contenir le graphique
	 * On va écouter les changements de taille pour en déterminer le nombre maximun de données à afficher
	 * @type type
	 */
	const containerRef = useRef()
	
	/**
	 * Référence locale sur la taille du graphique, mise à jour lors d'un redimentionnement de la fenêtre
	 * @type{GraphInfo}
	 */
	const dimensions = useRef({width: 0, size: 0})
	
	/**
	 * Réference sur les dates séléctionnées. Par défaut, affiche toute la plage de données
	 * @type {DatePicker.DateRange}
	 */
	const dates = useRef({ start: null, end : null})
	
	/**
	 * l'id du timer qui sert à temporiser les demandes d'actualisation des données.
	 * On utilise un timer afin de liser le comportement de l'interface ; null par défaut
	 * @type {integer}
	 */
	const timeout = useRef(null)
	
	/**
	 * Pendant le chargement des données on bascule l'affichage du graphique et on bloque l'utilisation des filtres
	 * @type {boolean}
	 */

	const [loading, setLoading] = useState(true)
	
	/**
	 * La configuration (et les données) actuelle utilisée pour afficher le graphique
	 * @type {Object}
	 */
	const [chartConfig, setChartConfig] = useState(null) // configuration du graph (et données)

	/**
	 * Calcule un nouveau set de données, et l'affiche
	 * @param {integer} size - nombre d'éléments maximal à afficher
	 * @param {Filter[]} filters - liste des filtres à appliquer (ex : date min, date max)
	 * @return {void}
	 */
	const renderGraph = (size, filters = []) => {
		console.log(`rafraichissement des données de ${dataset}`)

		if (size <= 0) {
			console.log(`dataset : ${dataset}, taille à 0, skip`)
			return;
		}

		// on va traiter de nouvelles données, on passe en "attente"
		setLoading(true);

		// chargement des données depuis le dataset et création de la config du graphe
		(async () => {
			try {
				console.log(`dataset : ${dataset} --- size : ${size}`)

				// récupération des données correspondant à la série
				const data = await DataService.getInstance().dataSet(dataset, size, filters)

				// merge de la config "locale" avec les valeurs standards
				const conf = merge(cloneDeep(graphConfig), config ?? {})

				// ajout des données
				conf.series = [
					{
						name: info.title,
						data: data.map((el) => {

							return {
								'x': el.date,
								'y': el.value
							}
						})
					}
				]

				// ok, on rafraichit le graphe et on commute l'affichage
				setChartConfig(conf)
				setLoading(false)

			} catch (e) {
				console.log(`erreur chargement data : ${dataset}`)
			}
		}
		)();
	}

	/**
	 * gestion de la file d'attente des demandes d'actualisation
	 * @returns {void}
	 */
	const poolData = () => {
		
		// on temporise l'actualisation des données afin d'avoir une interface plus fluide, l'actualisation effective ne se fera après 250ms
		// si une demande est effectuée pendant ce laps de temps (exemple redimentionnement de la fenêtre qui envoi plusieurs event), on annule la précédente demande pour la remplacer par celle ci
		try {
			clearTimeout(timeout.current)
		} catch (e) {
		}
		
		
		// on construit la liste des fitres à appliquer
		// on prend soin d'utiliser une clé unique pour le filtre, relative au(x) paramétre(s) ; important pour la gestion du cache
		const filters = []
		if( dates.current.start) {
		   filters.push( { id: `start-${dates.current.start}`, fn: item => item.date >= dates.current.start })
		}
		if( dates.current.end) {
		   filters.push( {id: `end=${dates.current.end}`, fn: item => item.date <= dates.current.end })
		}  

		timeout.current = setTimeout(() => renderGraph(dimensions.current.size, filters), 250)		
	}



	/**
	 * Réponse du picker de date
	 * @param {DatePicker.DateRange} data 
	 * @param {(Date|null)} data.start - date de début à afficher
	 * @param {(Date|null)} data.end - date de fin à afficher
	 * @returns {void}
	 */
	const dateSelected = useCallback( ( {start, end} ) => {
		// on s'assure qu'au moins une des deux dates a changé
		if( start == dates.current.start && end == dates.current.end ) {
			return;
		}
		
		dates.current = {start: start, end: end}

		// les dates sont différentes, on fait une actualisation des données
		poolData()
	}, [dates])

	/**
	 * On "écoute" les changements de taille du container du graphique
	 * Afin de miniminer les calculs on adapte la taille des données à afficher par rapport à la taille du graph à l'écran
	 */
	useEffect(() => {
		if (!containerRef.current) {
			return;
		}

		// on place un "observer" sur les changements de taille du container du graphe
		const observer = new ResizeObserver((entries) => {
			// changement de taille
			for (let entry of entries) {
				// on s'intéresse seulement aux changements de la largeur
				if (entry.contentRect.width == dimensions.current.width) {
					return;
				}

				//on merge les changemnets 
				dimensions.current = Object.assign(dimensions.current, {
					width: entry.contentRect.width
				})


				// si la nouvelle taille de la fenêtre est plus petite que le nombre actuel d'éléments ce n'est pas la peine de
				// faire une nouvelle requette, on a déjà suffisament de données pour afficher le graphe (l'interpolation sera faite par le composant chart)
				if (dimensions.current.width <= dimensions.current.size) {
					return;
				}

				// ok, on rafraichie les données et le graphe
				// 
				// On commence par fixer la nouvelle taille des données
				// Sans cela, avec les différentes latences possible entre redimentionnement et temps de traitement on pourrait se retrouver avec des rafraichissements en serie
				dimensions.current.size = dimensions.current.width
				
				// et on fini par placer la demande de réactualisation dans la fille d'attente
				poolData()
				
				return;
			}
		})

		observer.observe(containerRef.current)

		return () => {
			observer.disconnect()
		}
	}, [])

	return(
		<div ref={containerRef}>				
			<Card className="rounded-none border-none shadow-none p-0">
			<CardHeader
				floated={false}
				shadow={false}
				color="transparent"
				className="flex flex-col lg:flex-row lg:items-center gap-4 border-b border-gray-200 rounded-none pb-6" >										
					<div className="flex flex-1 flex-row gap-4 ">	
						<IconButton size="lg" color={`${info.color ?? 'gray'}`} className="rounded-lg cursor-default flex-initial">
							<i className={`fas ${info.avatar ?? 'fa-layer-group'}`} />
						</IconButton>		
 
						<div className="flex-1">
							<Typography variant="h6" color="blue-gray">
								{info.title}
							</Typography>
							<Typography
								variant="paragraph"
								component="h2"
								color="blue-gray"
								>
								<cite dangerouslySetInnerHTML={ {__html: info.description} }></cite>
							</Typography>
						</div>
					</div>

					<div className="flex flex-column justify-end gap-2 pt-2">
						<DatePicker dateSelected={dateSelected} disabled={loading} />
					</div>
			</CardHeader>

			<CardBody className="p-0 px-2 pt-2">
				{ loading ? (
					<DataLoading />
				) : (
					<Chart {...chartConfig} /> 
				)}
				</CardBody>
				</Card>

		</div>
		)
}

export default GraphContainer

