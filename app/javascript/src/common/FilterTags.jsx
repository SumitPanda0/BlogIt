import React from "react";

import { Tag, Button } from "@bigbinary/neetoui";

const FilterTags = ({
  appliedFilters,
  setAppliedFilters,
  setFilters,
  handleClearFilters,
}) => {
  if (Object.keys(appliedFilters).length === 0) {
    return null;
  }

  const handleRemoveFilter = filterKey => {
    const newFilters = { ...appliedFilters };
    delete newFilters[filterKey];
    setAppliedFilters(newFilters);
    setFilters(prev => ({ ...prev, [filterKey]: "" }));
  };

  const handleRemoveCategory = category => {
    const categories = appliedFilters.category
      .split(",")
      .filter(cat => cat !== category);

    const newFilters = { ...appliedFilters };

    if (categories.length === 0) {
      delete newFilters.category;
      setFilters(prev => ({ ...prev, category: "" }));
    } else {
      newFilters.category = categories.join(",");
      setFilters(prev => ({
        ...prev,
        category: categories.join(","),
      }));
    }

    setAppliedFilters(newFilters);
  };

  return (
    <>
      {(appliedFilters.status || appliedFilters.category) && (
        <div className="ml-2 flex items-center gap-2">
          <span className="text-gray-500">with filters:</span>
          {appliedFilters.status && (
            <Tag
              style="primary"
              label={`${
                appliedFilters.status.charAt(0).toUpperCase() +
                appliedFilters.status.slice(1)
              }`}
              onClose={() => handleRemoveFilter("status")}
            />
          )}
          {appliedFilters.category &&
            appliedFilters.category
              .split(",")
              .map(category => (
                <Tag
                  key={category}
                  label={`${category}`}
                  style="info"
                  onClose={() => handleRemoveCategory(category)}
                />
              ))}
          <Button
            label="Clear all"
            size="small"
            style="text"
            onClick={() => {
              setAppliedFilters({});
              handleClearFilters();
            }}
          />
        </div>
      )}
    </>
  );
};

export default FilterTags;
