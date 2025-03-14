// src/ContentItem.js
import React from "react";
import styled from "styled-components";



const GridItem = styled.div`
    flex: 0 0 calc(25% - 20px); /* Adjust for 4 items per row  */
    max-width: calc(25% - 20px);
    box-sizing: border-box;
    min-width: 320px; /* min width */

    @media (max-width: 1200px) {
        flex: 0 0 calc(33.33% - 20px); /* 3 items per row for medium screens */
        max-width: calc(33.33% - 20px);
    }

    @media (max-width: 768px) {
        flex: 0 0 calc(50% - 20px); /* 2 items per row for smaller screens */
        max-width: calc(50% - 20px);
    }

    @media (max-width: 480px) {
        flex: 0 0 100%; /* 1 item per row for extra small screens */
        max-width: 100%;
    }
`;


const Image = styled.img`
  width: 100%;
  height: 250px;
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
  <GridItem>
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
  </GridItem>
);

export default ContentItem;
