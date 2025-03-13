// src/ContentItem.js
import React from "react";
import styled from "styled-components";

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 15px;
`;

const Title = styled.h3`
  margin: 0 0 8px;
  font-size: 1rem;
  color: #333;
`;

const Creator = styled.p`
  margin: 0 0 8px;
  font-size: 0.9rem;
  color: #666;
`;

const Price = styled.div`
  font-weight: bold;
  color: ${(props) => (props.$type === 0 ? "#2ecc71" : "#e67e22")};
`;

const ContentItem = ({ item }) => (
  <Card>
    <Image src={item.imagePath} alt={item.title} />
    <Content>
      <Title>{item.title}</Title>
      <Creator>By {item.creator}</Creator>
      <Price $type={item.pricingOption}>
        {item.pricingOption === 0
          ? `$${item.price.toFixed(2)}`
          : item.pricingOption === 1
          ? "Free"
          : "View Only"}
      </Price>
    </Content>
  </Card>
);

export default ContentItem;
