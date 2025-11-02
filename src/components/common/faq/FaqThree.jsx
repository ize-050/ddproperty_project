"use client"

const FaqThree = () => {

   const faq_data = [
      {
         id: 1,
         question: "What is the difference between a buyer and a seller?",
         answer: "A buyer is someone who is looking to purchase a property, while a seller is someone who is looking to sell their property."
      },
      {
         id: 2,
         question: "What is the difference between a buyer and a seller?",
         answer: "A buyer is someone who is looking to purchase a property, while a seller is someone who is looking to sell their property."
      },
      {
         id: 3,
         question: "What is the difference between a buyer and a seller?",
         answer: "A buyer is someone who is looking to purchase a property, while a seller is someone who is looking to sell their property."
      },
   ]

   return (
      <>
         {faq_data.map((item) => (
            <div key={item.id} className="accordion-item">
               <h2 className="accordion-header">
                  <button className={`accordion-button ${item.id === 1 ? "" : "collapsed"}`} type="button"
                     data-bs-toggle="collapse" data-bs-target={`#collapse${item.id}`} aria-expanded="true"
                     aria-controls={`collapse${item.id}`}>
                     {item.question}
                  </button>
               </h2>
               <div id={`collapse${item.id}`} className={`accordion-collapse collapse ${item.id === 1 ? "show" : ""}`}
                  data-bs-parent="#accordionThree">
                  <div className="accordion-body">
                     <p>{item.answer}</p>
                  </div>
               </div>
            </div>
         ))}
      </>
   )
}

export default FaqThree
