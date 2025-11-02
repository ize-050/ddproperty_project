const propertyThumb_1 = "/assets/images/listing/img_01.jpg";
const propertyThumb_2 = "/assets/images/listing/img_02.jpg";
const propertyThumb_3 = "/assets/images/listing/img_03.jpg";
const propertyThumb_4 = "/assets/images/listing/img_04.jpg";
const propertyThumb_5 = "/assets/images/listing/img_05.jpg";
const propertyThumb_6 = "/assets/images/listing/img_06.jpg";

const property2Thumb_1 = "/assets/images/listing/img_07.jpg";
const property2Thumb_2 = "/assets/images/listing/img_08.jpg";
const property2Thumb_3 = "/assets/images/listing/img_09.jpg";

const property3Thumb_1 = "/assets/images/listing/img_13.jpg";
const property3Thumb_2 = "/assets/images/listing/img_14.jpg";
const property3Thumb_3 = "/assets/images/listing/img_15.jpg";
const property3Thumb_4 = "/assets/images/listing/img_16.jpg";

const propertyLargThumb_1 = "/assets/images/listing/img_large_01.jpg";
const propertyLargThumb_2 = "/assets/images/listing/img_large_02.jpg";
const propertyLargThumb_3 = "/assets/images/listing/img_large_03.jpg";
const propertyLargThumb_4 = "/assets/images/listing/img_large_04.jpg";
const propertyLargThumb_5 = "/assets/images/listing/img_large_05.jpg";
const propertyLargThumb_6 = "/assets/images/listing/img_large_06.jpg";

const propertyIcon_1 = "/assets/images/icon/icon_04.svg";
const propertyIcon_2 = "/assets/images/icon/icon_05.svg";
const propertyIcon_3 = "/assets/images/icon/icon_06.svg";


const property_data = [
   {
      id: 1,
      page: "home_1",
      tag: "FOR RENT",
      carousel_thumb: [{ img: propertyThumb_1, active: "active" }, { img: propertyThumb_2 }, { img: propertyThumb_3 }],
      title: "Blueberry villa",
      address: "Mirpur 10, Stadium dhaka 1208",
      property_info: [{ icon: propertyIcon_1, feature: "sqft", total_feature: 1370 }, { icon: propertyIcon_2, feature: "bed", total_feature: 0o3 }, { icon: propertyIcon_3, feature: "bath", total_feature: 0o2 },],
      price: 3280,
      price_text: "m",
      carousel: "1",
   },
   {
      id: 2,
      page: "home_1",
      tag: "FOR SELL",
      tag_bg: "sale",
      carousel_thumb: [{ img: propertyThumb_2, active: "active" }, { img: propertyThumb_3 }, { img: propertyThumb_1 }],
      title: "White House villa",
      address: "Muza link road, ca, usa",
      property_info: [{ icon: propertyIcon_1, feature: "sqft", total_feature: 1270 }, { icon: propertyIcon_2, feature: "bed", total_feature: 0o2 }, { icon: propertyIcon_3, feature: "bath", total_feature: 0o2 },],
      data_delay_time: "0.1s",
      price: 28100,
      carousel: "2",
   },
   {
      id: 3,
      page: "home_1",
      tag: "FOR SELL",
      tag_bg: "sale",
      carousel_thumb: [{ img: propertyThumb_3, active: "active" }, { img: propertyThumb_2 }, { img: propertyThumb_1 }],
      title: "Luxury villa in Dal lake.",
      address: "Mirpur 10, Stadium",
      property_info: [{ icon: propertyIcon_1, feature: "sqft", total_feature: 1270 }, { icon: propertyIcon_2, feature: "bed", total_feature: 0o2 }, { icon: propertyIcon_3, feature: "bath", total_feature: 0o2 },],
      data_delay_time: "0.2s",
      price: 42500,
      carousel: "3",
   },
   {
      id: 4,
      page: "home_1",
      tag: "FOR RENT",
      carousel_thumb: [{ img: propertyThumb_4, active: "active" }, { img: propertyThumb_5 }, { img: propertyThumb_6 }],
      title: "Blueberry villa",
      address: "Mirpur 10, Stadium dhaka 1208",
      property_info: [{ icon: propertyIcon_1, feature: "sqft", total_feature: 1370 }, { icon: propertyIcon_2, feature: "bed", total_feature: 0o3 }, { icon: propertyIcon_3, feature: "bath", total_feature: 0o2 },],
      price: 3280,
      price_text: "m",
      carousel: "4",
   },
   {
      id: 5,
      page: "home_1",
      tag: "FOR SELL",
      tag_bg: "sale",
      carousel_thumb: [{ img: propertyThumb_5, active: "active" }, { img: propertyThumb_4 }, { img: propertyThumb_6 }],
      title: "White House villa",
      address: "Muza link road, ca, usa",
      property_info: [{ icon: propertyIcon_1, feature: "sqft", total_feature: 1270 }, { icon: propertyIcon_2, feature: "bed", total_feature: 0o2 }, { icon: propertyIcon_3, feature: "bath", total_feature: 0o2 },],
      data_delay_time: "0.1s",
      price: 28100,
      carousel: "5",
   },
   {
      id: 6,
      page: "home_1",
      tag: "FOR RENT",
      carousel_thumb: [{ img: propertyThumb_6, active: "active" }, { img: propertyThumb_5 }, { img: propertyThumb_4 }],
      title: "Luxury villa in Dal lake.",
      address: "Mirpur 10, Stadium",
      property_info: [{ icon: propertyIcon_1, feature: "sqft", total_feature: 1270 }, { icon: propertyIcon_2, feature: "bed", total_feature: 0o2 }, { icon: propertyIcon_3, feature: "bath", total_feature: 0o2 },],
      data_delay_time: "0.2s",
      price: 42500,
      price_text: "m",
      carousel: "6",
   },

   // home two
   
   {
      id: 1,
      page: "home_2",
      tag: "FOR RENT",
      carousel_thumb: [{ img: property2Thumb_1, active: "active" }, { img: property2Thumb_2 }, { img: property2Thumb_3 }],
      title: "Blueberry villa.",
      address: "Mirpur 10, Stadium dhaka 1208",
      property_info: [{ icon: propertyIcon_1, feature: "sqft", total_feature: 1370 }, { icon: propertyIcon_2, feature: "bed", total_feature: 0o3 }, { icon: propertyIcon_3, feature: "bath", total_feature: 0o2 },],
      price: 34900.00,
      carousel: "1",
   },
   {
      id: 2,
      page: "home_2",
      tag: "FOR SELL",
      carousel_thumb: [{ img: property2Thumb_2, active: "active" }, { img: property2Thumb_1 }, { img: property2Thumb_2 }],
      title: "White House villa",
      address: "Muza link road, ca, usa",
      property_info: [{ icon: propertyIcon_1, feature: "sqft", total_feature: 1270 }, { icon: propertyIcon_2, feature: "bed", total_feature: 0o2 }, { icon: propertyIcon_3, feature: "bath", total_feature: 0o2 },],
      data_delay_time: "0.1s",
      price: 28100.00,
      carousel: "2",
   },
   {
      id: 3,
      page: "home_2",
      tag: "FOR SELL",
      carousel_thumb: [{ img: property2Thumb_3, active: "active" }, { img: property2Thumb_2 }, { img: property2Thumb_1 }],
      title: "Luxury villa in Dal lake.",
      address: "Mirpur 10, Stadium",
      property_info: [{ icon: propertyIcon_1, feature: "sqft", total_feature: 1270 }, { icon: propertyIcon_2, feature: "bed", total_feature: 0o2 }, { icon: propertyIcon_3, feature: "bath", total_feature: 0o2 },],
      data_delay_time: "0.2s",
      price: 42500.00,
      carousel: "3",
   },

   // home_3_property_2

   {
      id: 1,
      page: "home_3_property_2",
      tag: "FOR RENT",
      thumb:property3Thumb_1,
      carousel_thumb: [{id:"1", img: propertyLargThumb_1}, {id:"2", img: propertyLargThumb_2 }, {id:"3", img: propertyLargThumb_3 }],
      title: "Blueberry villa.",
      address: "Mirpur 10, Stadium dhaka 1208",
      property_info: [{ icon: propertyIcon_1, feature: "sqft", total_feature: 1780 }, { icon: propertyIcon_2, feature: "bed", total_feature: 0o3 }, { icon: propertyIcon_3, feature: "bath", total_feature: 0o2 },],
      price: 34900,
      carousel:"03",
   },
   {
      id: 2,
      page: "home_3_property_2",
      tag: "FOR SELL",
      thumb:property3Thumb_2,
      carousel_thumb: [{id:"4", img: propertyLargThumb_4}, {id:"5", img: propertyLargThumb_5 }, {id:"6", img: propertyLargThumb_6 }],
      title: "White House villa",
      address: "California link road, ca, usa",
      property_info: [{ icon: propertyIcon_1, feature: "sqft", total_feature: 2340 }, { icon: propertyIcon_2, feature: "bed", total_feature: 0o4 }, { icon: propertyIcon_3, feature: "bath", total_feature: 0o3 },],
      price: 28100,
      carousel:"03",
   },
   {
      id: 3,
      page: "home_3_property_2",
      tag: "FOR SELL",
      thumb:property3Thumb_3,
      carousel_thumb: [{id:"1", img: propertyLargThumb_1}, {id:"5", img: propertyLargThumb_5 }, {id:"3", img: propertyLargThumb_3 }, {id:"2", img: propertyLargThumb_2 }],
      title: "Luxury villa in Dal lake.",
      address: "Mirpur 10, Stadium",
      property_info: [{ icon: propertyIcon_1, feature: "sqft", total_feature: 1857 }, { icon: propertyIcon_2, feature: "bed", total_feature: 0o3 }, { icon: propertyIcon_3, feature: "bath", total_feature: 0o1 },],
      price: 42500,
      carousel:"04",
   },
   {
      id: 4,
      page: "home_3_property_2",
      tag: "FOR SELL",
      thumb:property3Thumb_4,
      carousel_thumb: [{id:"4", img: propertyLargThumb_4}, {id:"6", img: propertyLargThumb_6 }, {id:"3", img: propertyLargThumb_3 }, {id:"2", img: propertyLargThumb_2 }],
      title: "South Sun House",
      address: "Mirpur 10, Stadium",
      property_info: [{ icon: propertyIcon_1, feature: "sqft", total_feature: 2450 }, { icon: propertyIcon_2, feature: "bed", total_feature: 0o4 }, { icon: propertyIcon_3, feature: "bath", total_feature: 0o3 },],
      price: 55500,
      carousel:"04",
   },
   {
      id: 5,
      page: "home_3_property_2",
      tag: "FOR SELL",
      thumb:property3Thumb_2,
      carousel_thumb: [{id:"4", img: propertyLargThumb_4}, {id:"5", img: propertyLargThumb_5 }, {id:"6", img: propertyLargThumb_6 }],
      title: "White House villa",
      address: "California link road, ca, usa",
      property_info: [{ icon: propertyIcon_1, feature: "sqft", total_feature: 2340 }, { icon: propertyIcon_2, feature: "bed", total_feature: 0o4 }, { icon: propertyIcon_3, feature: "bath", total_feature: 0o3 },],
      price: 28100,
      carousel:"03",
   },

   // home_5
]

export default property_data;