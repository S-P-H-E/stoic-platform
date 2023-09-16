"use client"

import React from 'react'
import Button from '../Button'
import { UserDataFetcher } from '@/utils/userDataFetcher'
import { IoMdCreate } from 'react-icons/io'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import CreateResource from './CreateResource'

export default function CreateButton() {
    const {userId, userStatus} = UserDataFetcher()
  return (
    <Dialog>
      <DialogTrigger>
        {userStatus === 'admin' ? (
          <Button className='!w-32'><IoMdCreate/>Create</Button>
        ) : null}
      </DialogTrigger>
      <DialogContent>
        <CreateResource/>
      </DialogContent>
    </Dialog>
  )
}
