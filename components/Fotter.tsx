import React from 'react'

type Props = {}

export default function Fotter({}: Props) {
  return (
    <div>
        <hr className='mb-4'/>
        <p className='p-10 m-5 font-light'>Copyright © 2022 Kaushik Inc. All Rights Reserved. Accessibility, User Agreement, Privacy, Payments Terms of Use, Cookies, Do not sell my personal information and AdChoice</p>
        <p className='mx-auto flex justify-center mb-4'>Created by Kaushik</p>
    </div>
  )
}