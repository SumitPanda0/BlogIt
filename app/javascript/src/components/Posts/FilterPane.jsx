import React from "react";

import { Button, Input, Pane, Select } from "@bigbinary/neetoui";

const FilterPane = ({
  isPaneOpen,
  setIsPaneOpen,
  filters,
  handleFilterChange,
  categoryOptions,
  statusOptions,
  handleClearFilters,
  handleApplyFilters,
}) => {
  const { Header, Body, Footer } = Pane;

  return (
    <Pane isOpen={isPaneOpen} onClose={() => setIsPaneOpen(false)}>
      <Header>
        <h2>Search Filters</h2>
      </Header>
      <Body>
        <div className="space-y-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Title
            </label>
            <Input
              placeholder="Filter by title"
              value={filters.title}
              onChange={e => handleFilterChange("title", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Category
            </label>
            <Select
              isClearable
              isMulti
              options={categoryOptions}
              placeholder="Select categories"
              value={
                filters.category
                  ? filters.category
                      .split(",")
                      .map(cat => ({ label: cat, value: cat }))
                  : []
              }
              onChange={options =>
                handleFilterChange(
                  "category",
                  options?.length
                    ? options.map(option => option.value).join(",")
                    : ""
                )
              }
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Status
            </label>
            <Select
              isClearable
              options={statusOptions}
              placeholder="Select status"
              value={
                filters.status
                  ? { label: filters.status, value: filters.status }
                  : null
              }
              onChange={option =>
                handleFilterChange("status", option?.value || "")
              }
            />
          </div>
        </div>
      </Body>
      <Footer>
        <div className="flex justify-end space-x-2">
          <Button label="Clear" style="text" onClick={handleClearFilters} />
          <Button label="Apply Filters" onClick={handleApplyFilters} />
        </div>
      </Footer>
    </Pane>
  );
};

export default FilterPane;
