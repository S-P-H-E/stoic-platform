import UserProfile from '@/components/UserProfile';
import { GlobalUser, Role, User } from '@/types/types';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { SettingsSchema } from '@/schemas';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import Link from 'next/link'
import NewInput from '@/components/UI Elements/NewInput';
import { ButtonShad } from '@/components/ui/buttonshad';
import { updateUserDetails } from '@/utils/updateUserDetails';
import { useEffect, useState } from 'react'
import { message } from 'antd';
import FormError from '@/components/FormError';
import FormSuccess from '@/components/FormSuccess';
import Image from 'next/image';
import { FaArrowLeft, FaLock, FaUser } from 'react-icons/fa6';
import { truncateText } from '@/utils/utils';
import NewTextArea from '@/components/UI Elements/NewTextArea';
import { BiLoader } from 'react-icons/bi';
import Membership from '@/components/UserId/Membership';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
export default function SettingsComponent({
  userId,
  user,
  globalUser,
  roles,
}: {
  userId: string;
  user: User | undefined;
  globalUser: GlobalUser | undefined;
  roles: Role[];
}) {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || undefined,
      description: user?.description || undefined,
      social: user?.social || undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof SettingsSchema>) => {
    try {
      setLoading(true)
      await updateUserDetails(userId, values)
      message.success('Succesfully updated user info.')
    } catch {
      message.error('There was an issue with your request. Please try again.')
    } finally {
      setLoading(false)
    }

  };

  useEffect(() => {
    if (user) {
      form.reset({
        name: user?.name || '',
        description: user?.description || '',
        social: user?.social || '',
      });
    }
  }, [user, form , form.reset]);
 


  return (
    // ? max width ?????

    <div className="flex flex-col gap-8 w-full mx-auto max-w-7xl">
        <div className="space-y-2">
            <h1 className="text-3xl font-semibold">User Settings</h1>
            <Link href={`/user/${userId}`} className="relative flex gap-2 group items-center w-fit active:scale-90 transition">
              <FaArrowLeft className="absolute group-hover:translate-x-1 -translate-x-2 left-0 opacity-0 group-hover:opacity-100 transition"/>
              {user?.profileImageUrl ? (
                <Image alt="User image" src={user?.profileImageUrl!} height={80} width={80} className="group-hover:opacity-0 group-hover:-translate-x-3 w-7 h-7 rounded-full object-cover transition"/>
                ): (
                  <FaUser className="group-hover:opacity-0 m-2 group-hover:-translate-x-3 rounded-full object-cover transition"/>
                )     
              }
              <p className="font-medium text-sm group-hover:underline">Back to {user?.name}</p>
            </Link>
        </div>
      <div className="flex flex-col lg:flex-row gap-4 xl:gap-8 w-full">
        {user && user.name && user.roles && user.status && (
          <>
            <div className="bg-darkgray border border-border p-4 rounded-2xl w-full">
            <Form {...form}>
                <form className="space-y-7" onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">Name</FormLabel>
                        <FormControl>
                          <NewInput disabled={loading} id='name' label={user?.name || "Name"} placeholder="Enter new name" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">Description</FormLabel>
                        <FormControl>
                          <NewTextArea disabled={loading} id='description' label={truncateText(user?.description, 20) || "Description"} placeholder="Enter new description" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="social"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">Social</FormLabel>
                        <FormControl>
                          <NewInput disabled={loading} id='social' type='social' label={truncateText(user?.social, 20) || "Social"} placeholder="Enter new social" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />

                    <Dialog>
                      <DialogTrigger>
                        <ButtonShad className='gap-1'>
                          <FaLock />
                          Change Password
                        </ButtonShad>
                      </DialogTrigger>
                      <DialogContent>

                      </DialogContent>
                    </Dialog>

                  <div>
                    <Membership user={user} userId={userId} stripeCustomerId={user?.stripeId} globalUserId={globalUser?.id} globalUserRole={globalUser?.status} globalUserName={globalUser?.name} globalStripeCustomerId={globalUser?.stripeId}/>  
                  </div>

                  <FormError message={error} />
                  <FormSuccess message={success} />
                  <ButtonShad variant="secondary" disabled={loading} className="disabled:cursor-not-allowed active:scale-90 transition" type="submit">
                    {loading ? <BiLoader className="animate-spin"/> : 'Save'}
                  </ButtonShad>
                </form>
            </Form>
            </div>
            <div className="bg-darkgray rounded-2xl min-w-[21rem] p-1 w-full lg:w-2/4 xl:w-2/3 border-border border">
              <UserProfile
                edit
                userDescription={user.description}
                roles={roles}
                src={user.profileImageUrl}
                userBannerUrl={user.profileBannerUrl}
                userId={userId}
                userName={user.name}
                userRoles={user.roles}
                userStatus={user.status}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
