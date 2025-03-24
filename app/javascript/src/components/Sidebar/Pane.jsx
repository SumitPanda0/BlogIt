import React, { useState, useEffect } from "react";

import { Search, Plus } from "@bigbinary/neeto-icons";
import { Button, Input } from "@bigbinary/neetoui";
import { toast } from "react-toastify";

import Modal from "./Modal";

import categoriesApi from "../../apis/categories";
import useFuncDebounce from "../../hooks/useFuncDebounce";

const Pane = ({ onCategorySelect, selectedCategoryIds = [] }) => {
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCategories = async (search = "") => {
    try {
      const { data } = await categoriesApi.fetch(search);
      setCategories(data.categories);
    } catch (error) {
      toast.error("Failed to fetch categories", error);
    }
  };

  const debouncedFetchCategories = useFuncDebounce(fetchCategories);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearch = event => {
    const value = event.target.value;
    setSearchTerm(value);
    debouncedFetchCategories(value);
  };

  const toggleSearch = () => {
    setShowSearchInput(!showSearchInput);
    if (showSearchInput) {
      setSearchTerm("");
      fetchCategories();
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Category name cannot be empty");

      return;
    }

    try {
      setSubmitting(true);
      const { data } = await categoriesApi.create({ name: newCategoryName });
      setCategories([...categories, data.category]);
      setNewCategoryName("");
      setShowAddModal(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCategoryClick = categoryId => {
    let newSelectedIds;

    if (selectedCategoryIds.includes(categoryId)) {
      newSelectedIds = selectedCategoryIds.filter(id => id !== categoryId);
    } else {
      newSelectedIds = [...selectedCategoryIds, categoryId];
    }

    onCategorySelect(newSelectedIds);
  };

  const handleClearAll = () => {
    onCategorySelect([]);
  };

  return (
    <>
      <div className="flex h-full flex-col p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">CATEGORIES</h2>
          <div className="flex items-center space-x-1">
            <Button
              className="text-black"
              icon={Search}
              style="tertiary"
              title="Search categories"
              onClick={toggleSearch}
            />
            <Button
              className="text-black"
              icon={Plus}
              style="tertiary"
              title="Add new category"
              onClick={() => setShowAddModal(true)}
            />
          </div>
        </div>
        {showSearchInput && (
          <div className="mb-4">
            <Input
              autoFocus
              placeholder="Search categories"
              prefix={<Search />}
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          <div
            className={`mb-2 cursor-pointer rounded-md p-2 text-black ${
              selectedCategoryIds.length === 0
                ? "bg-white"
                : "hover:bg-gray-100"
            }`}
            onClick={() => {
              handleClearAll();
            }}
          >
            All Posts
          </div>
          {categories.length === 0 ? (
            <div className="py-4 text-center text-gray-500">
              {searchTerm
                ? "No matching categories found"
                : "No categories found"}
            </div>
          ) : (
            categories.map(category => (
              <div
                key={category.id}
                className={`mb-2 cursor-pointer rounded-md p-2 text-black ${
                  selectedCategoryIds.includes(category.id)
                    ? "bg-white"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.name}
              </div>
            ))
          )}
        </div>
      </div>
      <div>
        <Modal
          handleAddCategory={handleAddCategory}
          newCategoryName={newCategoryName}
          setNewCategoryName={setNewCategoryName}
          setShowAddModal={setShowAddModal}
          showAddModal={showAddModal}
          submitting={submitting}
        />
      </div>
    </>
  );
};

export default Pane;
