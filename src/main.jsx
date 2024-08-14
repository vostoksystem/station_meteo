import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Pour le rendu graphique on utilise les css et les composants du framework material tailwind (pour react)
import { ThemeProvider } from "@material-tailwind/react"

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<ThemeProvider>
			<App />
	    </ThemeProvider>
	</React.StrictMode>
)
