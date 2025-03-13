// src/App.js
import React, { useEffect, useMemo, useCallback } from "react";
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
const Grid = styled.div`
  display: grid;
  gap: 20px;
  padding: 20px;
  grid-template-columns: repeat(4, 1fr);

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  padding: 20px;
  background: #f5f5f5;
  flex-wrap: wrap;
`;

const App = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { pricingFilters, searchQuery, visibleItems, data } = useSelector(
    (state) => state.app
  );
  console.log({ pricingFilters, searchQuery, visibleItems, data });
  
  // Initialize filters from URL params
  useEffect(() => {
    const pricing = searchParams.get("pricing");
    const search = searchParams.get("search");

    if (pricing) {
      dispatch(setPricingFilters(pricing.split(",").map(n=> Number(n))));
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
  console.log({filteredItems});
  return (
    <div>
      <FilterContainer>
        <div className="filter-group">
          {["Paid", "Free", "View Only"].map((option,index) => (
            <button
              key={option}
              className={pricingFilters.includes(option) ? "active" : ""}
              onClick={() => handleFilterClick(index)}
            >
              {option}
            </button>

            
          ))}
          <button onClick={handleResetFilters}>Reset Filters</button>
        </div>

        <input
          type="text"
          placeholder="Search creators or titles..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </FilterContainer>

      <Grid>
        {filteredItems &&
          filteredItems
            .slice(0, visibleItems)
            .map((item) => <ContentItem key={item.id} item={item} />)}
      </Grid>
    </div>
  );
};

export default App;
