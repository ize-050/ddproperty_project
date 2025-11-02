'use client'

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Slider from "react-slick"

const MeetOurTeam = () => {
   const [teamData, setTeamData] = useState([])
   const params = useParams()
   const locale = params?.locale || 'th'

   useEffect(() => {
      fetchTeamData()
   }, [])

   const fetchTeamData = async () => {
      try {
         const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'
         const response = await fetch(`${backendUrl}/api/ui-strings/public/section/team`)
         const result = await response.json()
         
         if (result.success && result.data) {
            setTeamData(result.data)
         }
      } catch (error) {
         console.error('Error fetching team data:', error)
      }
   }

   const getLocalizedText = (slug) => {
      const item = teamData.find(item => item.slug === slug)
      if (!item) return ''
      
      const localeMap = { 'th': 'th', 'en': 'en', 'zh': 'zhCN', 'ru': 'ru' }
      const lang = localeMap[locale] || 'th'
      return item[lang] || item.th || ''
   }

   const team_members = [
      { id: 1, name: getLocalizedText('team_member_1_name'), position: getLocalizedText('team_member_1_position'), image: getLocalizedText('team_member_1_image') },
      { id: 2, name: getLocalizedText('team_member_2_name'), position: getLocalizedText('team_member_2_position'), image: getLocalizedText('team_member_2_image') },
      { id: 3, name: getLocalizedText('team_member_3_name'), position: getLocalizedText('team_member_3_position'), image: getLocalizedText('team_member_3_image') },
      { id: 4, name: getLocalizedText('team_member_4_name'), position: getLocalizedText('team_member_4_position'), image: getLocalizedText('team_member_4_image') },
      
   ]

   const team_members_2 = [
  { id: 5, name: getLocalizedText('team_member_5_name'), position: getLocalizedText('team_member_5_position'), image: getLocalizedText('team_member_5_image') },
      { id: 6, name: getLocalizedText('team_member_6_name'), position: getLocalizedText('team_member_6_position'), image: getLocalizedText('team_member_6_image') },
      { id: 7, name: getLocalizedText('team_member_7_name'), position: getLocalizedText('team_member_7_position'), image: getLocalizedText('team_member_7_image') },
   ]

   const sliderSettings = {
      dots: true,
      arrows: false,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      responsive: [
         {
            breakpoint: 1200,
            settings: {
               slidesToShow: 3
            }
         },
         {
            breakpoint: 992,
            settings: {
               slidesToShow: 2
            }
         },
         {
            breakpoint: 576,
            settings: {
               slidesToShow: 1
            }
         }
      ]
   }

   return (
      <div className="agent-section-one bg-pink-two mt-150 xl-mt-120 pt-120 xl-pt-80 pb-120 xl-pb-80">
         <div className="container">
            <div className="title-one text-center mb-80 xl-mb-50 md-mb-30 wow fadeInUp">
               <h3>{getLocalizedText('team_title')}</h3>
               <p className="fs-20 mt-xs">{getLocalizedText('team_subtitle')}</p>
            </div>

            <Slider {...sliderSettings} className="team-slider">
               {team_members.map((member) => (
                  <div key={member.id} className="px-2">
                     <div className="text-center">
                        <div className="position-relative d-inline-block">
                           <img 
                              src={member.image} 
                              alt={member.name}
                              style={{
                                 width: '100%',
                                 maxWidth: '312px',
                                 height: '350px',
                                 aspectRatio: '1/1',
                                 objectFit: 'cover',
                                 borderRadius: '20px',
                                 boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                              }}
                           />
                        </div>
                        <h6 className="fw-500 mt-3 mb-1">{member.name}</h6>
                        <div className="fs-16 text-muted">{member.position}</div>
                     </div>
                  </div>
               ))}
            </Slider>

               <br></br>

              <Slider {...sliderSettings} className="team-slider">
               {team_members_2.map((member) => (
                  <div key={member.id} className="px-2">
                     <div className="text-center">
                        <div className="position-relative d-inline-block">
                           <img 
                              src={member.image} 
                              alt={member.name}
                              style={{
                                 width: '100%',
                                 maxWidth: '312px',
                                 height: '350px',
                                 aspectRatio: '1/1',
                                 objectFit: 'cover',
                                 borderRadius: '20px',
                                 boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                              }}
                           />
                        </div>
                        <h6 className="fw-500 mt-3 mb-1">{member.name}</h6>
                        <div className="fs-16 text-muted">{member.position}</div>
                     </div>
                  </div>
               ))}
               
               <div className="px-2">
                  <div className="text-center">
                     <div 
                        className="d-flex align-items-center justify-content-center"
                        style={{
                           width: '100%',
                           maxWidth: '312px',
                           height: '350px',
                           aspectRatio: '1/1',
                           backgroundColor: '#8B0000',
                           borderRadius: '20px',
                           margin: '0 auto',
                           boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                        }}
                     >
                        <div className="text-white">
                           <div style={{ fontSize: '80px', fontWeight: 'bold', lineHeight: '1' }}>12</div>
                           <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '10px' }}>REAL ESTATE</div>
                           <div style={{ fontSize: '16px', marginTop: '5px' }}>PATTAYA</div>
                        </div>
                     </div>
                  </div>
               </div>
            </Slider>
         </div>
      </div>
   )
}

export default MeetOurTeam
