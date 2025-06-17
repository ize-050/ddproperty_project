import Image from "next/image";
import Form from "@/components/pages/contact/Form.jsx";
import LanguageApi from "@/utils/languageApi";
import { TranslationInitializer } from "@/components/Translation/page";

export const metadata = {
    title: "Contact Us - D-LUCK PROPERTY",
};

async function getContactTranslations(locale) {
    // Fetch contact section translations from API
    const response = await LanguageApi.getUiStringsBySection('contact', {
        serverSide: true,
        cache: 'no-store',
        next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.success) {
        console.error('Failed to fetch contact translations:', response.error);
        return [];
    }

    return response.data;
}

const Contact = async ({ params }) => {
    // Get locale from params
    const locale = params.locale || 'en';
    
    // Fetch translations
    const contactTranslations = await getContactTranslations(locale);
    return (
        <>
            {/* Initialize translations in the client */}
            <TranslationInitializer 
                translations={{ contact: contactTranslations }} 
                locale={locale} 
            />

            <section className="p-0">
                <Image
                    className="home8-map contact-page"
                    loading="lazy"
                    width={1920}
                    height={1080}
                    src="/images/contact/banner-contact-us.png"
                    title="Contact Us - D-LUCK PROPERTY"
                    aria-label="Contact Us Banner"
                />
            </section>

            <section>
                <div className="container">
                    <div className="row d-flex align-items-end">
                        <div className="col-lg-5 position-relative">
                            <div className="home8-contact-form default-box-shadow1 bdrs12 bdr1 p30 mb30-md bgc-white">
                                <h4 className="form-title mb25">
                                    {/* Use translation from API */}
                                    {contactTranslations.find(t => t.slug === 'need_more_info')?.[locale] || 
                                     contactTranslations.find(t => t.slug === 'need_more_info')?.en || 
                                     'Need more information?'}
                                </h4>
                                <Form translations={contactTranslations} locale={locale} />
                            </div>
                        </div>

                        <div className="col-lg-5 offset-lg-2">
                            <h2 className="mb-4">
                                {/* Use translation from API */}
                                {contactTranslations.find(t => t.slug === 'contact_consultant')?.[locale] || 
                                 contactTranslations.find(t => t.slug === 'contact_consultant')?.en || 
                                 'Contact our Property Consultant'}
                            </h2>
                            <p className="mb-4">
                                {/* Use translation from API */}
                                {contactTranslations.find(t => t.slug === 'contact_description')?.[locale] || 
                                 contactTranslations.find(t => t.slug === 'contact_description')?.en || 
                                 'Please do not hesitate to contact us if you have any questions about the condo & properties buying, selling or leasing process and for would like to schedule an appointment to view properties in Pattaya.'}
                            </p>

                        </div>
                    </div>
                </div>
            </section>


            <section className="container">
                <div className="d-flex row">
                    <div className="col-lg-4 text-center">
                        <a href="tel:+66951432234" className="d-block text-decoration-none">
                            <div className="mb-3">
                                <img src="/images/contact/icon-call-us.png" alt="Call Us" width="60" height="60" />
                            </div>
                            <h5 className="mb-0">Call Us Now</h5>
                            <p className="small text-muted">+66(0)95 1432 2345</p>
                        </a>
                    </div>

                    <div className="col-lg-4 text-center">
                        <a href="mailto:info@d-luckproperty.com" className="d-block text-decoration-none">
                            <div className="mb-3">
                                <img src="/images/contact/icon-drop-a-mail.png" alt="Email Us" width="60" height="60" />
                            </div>
                            <h5 className="mb-0">Drop a Mail</h5>
                            <p className="small text-muted">info@d-luckproperty.com</p>
                        </a>
                    </div>

                    <div className="col-lg-4 text-center">
                        <a href="https://line.me/ti/p/@dluck" target="_blank" rel="noopener noreferrer" className="d-block text-decoration-none">
                            <div className="mb-3">
                                <img src="/images/contact/icon-add-friend.png" alt="Line" width="60" height="60" />
                            </div>
                            <h5 className="mb-0">Add Friend</h5>
                            <p className="small text-muted">Line ID : @dluck or Click</p>
                        </a>
                    </div>
                </div>
            </section>


        </>
    );
};

export default Contact;
