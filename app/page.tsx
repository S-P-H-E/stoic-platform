import Image from 'next/image'
import Login from '@/components/Login'

export default function Home() {
  return (
    <main className='h-screen flex justify-center items-center'>
      <Login />
    </main>
  )
}
