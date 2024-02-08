import { BiLoader } from "react-icons/bi";

export default function PageLoader() {
  return (
    <div className="h-screen flex items-center justify-center">
      <BiLoader size={72} className="animate-spin"/>
    </div>
  )
}
