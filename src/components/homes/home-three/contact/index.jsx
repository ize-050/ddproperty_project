'use client'

import HeaderTwo from '@/layouts/headers/HeaderTwo'
import FooterHomeThree from '@/components/homes/home-three/FooterHomeThree'
import ContactArea from './ContactArea'

const Contact = () => {
   return (
      <>
         <HeaderTwo style_1={true} style_2={false} />
         <ContactArea />
         <FooterHomeThree />
      </>
   )
}

export default Contact
