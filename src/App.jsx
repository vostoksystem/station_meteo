import { useState } from 'react'

import { Navbar, Typography } from "@material-tailwind/react"

import GraphWidget from './components/GraphWidget'

/**
 * le composant principal de l'application, composé d'un header, ensuite d'un unique widget
 *  
 * @returns {React.Composant}
 */
const App = () => {
  return (
    <> 	
		<header>
			<nav className="fixed z-30 w-full bg-white border-b border-gray-200 py-3 px-4">
				<div className="flex justify-start items-center">
					<div className="flex">
						<img src="/icons/rain.svg" className="mr-3 h-8" alt="Station Logo" />
						<Typography	as="span" className="self-center hidden sm:flex text-2xl font-semibold whitespace-nowrap dark:text-white" >
							Station Météo
						</Typography>
					</div>
				</div>
			</nav>
		</header>
	
		<div className="flex pt-16 overflow-hidden bg-gray-50">		 		
			<div id="main-content" className="relative w-full mx-auto h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
				<main className="px-4">
					<GraphWidget />
				</main>
			</div>
		</div>
    </>
  )
}

export default App
