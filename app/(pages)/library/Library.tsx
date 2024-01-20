import Resources from '@/components/Library/Resources'
import LibraryNavbar from '@/components/Library/Navbar'

export default function LibraryComponent({isPremium, userStatus, userId}: {isPremium: boolean, userStatus: string | undefined, userId: string | null}) {
  return (
    <section className="lg:py-10 lg:px-16 p-6 flex flex-col gap-4 w-full">
      <Resources isPremium={isPremium} userStatus={userStatus} userId={userId}/>
    </section>
  )
}
