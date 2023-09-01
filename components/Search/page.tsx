import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { BiSearch } from 'react-icons/bi'
  import { BsStars } from 'react-icons/bs'

export default function Search(){
    return(
        <Dialog>
            <DialogTrigger>
                <BiSearch size={20}/>
            </DialogTrigger>
            <DialogContent>
                <div>
                    <div className="flex justify-center items-center gap-2 text-[#515151] px-3 py-2 rounded-full w-full">
                        <BsStars size={20}/>
                        <input placeholder="Ask a question" className="bg-transparent placeholder:text-[#515151] w-full outline-none text-white"/>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

    )
}