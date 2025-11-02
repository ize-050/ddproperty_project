"use client"
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { InView } from "react-intersection-observer";


const Count = ({ number }) => {
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    const hasCountedBefore = localStorage.getItem("hasCountedBefore");

    if (!hasCountedBefore) {
      setFocus(true);
      localStorage.setItem("hasCountedBefore", "true");
    }
  }, []);

  return (
    <>
      <CountUp start={0} end={focus ? number : 0} duration={2} decimals={number % 1 !== 0 ? 1 : 0}>
        {({ countUpRef }) => (
          <>
            <span ref={countUpRef} />
            <InView
              as="span"
              onChange={(inView) => {
                if (inView && !focus) {
                  setFocus(true);
                }
              }}
            ></InView>
          </>
        )}
      </CountUp>
    </>
  );
};

export default Count;