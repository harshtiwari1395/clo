// src/ContentItem.js
import React from "react";
import styled from "styled-components";

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: black;
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
  display: flex;
  justify-content: space-between;
  padding: 15px;
`;

const Title = styled.h3`
  margin: 0 0 8px;
  font-size: 0.9rem;
  color: white;
`;

const Creator = styled.p`
  margin: 0 0 8px;
  font-size: 0.9rem;
  color: white;
`;

const Price = styled.div`
  font-weight: bold;
  font-size: 1.2rem;
  color: white;
`;

const ContentItem = ({ item }) => (
  <Card>
    <Image src={item.imagePath} alt={item.title} />
    <Content>
      <div>
        <Title>{item.title}</Title>
        <Creator>By {item.creator}</Creator>
      </div>
      <div style={{alignContent: "center"}}>
      <Price $type={item.pricingOption}>
        {item.pricingOption === 0
          ? `$${item.price.toFixed(2)}`
          : item.pricingOption === 1
          ? "Free"
          : "View Only"}
      </Price>
      </div>
    </Content>
  </Card>
);

export default ContentItem;
