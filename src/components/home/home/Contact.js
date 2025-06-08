"use client";
import React from "react";
import { useTranslations } from "next-intl";

const Contact = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission
  };
   const t = useTranslations('home');
  return (
      <>
    <form className="form-style1" onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-lg-6">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
                {t('contact.name')}
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              required
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-lg-6">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              {t('contact.lastName')}
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              required
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-md-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">{t('contact.email')}</label>
            <input
              type="email"
              className="form-control"
              placeholder="ibthemes21@gmail.com "
              required
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-md-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              {t('contact.subject')}
            </label>
            <textarea
              cols={30}
              rows={4}
              defaultValue={""}
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-md-12">
          <div className="d-grid">
            <button type="submit" className="ud-btn btn-dark">
              {t('contact.sendMessage')}
              <i className="fal fa-arrow-right-long" />
            </button>
          </div>
        </div>
        {/* End .col */}
      </div>
    </form>
      </>
  );
};

export default Contact;
