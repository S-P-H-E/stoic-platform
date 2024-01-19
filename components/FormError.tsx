import { BsExclamation } from "react-icons/bs";

interface FormErrorProps {
    message?: string
}

const FormError = ({message}: FormErrorProps) => {
    if (!message) return null
    
    return (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
            <BsExclamation className="h-4 w-4"/>
            <p>{message}</p>
        </div>
    );
}
 
export default FormError;