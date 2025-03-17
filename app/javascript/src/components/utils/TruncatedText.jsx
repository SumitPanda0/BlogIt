import React, { useRef, useState, useEffect } from "react";

import { Tooltip } from "@bigbinary/neetoui";

const TruncatedText = ({ text, className }) => {
  const textRef = useRef(null);
  const [isOverflowed, setIsOverflowed] = useState(false);

  useEffect(() => {
    const element = textRef.current;
    if (element) {
      setIsOverflowed(element.scrollWidth > element.clientWidth);
    }
  }, [text]);

  const content = (
    <div className={className} ref={textRef}>
      {text}
    </div>
  );

  return isOverflowed ? (
    <Tooltip content={text} position="top">
      {content}
    </Tooltip>
  ) : (
    content
  );
};

export default TruncatedText;
