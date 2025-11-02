import { StaticImageData } from "next/image";

const featureIcon_1 = "/images/icon_new/buy.svg";
const featureIcon_2 = "/images/icon_new/rent.svg";
const featureIcon_3 = "/images/icon_new/sell.svg";

const feature3Icon_1 = "/assets/images/icon/icon_07.svg";
const feature3Icon_2 = "/assets/images/icon/icon_08.svg";
const feature3Icon_3 = "/assets/images/icon/icon_09.svg";
const feature3Icon_4 = "/assets/images/icon/icon_26.svg";
const feature3Icon_5 = "/assets/images/icon/icon_27.svg";
const feature3Icon_6 = "/assets/images/icon/icon_28.svg";

const feature4Icon_1 = "/assets/images/icon/icon_11.svg";
const feature4Icon_2 = "/assets/images/icon/icon_12.svg";
const feature4Icon_3 = "/assets/images/icon/icon_13.svg";

const feature5Icon_1 = "/assets/images/icon/icon_23.svg";
const feature5Icon_2 = "/assets/images/icon/icon_24.svg";
const feature5Icon_3 = "/assets/images/icon/icon_25.svg";

const feature6Icon_1 = "/assets/images/icon/icon_35.svg";
const feature6Icon_2 = "/assets/images/icon/icon_36.svg";
const feature6Icon_3 = "/assets/images/icon/icon_37.svg";

const feature7Icon_1 = "/assets/images/icon/icon_40.svg";
const feature7Icon_2 = "/assets/images/icon/icon_41.svg";
const feature7Icon_3 = "/assets/images/icon/icon_42.svg";

const featureImg_1 = "/assets/images/media/img_19.jpg";
const featureImg_2 = "/assets/images/media/img_20.jpg";
const featureImg_3 = "/assets/images/media/img_21.jpg";


 

const feature_data = [
   {
      id: 1,
      page: "home_1_feature_1",
      icon: featureIcon_1,
      title: "Buy a home",
      btn:"Find Home",
      desc: "Explore homy’s 2 million+ homes and uncover your ideal living space.",
   },
   {
      id: 2,
      page: "home_1_feature_1",
      icon: featureIcon_2,
      title: "RENT A HOME",
      btn:"Rent Home",
      desc: "Discover a rental you'll love on homy, thanks to 35+ filters and tailored keywords.",
   },
   {
      id: 3,
      page: "home_1_feature_1",
      icon: featureIcon_3,
      title: "SELL PROPERTY",
      btn:"Sell Property",
      desc: "List, sell, thrive – with our top-notch real estate agency. It’s super easy & fun.",
   },

   // home_1_feature_2

   {
      id: 1,
      page: "home_1_feature_2",
      item_bg: "card-1",
      title: "Kelowna",
      desc: "1,230 Properties",
   },
   {
      id: 2,
      page: "home_1_feature_2",
      item_bg: "card-2",
      title: "California",
      desc: "1190 Properties",
   },
   {
      id: 3,
      page: "home_1_feature_2",
      item_bg: "card-3",
      title: "New York",
      desc: "1710 Properties",
   },
   {
      id: 4,
      page: "home_1_feature_2",
      item_bg: "card-5",
      title: "Miami",
      desc: "670 Properties",
   },
   {
      id: 5,
      page: "home_1_feature_2",
      item_bg: "card-5",
      title: "Dhaka",
      desc: "1670 Properties",
   },

   // home_1_feature_3

   {
      id: 1,
      page: "home_1_feature_3",
      icon: feature3Icon_1,
      title: "Create Account",
      desc: "It’s very easy to open an account and start your journey.",
   },
   {
      id: 2,
      page: "home_1_feature_3",
      class_name:"arrow position-relative",
      icon: feature3Icon_2,
      title: "Find Home",
      desc: "Complete your profile with all the info to get attention of client.",
   },
   {
      id: 3,
      page: "home_1_feature_3",
      icon: feature3Icon_3,
      title: "Quick Process",
      desc: "Apply & get your preferable jobs with all the requirements and get it.",
   },

   // home_two_feature_1

   {
      id: 1,
      page: "home_2_feature_1",
      item_bg: "location-card-1",
      title: "Kelowna",
   },
   {
      id: 2,
      page: "home_2_feature_1",
      item_bg: "location-card-2",
      title: "West Kelowna",
      data_delay_time: "0.1s",
   },
   {
      id: 3,
      page: "home_2_feature_1",
      item_bg: "location-card-3",
      title: "Lake Country",
      data_delay_time: "0.2s",
   },
   {
      id: 4,
      page: "home_2_feature_1",
      item_bg: "location-card-4",
      title: "Vernon",
   },
   {
      id: 5,
      page: "home_2_feature_1",
      item_bg: "location-card-5",
      title: "Peachland",
      data_delay_time: "0.1s",
   },
   {
      id: 6,
      page: "home_2_feature_1",
      item_bg: "location-card-6",
      title: "Penticton",
      data_delay_time: "0.2s",
   },

   // home_two_feature_2

   {
      id: 1,
      page: "home_two_feature_2",
      img: featureImg_1,
      title: "Explore & buy Home",
      tag: "BUY HOME",
      data_delay_time: "0.2s",
   },
   {
      id: 2,
      page: "home_two_feature_2",
      img: featureImg_2,
      title: "List & Sell quickly",
      tag: "Sell Now",
      data_delay_time: "0.1s",
   },
   {
      id: 3,
      page: "home_two_feature_2",
      img: featureImg_3,
      title: "Discover & get Rental",
      tag: "RENT NOW",
      data_delay_time: "0.2s",
   },

   // home_two_feature_3

   {
      id: 1,
      page: "home_two_feature_3",
      icon: feature4Icon_1,
      title: "Property Insurance",
      desc: "Elit esse cillum dolo fugiat nulla tur nos ullamo.",
   },
   {
      id: 2,
      page: "home_two_feature_3",
      icon: feature4Icon_2,
      title: "Easy Payments",
      desc: "quis nostrud exerct ullamo sucirity finibus ne derived.",
   },
   {
      id: 3,
      page: "home_two_feature_3",
      icon: feature4Icon_3,
      title: "Quick Process",
      desc: "Duis aute irure dolor reprehe de Cicero's voluptat velit.",
   },

   // home_3_feature_1

   {
      id: 1,
      page: "home_3_feature_1",
      icon: feature5Icon_1,
      title: "Buy a home",
      btn: "Find Home",
      desc: "Explore homy’s 2 million+ homes and uncover your ideal living space.",
   },
   {
      id: 2,
      page: "home_3_feature_1",
      icon: feature5Icon_2,
      title: "Buy a home",
      btn: "Rent Home",
      desc: "Discover a rental you'll love on homy, thanks to 35+ filters and tailored keywords.",
      data_delay_time: "0.1s",
   },
   {
      id: 3,
      page: "home_3_feature_1",
      icon: feature5Icon_3,
      title: "Buy a home",
      btn: "Sell Property",
      desc: "List, sell, thrive – with our top-notch real estate agency. It’s super easy & fun.",
      data_delay_time: "0.2s",
   },
   

   // home_three_feature_2

   {
      id: 1,
      page: "home_three_feature_2",
      icon: feature3Icon_4,
      title: "Property Insurance",
      desc: "Elit esse cillum dolo fugiat nulla tur nos ullamo.",
   },
   {
      id: 2,
      page: "home_three_feature_2",
      icon: feature3Icon_5,
      title: "Easy Payments",
      desc: "quis nostrud exerct ullamo sucirity finibus ne derived.",
   },
   {
      id: 3,
      page: "home_three_feature_2",
      icon: feature3Icon_6,
      title: "Quick Process",
      desc: "Duis aute irure dolor reprehe de Cicero's voluptat velit.",
   },

   // home_4_feature_1

   {
      id: 1,
      page: "home_4_feature_1",
      icon: feature6Icon_1,
      title: "Buy a home",
      btn: "Find Home",
      desc: "Explore homy’s 2 million+ homes and uncover your ideal living space.",
   },
   {
      id: 2,
      page: "home_4_feature_1",
      icon: feature6Icon_2,
      title: "Rent a home",
      btn: "Rent Home",
      desc: "Discover a rental you'll love on homy, thanks to 35+ filters and tailored keywords.",
      data_delay_time: "0.1s",
   },
   {
      id: 3,
      page: "home_4_feature_1",
      icon: feature6Icon_3,
      title: "Sell a home",
      btn: "Sell Property",
      desc: "List, sell, thrive – with our top-notch real estate agency. It’s super easy & fun.",
      data_delay_time: "0.2s",
   },

   // home_5_feature_1

   {
      id: 1,
      page: "home_5_feature_1",
      item_bg: "home-5-feature-item-1",
      title: "California",
      desc: "1,230 Listing",
   },
   {
      id: 2,
      page: "home_5_feature_1",
      item_bg: "home-5-feature-item-2",
      title: "Miami",
      desc: "1,140 Listing",
      data_delay_time: "0.1s",
   },
   {
      id: 3,
      page: "home_5_feature_1",
      item_bg: "home-5-feature-item-3",
      title: "New York",
      desc: "1,740 Listing",
      data_delay_time: "0.2s",
   },
   {
      id: 4,
      page: "home_5_feature_1",
      item_bg: "home-5-feature-item-4",
      title: "Washington DC",
      desc: "720 Listing",
      data_delay_time: "0.3s",
   },

   // home_6_feature_1
   
   {
      id: 1,
      page: "home_6_feature_1",
      icon:feature7Icon_1,
      title: "Property Insurance",
      desc: "Elit esse cillum dol fug nulla tur nos ullamo.",
   }, 
   {
      id: 2,
      page: "home_6_feature_1",
      icon:feature7Icon_2,
      title: "Easy Payments",
      desc: "quis nostrud exerct ulla security finibus ne derived.",
   }, 
   {
      id: 3,
      page: "home_6_feature_1",
      icon:feature7Icon_3,
      title: "Quick Process",
      desc: "Duis aute irure do reprehe de Cicero's voluptat velit.",
   },
]

export default feature_data;