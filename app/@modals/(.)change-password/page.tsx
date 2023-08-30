
import { FC } from 'react'
import ResetPassword from './../../../components/ResetPassword';

interface pageProps {
  
}

const page: FC<pageProps> = ({}) => {
  return (
  <div className='fixed inset-0 bg-zinc-900/20 z-10'>
    <ResetPassword/>
  </div>
  ) 
}

export default page