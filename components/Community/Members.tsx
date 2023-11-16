import Link from 'next/link';
import React from 'react'

  interface Member {
    id: string;
    name: string;
    email: string;
    photoUrl: string;
    status: string;
  }
  
export default function Members({ members }: { members: Member[]}) {

    function truncateText(text: string, maxLength: number) {
        if (text.length > maxLength) {
          return text.substring(0, maxLength) + '...';
        }
        return text;
    }

  return (
    <>
      <ul className="flex flex-col gap-2">
      {members.map((member) => (
          <li key={member.id}>
            <Link href={`/profile/${member.id}`}>
                <p>{truncateText(member.name, 20)}</p>
                <p>Status: {member.status}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
