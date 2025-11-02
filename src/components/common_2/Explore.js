import Image from "next/image";
import Link from "next/link";
import useDynamicTranslations from '@/hooks/useDynamicTranslations';

const Explore = () => {
  const { t: dynamicT } = useDynamicTranslations('home');
  
  // Array of iconbox data
  const iconboxData = [
    {
      id: 1,
      icon: "/images/home-about/1.svg",
      titleKey: "rental_management",
      textKey: "rental_management_desc",
      linkTextKey: "find_home",
    },
    {
      id: 2,
      icon: "/images/home-about/2.svg",
      titleKey: "decoration_buildin",
      textKey: "decoration_buildin_desc",
      linkTextKey: "place_ad",
    },
    {
      id: 3,
      icon: "/images/home-about/3.svg",
      titleKey: "online_marketing",
      textKey: "online_marketing_desc",
      linkTextKey: "find_rental",
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
              <h4 className="title">{dynamicT(item.titleKey, item.titleKey)}</h4>
              <p className="text">{dynamicT(item.textKey, item.textKey)}</p>
              {item.linkTextKey === "place_ad" && (
                <Link href="/about" className="ud-btn btn-white2">
                  {dynamicT('more', 'More')}
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
