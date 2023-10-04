"use client"

import React from 'react'
import { UserDataFetcher } from "@/utils/userDataFetcher";

export default function Greeting() {
const { userName } = UserDataFetcher();

  return (
    <p className="text-xl">Hi, {userName ? userName : '...'}</p>
  )
}
