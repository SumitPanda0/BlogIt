import React, { useEffect, useState } from "react";

import { Delete, Filter, MenuHorizontal } from "@bigbinary/neeto-icons";
import {
  ActionDropdown,
  Button,
  Dropdown,
  Table,
  Checkbox,
  Alert,
} from "@bigbinary/neetoui";
import { Link, useHistory } from "react-router-dom";

import FilterPane from "./FilterPane";

import postsApi from "../../apis/posts";
import FilterTags from "../../common/FilterTags";
import { PageLoader } from "../../common/PageLoader";
import { getFromLocalStorage } from "../../utils/storage";
import TruncatedText from "../utils/TruncatedText";

const UserPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [isPaneOpen, setIsPaneOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    title: true,
    categories: true,
    updated_at: true,
    status: true,
    action: true,
  });

  const [filters, setFilters] = useState({
    title: "",
    category: "",
    status: "",
  });
  const [postToDelete, setPostToDelete] = useState(null);
  const [isBulkDeleteAlertOpen, setIsBulkDeleteAlertOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});

  const history = useHistory();

  const isLoggedIn = !!getFromLocalStorage("authToken");

  const { Menu, MenuItem, Divider } = Dropdown;

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const {
        data: { posts },
      } = await postsApi.fetchUserPosts(appliedFilters);

      setPosts(posts);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async post => {
    try {
      await postsApi.update(post.slug, {
        ...post,
        status: "published",
      });

      fetchUserPosts();
    } catch (error) {
      logger.error(error);
    }
  };

  const handleUnpublish = async post => {
    try {
      await postsApi.update(post.slug, {
        ...post,
        status: "draft",
      });

      fetchUserPosts();
    } catch (error) {
      logger.error(error);
    }
  };

  const handleDelete = async post => {
    try {
      await postsApi.destroy(post.slug);
      fetchUserPosts();
    } catch (error) {
      logger.error(error);
    }
  };

  const handleBulkUpdate = async (posts, status) => {
    try {
      await postsApi.bulkUpdateStatus({
        post_ids: posts,
        status,
      });
      fetchUserPosts();
    } catch (error) {
      logger.error(error);
    }
  };

  const handleBulkDelete = async posts => {
    try {
      await postsApi.bulkDestroy({ post_ids: posts });
      fetchUserPosts();
    } catch (error) {
      logger.error(error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApplyFilters = () => {
    const nonEmptyFilters = Object.entries(filters)
      .filter(([_, value]) => value)
      .reduce((acc, [key, value]) => {
        acc[key] = value;

        return acc;
      }, {});

    setAppliedFilters(nonEmptyFilters);
    setIsPaneOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({
      title: "",
      category: "",
      status: "",
    });
  };

  const statusOptions = [
    { label: "Published", value: "published" },
    { label: "Draft", value: "draft" },
  ];

  const categoryOptions = [
    ...new Set(
      posts.flatMap(post => post.categories.map(category => category.name))
    ),
  ].map(category => ({
    label: category,
    value: category,
  }));

  useEffect(() => {
    if (!isLoggedIn) {
      history.push("/login");

      return;
    }

    fetchUserPosts();
  }, [isLoggedIn, appliedFilters]);

  if (!isLoggedIn) {
    return null;
  }

  if (loading) return <PageLoader />;

  if (error) {
    return (
      <div className="rounded-md bg-red-100 p-4 text-red-700">
        Error loading posts: {error.message}
      </div>
    );
  }

  const formatDate = dateString => {
    const date = new Date(dateString);

    return `${date.getDate()} ${date.toLocaleString("default", {
      month: "long",
    })} ${date.getFullYear()}, ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`;
  };

  const getDisplayDate = post => {
    if (post.status === "published") {
      return post.published_at
        ? formatDate(post.published_at)
        : formatDate(post.created_at);
    }

    return post.last_published_at
      ? `${formatDate(post.last_published_at)}`
      : "Never published";
  };

  const allColumnData = [
    {
      dataIndex: "title",
      key: "title",
      title: "Title",
      width: 200,
      fixed: true,
      render: (title, record) => (
        <Link to={`/posts/${record.slug}/edit`}>
          <TruncatedText
            className="w-[120px] truncate text-green-600 sm:w-[120px] md:w-[150px] lg:w-[180px]"
            text={title}
          />
        </Link>
      ),
    },
    {
      dataIndex: "categories",
      key: "categories",
      title: "Category",
      width: 150,
      fixed: true,
      render: categories => categories,
    },
    {
      dataIndex: "updated_at",
      key: "updated_at",
      title: "Last Published At",
      width: 150,
      fixed: true,
      render: (_, post) => getDisplayDate(post),
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      width: 150,
      fixed: true,
      render: status => (
        <div className="flex items-center justify-between">
          <span className="capitalize">{status}</span>
        </div>
      ),
    },
    {
      dataIndex: "action",
      key: "action",
      title: "Action",
      width: 150,
      fixed: true,
      render: (_, post) => (
        <Dropdown
          appendTo={() => document.body}
          buttonStyle="tertiary"
          icon={MenuHorizontal}
          position="bottom-end"
          strategy="fixed"
        >
          {post.status === "draft" ? (
            <Menu className="flex w-full flex-col items-center justify-center">
              <MenuItem className="w-full">
                <Button
                  className="w-full items-center justify-center p-2 text-black"
                  label="Publish"
                  style="link"
                  onClick={() => handlePublish(post)}
                />
              </MenuItem>
              <Divider />
              <MenuItem className="w-full">
                <Button
                  className="w-full items-center justify-center p-2 text-red-500"
                  label="Delete"
                  style="link"
                  onClick={() => {
                    setPostToDelete(post);
                    setIsAlertOpen(true);
                  }}
                />
              </MenuItem>
            </Menu>
          ) : (
            <Menu className="flex flex-col items-center justify-center">
              <MenuItem className="w-full">
                <Button
                  className="w-full items-center justify-center p-2 text-black"
                  label="Unpublish"
                  style="link"
                  onClick={() => handleUnpublish(post)}
                />
              </MenuItem>
              <Divider />
              <MenuItem className="w-full">
                <Button
                  className="w-full items-center justify-center p-2 text-red-500"
                  label="Delete"
                  style="link"
                  onClick={() => {
                    setPostToDelete(post);
                    setIsAlertOpen(true);
                  }}
                />
              </MenuItem>
            </Menu>
          )}
        </Dropdown>
      ),
    },
  ];

  const columnData = allColumnData.filter(column => visibleColumns[column.key]);

  const handleColumnVisibilityChange = columnKey => {
    if (columnKey === "title") return;

    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  const rowData = posts.map(post => ({
    id: post.id,
    key: post.id,
    title: post.title,
    slug: post.slug,
    description: post.description,
    categories: post.categories.map(category => category.name).join(", "),
    status: post.status,
    updated_at: formatDate(post.updated_at),
    created_at: formatDate(post.created_at),
    published_at: post.published_at,
    last_published_at: post.last_published_at,
  }));

  const columnsForDropdown = [
    { key: "title", title: "Title" },
    { key: "categories", title: "Category" },
    { key: "updated_at", title: "Last Published At" },
    { key: "status", title: "Status" },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold">My Blog Posts</h1>
      <div className="flex flex-col">
        {selectedPosts.length === 0 && (
          <div className="mb-4 mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <h3 className="text-md mr-2 text-gray-500">
                {posts.length === 1 ? "1 article" : `${posts.length} articles`}
              </h3>
              <FilterTags
                appliedFilters={appliedFilters}
                handleClearFilters={handleClearFilters}
                setAppliedFilters={setAppliedFilters}
                setFilters={setFilters}
              />
            </div>
            <div className="flex items-center gap-4">
              <div>
                <ActionDropdown
                  buttonProps={{ size: "medium" }}
                  buttonStyle="secondary"
                  label="Columns"
                >
                  {columnsForDropdown.map(column => (
                    <div className="px-4 py-2" key={column.key}>
                      <Checkbox
                        checked={visibleColumns[column.key]}
                        disabled={column.key === "title"}
                        id={`column-${column.key}`}
                        label={column.title}
                        onChange={() =>
                          handleColumnVisibilityChange(column.key)
                        }
                      />
                    </div>
                  ))}
                </ActionDropdown>
              </div>
              <div>
                <Button
                  icon={Filter}
                  size="medium"
                  style="tertiary"
                  onClick={() => setIsPaneOpen(true)}
                />
              </div>
            </div>
          </div>
        )}
        {selectedPosts.length > 0 && (
          <div className="mb-4 mt-4 flex items-center justify-start gap-4">
            <div>
              <span className="text-base text-black">
                <span className="font-bold text-gray-600">
                  {selectedPosts.length === 1
                    ? "1 article"
                    : `${selectedPosts.length} articles`}{" "}
                </span>{" "}
                selected out of {posts.length}
              </span>
            </div>
            <div>
              <Dropdown
                buttonProps={{ size: "medium" }}
                buttonStyle="secondary"
                label="Change status"
              >
                <Menu>
                  <MenuItem className=" w-full  p-3">
                    <Button
                      className="w-full text-black"
                      label="Publish"
                      style="link"
                      onClick={() =>
                        handleBulkUpdate(selectedPosts, "published")
                      }
                    />
                  </MenuItem>
                  <MenuItem className="w-full p-3">
                    <Button
                      className="w-full text-black"
                      label="Draft"
                      style="link"
                      onClick={() => handleBulkUpdate(selectedPosts, "draft")}
                    />
                  </MenuItem>
                </Menu>
              </Dropdown>
            </div>
            <div>
              <Button
                icon={Delete}
                label="Delete"
                size="medium"
                style="danger"
                onClick={() => setIsBulkDeleteAlertOpen(true)}
              />
            </div>
          </div>
        )}
        {appliedFilters?.title?.length > 0 && (
          <div className="mb-4">
            <span className="text-sm text-gray-500">
              {posts.length === 0 && "No articles match your filters"}
              {posts.length === 1 && (
                <b>{`Found 1 matching article for "${appliedFilters.title}"`}</b>
              )}
              {posts.length > 1 && (
                <b>{`Found ${posts.length} matching articles for "${appliedFilters.title}"`}</b>
              )}
            </span>
          </div>
        )}
      </div>
      {isPaneOpen && (
        <FilterPane
          categoryOptions={categoryOptions}
          filters={filters}
          handleApplyFilters={handleApplyFilters}
          handleClearFilters={handleClearFilters}
          handleFilterChange={handleFilterChange}
          isPaneOpen={isPaneOpen}
          setFilters={setFilters}
          setIsPaneOpen={setIsPaneOpen}
          statusOptions={statusOptions}
        />
      )}
      <Table
        enableColumnResize
        rowSelection
        className="w-full"
        columnData={columnData}
        currentPageNumber={1}
        defaultPageSize={10}
        handlePageChange={() => {}}
        rowData={rowData}
        selectedRowKeys={selectedPosts}
        onRowSelect={selectedPosts => setSelectedPosts(selectedPosts)}
      />
      <Alert
        cancelButtonLabel="Cancel"
        isOpen={isAlertOpen}
        message="Are you sure you want to delete this post? This action cannot be undone."
        submitButtonLabel="Delete"
        title="Are you sure you want to delete this post?"
        onClose={() => {
          setIsAlertOpen(false);
          setPostToDelete(null);
        }}
        onSubmit={() => {
          if (postToDelete) {
            handleDelete(postToDelete);
          }
          setIsAlertOpen(false);
          setPostToDelete(null);
        }}
      />
      <Alert
        cancelButtonLabel="Cancel"
        isOpen={isBulkDeleteAlertOpen}
        message={`Are you sure you want to delete ${selectedPosts.length} selected posts? This action cannot be undone.`}
        submitButtonLabel="Delete"
        title="Delete Selected Posts?"
        onClose={() => setIsBulkDeleteAlertOpen(false)}
        onSubmit={() => {
          handleBulkDelete(selectedPosts);
          setIsBulkDeleteAlertOpen(false);
        }}
      />
    </>
  );
};

export default UserPosts;
