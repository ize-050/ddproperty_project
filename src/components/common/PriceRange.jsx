"use client"
import { getTrackBackground, Range } from "react-range";

const PriceRange = ({ STEP, MIN, MAX, values, handleChanges }) => {
   return (
      <>
         <Range
            step={STEP}
            min={MIN}
            max={MAX}
            values={values}
            onChange={(vals) => handleChanges(vals)}
            renderTrack={({ props, children }) => (
               <div
                  {...props}
                  key='track'
                  style={{
                     ...props.style,
                     height: '4px',
                     width: '100%',
                     // borderRadius: "10px",
                     background: getTrackBackground({
                        values: values,
                        colors: ["#fff", "#000", "#1B1819"],
                        min: MIN,
                        max: MAX
                     }),
                  }}
               >
                  {children}
               </div>
            )}
            renderThumb={({ props, index }) => (
               <div
                  {...props}
                  key={`thumb-${index}`}
                  className="ui-input"
                  style={{
                     ...props.style,
                     height: '20px',
                     width: '20px',
                     backgroundColor: "#fff",
                     outline: "none",
                     borderRadius: "50px",
                     border: "2px solid #000",
                  }}
               />
            )}
         />
      </>
   );
};


export default PriceRange;