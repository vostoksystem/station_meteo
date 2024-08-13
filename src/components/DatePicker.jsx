import { useEffect, useState, useRef, memo } from "react"
import { Input, Popover, PopoverHandler, PopoverContent } from "@material-tailwind/react"
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline"
import { DayPicker } from "react-day-picker"
import "react-day-picker/style.css"
 
import { format } from "date-fns"
import { fr } from 'date-fns/locale'

/**
 * @typeref {Object} DateRange - objet utilisé pour communiquer les changements de dates
 * @property {(Date|null)} start - la date de début
 * @property {(Date|null)} end - la date de fin
 */

/**
 * Ce composant permet de selectionner une plage de date au travers de deux selecteurs de dates
 * 
 * @param {Object} props
 * @params {function} props.dateSelected - le callback utilisé pour indiquer qu'une date a changé, la méthode attend un paramétre {DateRange}
 * @params {boolean} props.disabled - si a true les selecteurs sont désactivés
 * @returns {React.Component}
 */
const DatePicker = ({dateSelected, disabled}) => {
	/**
	 * La date de début de la sélection
	 * @type {Date}
	 */
    const [start, setStart] = useState(new Date(1950, 1, 1))
	
	/**
	 * La date de fin de la sélection
	 * @type {Date}
	 */
	const [end, setEnd] = useState(new Date())
	
	/**
	 * on garde une référence sur les dates selectionnées afin de ne trigger le callback vers le parent qu'en cas de changement effectif
	 * @type DateRange
	 */
	const datesRef = useRef( { start: start, end: end } )
	
	/**
	 * Quel selecteur de date est ouvert ; il ne peut y en avoir qu'un à la fois, valeurs possibles : "none", "start", "end"
	 * @type {string}
	 */
    const [open, setOpen] = useState(null)

	/**
	 * Le css à utilsier pour les selecteurs de dates
	 * Les propriété correspondent à celels attendu par le champs classNames d'un {DayPicker}
	 * @type {Object}
	 */
    const css = {
		month_caption: "table pb-4 relative w-full",
		caption_label: "table-cell align-middle text-right text-sm font-bold text-gray-900 pr-4 pt-2",
		nav: "absolute z-50",
		button: "h-6 w-6 text-gray-500 hover:bg-gray-100  hover:text-gray-900  p-2.5 rounded transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-200",

		chevron: "fill-gray-500 hover:fill-gray-900 transition-fill duration-300",

		table: "w-full border-collapse p-2",
		row: "flex w-full mt-2",
		cell: "text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative focus-within:relative focus-within:z-20",

		weekday: "m-0.5 w-9 font-medium text-sm text-gray-900",

		day: "h-9 w-9 p-0 text-gray-600 font-normal hover:bg-gray-300 hover:text-gray-900 hover:rounded-md transition-text transition-bg duration-300",
		day_button:"rdp-button_reset rdp-button h-9 w-9 p-0",

		selected: "rounded-md text-gray-200 bg-gray-900",
		today: "rounded-md bg-gray-200 text-gray-100",

		day_outside: "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10",
		day_disabled: "text-gray-500 opacity-50",
		day_hidden: "invisible"
	}
			
	/*
	 * on écoute les changements sur les dates de début et de fin afin d'informer le parent - GraphContainer - des nouvelles directives de dates
	 */
	useEffect( () => {
		// on trigger seulement si une des dates a changé
		if( start == datesRef.current.start && end == datesRef.current.end) {
			return;
		} 
		
		// on s'assure que la date de début soit bien avant celle de fin...
		if( start >= end ) {
			console.log("oups... on inverse les dates")
			const tmp = end
			setEnd(start)
			setStart(tmp)			
		}
		
		datesRef.current = { start: start, end: end }
		
		setOpen( null )
		
		dateSelected( datesRef.current )

	}, [start, end])

 
	const triggersStart = {
	   onClick: () => setOpen(open == "start" ? null : "start")
	 }

	const triggersEnd = {
	   onClick: () => setOpen(open == "end" ? null : "end")
	 }
  
  return (		
	<div className="flex flex-column gap-2 pt-2">
		
      <Popover open={open == "start"} placement="bottom" handler={ setOpen } className={{ disabled: disabled}}>
        <PopoverHandler {...triggersStart}>
          <Input
            label="Date de début"
            onChange={ () => null }			
            value={start ? format(start, "PPP", { locale: fr }) : ""}
          />
        </PopoverHandler>
        <PopoverContent className="z-50 p-2">
          <DayPicker
            mode="single"
			locale={ fr }
			defaultMonth={start}
            selected={start}
            onSelect={setStart}
            showOutsideDays
            classNames={ css }	  
          />
        </PopoverContent>
      </Popover>
	  
	  <Popover open={open == "end"} placement="bottom"  handler={ setOpen } className={{ disabled: disabled}}>
        <PopoverHandler {...triggersEnd}>
          <Input
            label="Date de fin"
            onChange={ () => null }			
            value={end ? format(end, "PPP",{ locale: fr }) : ""}
          />
        </PopoverHandler>
        <PopoverContent className="z-50 p-2">
          <DayPicker
            mode="single"
			locale={ fr }
 			defaultMonth={end}
            selected={end}
            onSelect={setEnd}
            showOutsideDays
            classNames={ css }			
          />
        </PopoverContent>
      </Popover>
	  
    </div>
	)
}

export default memo( DatePicker )
