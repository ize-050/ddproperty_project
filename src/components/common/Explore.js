import Image from "next/image";
import Link from "next/link";

const Explore = () => {
  // Array of iconbox data
  const iconboxData = [
    {
      id: 1,
      icon: "/images/icon/property-buy.svg",
      title: "Rental Management",
      text: "We help you secure quality tenants at optimal rental rates",
      linkText: "Find a home",
    },
    {
      id: 2,
      icon: "/images/icon/property-sell.svg",
      title: "Decoration and Build-in Furniture",
      text: "We specialize in room decoration and built-in furniture solutions",
      linkText: "Place an ad",
    },
    {
      id: 3,
      icon: "/images/icon/property-rent.svg",
      title: "Online Property Marketing with Free Media",
      text: "We help you market your property online and across all media",
      linkText: "Find a rental",
    },
  ];

  return (
    <>
      {iconboxData.map((item) => (
        <div
          className="col-sm-6 col-lg-4"
          key={item.id}
          data-aos="fade-up"
          data-aos-delay={(item.id + 1) * 100} // Increase delay for each item
        >
          <div className="iconbox-style2 text-center">
            <div className="icon">
              <Image width={150} height={150} src={item.icon} alt="icon" />
            </div>
            <div className="iconbox-content">
              <h4 className="title">{item.title}</h4>
              <p className="text">{item.text}</p>
              {item.linkText =="Place an ad" && (
                <Link href="/about" className="ud-btn btn-white2">
                  More
                  <i className="fal fa-arrow-right-long" />
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Explore;
