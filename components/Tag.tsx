import React from 'react';

export default function Tag({ text, background, textColor }) {
  const className = `inline-flex ${background} ${textColor} rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"`;
  return <div className={className}>{text}</div>;
}
