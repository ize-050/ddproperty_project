import React from "react";

const Form = () => {
  return (
    <form className="contact-form">

      
      <div className="mb-3">
        <label htmlFor="firstName" className="form-label">First Name</label>
        <input 
          type="text" 
          className="form-control" 
          id="firstName" 
          required 
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="lastName" className="form-label">Last Name</label>
        <input 
          type="text" 
          className="form-control" 
          id="lastName" 
          required 
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input 
          type="email" 
          className="form-control" 
          id="email" 
          required 
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="message" className="form-label">Message</label>
        <textarea 
          className="form-control" 
          id="message" 
          style={{ height: '150px' }}
          required
        ></textarea>
      </div>
      
      <button type="submit" className="btn btn-dark w-100 py-3 mt-3">
        Submit <i className="fas fa-arrow-right ms-2"></i>
      </button>
    </form>
  );
};

export default Form;
