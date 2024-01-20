import React, {useState} from 'react'
import { Checkbox } from "@/components/ui/checkbox"

export default function Task() {

  const [checked, setChecked] = React.useState(false);

  // ! READ THIS TOMORROW YOU BOMBOCLAT ! ! ! ! ! IMPORTANT ! ! !
  
  // ! run some function when this happens, also add userTasks fetching to userDataFetcher and 
  // ! it fetches a whole collection and also have typing
  return (
    <div className='px-4 py-3 bg-darkgray border border-border rounded-lg flex items-center gap-3'>
      <Checkbox checked={checked} onCheckedChange={setChecked}/>
      <h1 className='font-medium text-lg'>Task, {checked.toString()}</h1>
    </div>
  )
}
