/**
 * Configuration des graphiques
 * 
 * @nota : On utilise un format js / (objet javascript) à la place d'un json car cela permet de "passer" du code notament pour formatage des tooltips et legende
 * Avec un json il aurait fallu passer par des réferences vers des classes externes
 
 * 
 * @type Array : la listes des graphiques à afficher
 */

export default [
    {
		"key" : "rain-level",
		"category" : "Précipitation",		
		"dataset" : "rain-level",
		"info" : {
			"title" : "Niveau de précipitation",
			"description" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua<br/>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
			"avatar" : "fa-cloud-rain",
			"color" : "blue"
		},
		"config" : {
			"options" : {
				"colors" : ["#2196f3"],
				
				"yaxis" : {
					"labels" : {         
						"formatter" : (value) => Number.parseFloat(value).toFixed(2) + ' mm',
					}
						
						
				},
				
				"tooltip" : {
					"y" : {
						"formatter" : (value) => Number.parseFloat(value).toFixed(2) + ' mm',						
						"title": {
							"formatter" : () => "Précipitation : "
						}
					}
				}
			}			
		}
    },

    {
		"key" : "temperature",
		"category" : "Température",	
		"dataset" : "temperature",
		"info" : {
			"title" : "Relevé des températures",
			"description" : "Habitant et imperdiet elementum non hendrerit dis tincidunt felis ad.<br/>Dis metus dictumst mauris; proin eget egestas feugiat vestibulum.<br/>Ex bibendum aenean augue justo interdum augue tempus erat.",
			"avatar" : "fa-temperature-half",
			"color" : "red"
		},
		"config" : {
			"options" : {
				"colors": ["#f44336"],
				
				"yaxis" : {
					"labels" : {         
						"formatter" : (value) => Number.parseFloat(value).toFixed(2) + ' °C',
					}
				},
				
				
				"tooltip" : {
					"y" : {
						"formatter" : (value) => Number.parseFloat(value).toFixed(2) + ' °C',						
						"title": {
							"formatter" : () => "Température : "
						}
					}
				}
			}		
		}
	}
]