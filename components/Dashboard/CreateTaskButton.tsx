import React from 'react'
import { FaPlus } from 'react-icons/fa6';
import {ButtonShad} from '@/components/ui/buttonshad'

export default function CreateTaskButton() {
  return (
    // ! CHECK NEW WHITE VARIANT ON BUTTON AND CONTINUE
  <>
    <ButtonShad size="icon" className="gap-2 text-lg w-12 h-12 md:hidden active:scale-95 transition">
      <FaPlus size={28}/>
    </ButtonShad>

    <ButtonShad variant="outline" size="lg" className="gap-2 text-lg hidden md:flex active:scale-95 transition">
      <FaPlus/>
      <p>
        Create Task
      </p>
    </ButtonShad>
  </>
  )
}
