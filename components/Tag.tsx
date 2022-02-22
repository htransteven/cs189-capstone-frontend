import React from "react";
import styled from "styled-components";

export const TagWrapper = styled.div``;

export const TagContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: flex-start;
  justify-content: flex-start;

  & > ${TagWrapper} {
    margin: 3px;
    &:first-of-type {
      margin-left: 0px;
    }

    &:last-of-type {
      margin-right: 0px;
    }
  }
`;

interface Tag {
  text: string;
  background: string;
  textColor: string;
  onClick?: () => void;
}

export const Tag: React.FC<Tag> = ({
  text,
  background,
  textColor,
  onClick,
}) => {
  const className = `inline-flex ${background} ${textColor} rounded px-3 py-1 text-sm font-semibold"`;
  return (
    <TagWrapper className={className} onClick={onClick}>
      {text}
    </TagWrapper>
  );
};
