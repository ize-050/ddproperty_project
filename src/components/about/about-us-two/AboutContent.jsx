'use client'

import Image from "next/image"
import Link from "next/link"

const AboutContent = () => {
   return (
      <div className="block-feature-two mt-150 xl-mt-100">
         <div className="container">
            <div className="row gx-xl-5">
               <div className="col-lg-6 wow fadeInLeft">
                  <div className="me-xxl-4">
                     <Image 
                        src="/assets/images/aboutus/get to know -photo.png" 
                        alt="About D-Luck Property" 
                        width={600}
                        height={500}
                        className="lazy-img w-100"
                     />
                  </div>
               </div>

               <div className="col-lg-6 wow fadeInRight">
                  <div className="ms-xxl-4 md-mt-40">
                     <div className="upper-title mb-20">เกี่ยวกับเรา</div>
                     <h3 className="mb-40">About <span className="text-danger">12 Real Estate Pattaya</span></h3>
                     
                     <div className="accordion accordion-style-one" id="accordionAbout">
                        <div className="accordion-item active">
                           <h2 className="accordion-header">
                              <button className="accordion-button" type="button" data-bs-toggle="collapse" 
                                 data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                 Who we are?
                              </button>
                           </h2>
                           <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionAbout">
                              <div className="accordion-body">
                                 <p>เราคือทีมผู้เชี่ยวชาญด้านอสังหาริมทรัพย์ในพัทยา ที่มุ่งมั่นให้บริการอย่างครบวงจร 
                                 ตั้งแต่การซื้อ ขาย เช่า ไปจนถึงการบริหารจัดการทรัพย์สิน ด้วยประสบการณ์กว่า 10 ปี 
                                 เราเข้าใจความต้องการของลูกค้าทั้งชาวไทยและชาวต่างชาติ</p>
                              </div>
                           </div>
                        </div>
                        
                        <div className="accordion-item">
                           <h2 className="accordion-header">
                              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                                 data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                 What's our goal
                              </button>
                           </h2>
                           <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionAbout">
                              <div className="accordion-body">
                                 <p>เป้าหมายของเราคือการเป็นผู้นำด้านอสังหาริมทรัพย์ในพัทยา โดยมุ่งเน้นการให้บริการที่เป็นเลิศ 
                                 สร้างความพึงพอใจสูงสุดให้กับลูกค้า และเป็นที่ปรึกษาที่เชื่อถือได้สำหรับการลงทุนด้านอสังหาริมทรัพย์</p>
                              </div>
                           </div>
                        </div>

                        <div className="accordion-item">
                           <h2 className="accordion-header">
                              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                                 data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                 Our vision
                              </button>
                           </h2>
                           <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionAbout">
                              <div className="accordion-body">
                                 <p>วิสัยทัศน์ของเราคือการสร้างประสบการณ์ที่ดีที่สุดในการซื้อ ขาย และเช่าอสังหาริมทรัพย์ 
                                 พร้อมทั้งพัฒนาบริการอย่างต่อเนื่องเพื่อตอบสนองความต้องการของลูกค้าในยุคดิจิทัล</p>
                              </div>
                           </div>
                        </div>
                     </div>

                     <Link href="/contact" className="btn-two mt-50 md-mt-30">Contact Us</Link>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default AboutContent
