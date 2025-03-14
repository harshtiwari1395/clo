// src/App.js
import React, { useEffect, useMemo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import {
  setPricingFilters,
  setSearchQuery,
  incrementVisibleItems,
  resetFilters,
  setData,
} from "./store";
import ContentItem from "./components/ContentItem";
import "./styles.css";

// Styled components
const AppContainer = styled.div`
  background-color: #121212;
  color: #ffffff;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #1e1e1e;
  border-bottom: 1px solid #333;

  h2 {
    color: #00d8ff;
    font-size: 24px;
    font-weight: bold;
    margin: 0;
  }
`;

const SearchBarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px 0;

  .search-wrapper {
    position: relative;
    width: 90%;
    max-width: 90vw; 
    display: flex;
    align-items: center;
  }

  input {
    flex-grow: 1; 
    padding: 10px 40px 10px 15px; 
    border-radius: 4px;
    border: none;
    background-color: #2b2b2b;
    color: #ddd;
    font-size: 1rem;
    width: 100%; 

    &::placeholder {
      color: #777;
      font-style: italic;
      font-size: 0.9rem;
    }

    &:focus {
      outline: none;
      border: 1px solid #007bff; 
    }
  }

  .search-icon {
    position: absolute;
    top: 50%;
    right: 10px; 
    transform: translateY(-50%);
    color: #777; 
    font-size: 1.2rem; 
    pointer-events: none; 
  }
`;


const FilterSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px;
  border-bottom: 1px solid #333;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  label {
    color: #ccc;
    margin-right: 15px;
    display: inline-flex;
    align-items: center;
    cursor: pointer;

    input[type="checkbox"] {
      margin-right: 5px;
      accent-color: #007bff;
      width: 18px;
      height: 18px;
    }

    span {
      font-size: 0.9rem;
    }
  }
`;

const ResetButton = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background-color: #555;
  color: #fff;
  cursor: pointer;

  &:hover {
    background-color: #777;
  }
`;



const SortSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  label {
    color: #ddd;
    font-size: 0.9rem;
  }

  select {
    padding: 6px 10px;
    border-radius: 4px;
    border: none;
    background-color: #2b2b2b;
    color: #ddd;
  }
`;

const PricingSliderContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;

    .slider-labels {
        display: flex;
        justify-content: space-between;
        width: 200px;
        color: #ccc;
        font-size: 0.8rem;
    }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 10px;
  padding: 20px;
`;

const App = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { pricingFilters, searchQuery, visibleItems, data } = useSelector(
    (state) => state.app
  );

  // Initialize filters from URL params
  useEffect(() => {
    const pricing = searchParams.get("pricing");
    const search = searchParams.get("search");

    if (pricing) {
      dispatch(setPricingFilters(pricing.split(",").map(Number)));
    }
    if (search) {
      dispatch(setSearchQuery(search));
    }
  }, [dispatch, searchParams]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(
        "https://closet-recruiting-api.azurewebsites.net/api/data"
      );
      dispatch(setData(data));
    };
    fetchData();
  }, [dispatch]);

  // Filter and search logic
  const filteredItems = useMemo(() => {
    return (
      data &&
      data?.filter((item) => {
        const matchesPricing =
          pricingFilters.length === 0 ||
          pricingFilters.includes(item.pricingOption);

        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
          searchLower === "" ||
          item.creator.toLowerCase().includes(searchLower) ||
          item.title.toLowerCase().includes(searchLower);

        return matchesPricing && matchesSearch;
      })
    );
  }, [data, pricingFilters, searchQuery]);

  // URL persistence
  useEffect(() => {
    const params = {};
    if (pricingFilters.length) params.pricing = pricingFilters.join(",");
    if (searchQuery) params.search = searchQuery;
    setSearchParams(params);
  }, [pricingFilters, searchQuery, setSearchParams]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        dispatch(incrementVisibleItems());
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dispatch]);

  // Event handlers
  const handleFilterClick = useCallback(
    (option) => {
      const newFilters = pricingFilters.includes(option)
        ? pricingFilters.filter((f) => f !== option)
        : [...pricingFilters, option];
      dispatch(setPricingFilters(newFilters));
    },
    [pricingFilters, dispatch]
  );

  const handleResetFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  const handleSearchChange = useCallback(
    (e) => {
      dispatch(setSearchQuery(e.target.value));
    },
    [dispatch]
  );

  return (
    <AppContainer>
      <TopBar>
        <h2>CONNECT</h2>
      </TopBar>
        <SearchBarContainer>
  <div className="search-wrapper">
    <input
      type="text"
      placeholder="Find the items you're looking for"
      value={searchQuery}
      onChange={handleSearchChange}
    />
    <span className="search-icon">
      🔎
    </span>
  </div>
</SearchBarContainer>

      <FilterSection>
        <FilterGroup>
          <span> Pricing Option</span>
          <label>
            <input
              type="checkbox"
              checked={pricingFilters.includes(0)}
              onChange={() => handleFilterClick(0)}
            />
            <span>Paid</span>
          </label>
          <label>
            <input
              type="checkbox"
              checked={pricingFilters.includes(1)}
              onChange={() => handleFilterClick(1)}
            />
            <span>Free</span>
          </label>
          <label>
            <input
              type="checkbox"
              checked={pricingFilters.includes(2)}
              onChange={() => handleFilterClick(2)}
            />
            <span>View Only</span>
          </label>
        </FilterGroup>
        <ResetButton onClick={handleResetFilters}>RESET</ResetButton>
        <SortSection>
          <label>Sort By</label>
          <select>
            <option>Relevance</option>
          </select>
        </SortSection>
      </FilterSection>

      <Grid>
        {filteredItems &&
          filteredItems
            .slice(0, visibleItems)
            .map((item) => <ContentItem key={item.id} item={item} />)}
      </Grid>
    </AppContainer>
  );
};

export default App;
