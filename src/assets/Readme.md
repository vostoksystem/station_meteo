# datasource.json

Ce fichier json décrit la liste des sources de données disponibles.

Chaque propriété décrit un dataset. Le nom sera ensuite utilisé dans *graph-data.js*.

- provider : le provider à utiliser pour retrouver les données
- iterpolation : la méthode d'interpolation à appliquer sur les données (optionnel)
- params : les paramètres propres à chaque provider

Le provider "csvProvider", attend dans params : 

- url : l'url vers les données (locale ou publique)
- separator : le caractère de séparation pour les données csv, ',' par défaut
- transform : la méthode à appliquer sur chaque lignes du fichier csv

# graph-data.js

Ce tableau javascript décrit les différents graphiques que l'on veut afficher dans les onglets.

Chaque index du tableau décrit un graphique qui sera affiché dans un onglet :

- key : la clé unique qui identifie un graphique
- category : le nom de l'onglet
-dataset : le dataset à afficher, doit correspondre à un id dans *datasource.json*
- info : description et information du graphique
	- title : titre du graphique
	- description : description du graphique, peut contenir du code html
	- avatar : l'icone à afficher
	- color : la couleur à utiliser pour la courbe de données
- config : propriétés "apexchart" qui seront ajoutées à *graph-config.json* pour configurer l'affichage de la courbe de données

Pour les propriétés "transform" (ex *config.options.xaxis.label*) il est possible de spécifier du code javascript sous la form d'une closure.

# graph-config.json

Ce fichier est la configuration générale du moteur 'apexchart', les spécificités de chaque graphiques sont ensuite ajoutées à la configuration de base.
