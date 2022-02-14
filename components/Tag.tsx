import React from "react";

export default function Tag({ text, background, textColor }) {
  const className = `inline-flex ${background} ${textColor} rounded px-3 py-1 text-sm font-semibold"`;
  return <div className={className}>{text}</div>;
}
