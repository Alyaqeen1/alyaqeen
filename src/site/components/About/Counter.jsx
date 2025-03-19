import { useEffect, useState } from "react";
import "odometer/themes/odometer-theme-default.css";
import { useInView } from "react-intersection-observer";
import Odometer from "react-odometerjs";

const Counter = ({ value }) => {
  const [odometerValue, setOdometerValue] = useState(0);
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      setTimeout(() => {
        setOdometerValue(value);
      }, 1000);
    }
  }, [inView, value]);

  return (
    <span ref={ref}>
      {inView ? (
        <Odometer value={odometerValue} format="(,ddd)" theme="default" />
      ) : (
        0
      )}
    </span>
  );
};

export default Counter;
