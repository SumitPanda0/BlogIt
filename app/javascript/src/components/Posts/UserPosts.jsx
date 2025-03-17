import React, { useEffect, useState } from "react";

import { MenuHorizontal } from "@bigbinary/neeto-icons";
import { Button, Dropdown, Table } from "@bigbinary/neetoui";
import { Link, useHistory } from "react-router-dom";

import postsApi from "../../apis/posts";
import { PageLoader } from "../../common/PageLoader";
import { getFromLocalStorage } from "../../utils/storage";
import TruncatedText from "../utils/TruncatedText";

const UserPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory();
  const isLoggedIn = !!getFromLocalStorage("authToken");
  const [selectedPosts, setSelectedPosts] = useState([]);

  const { Menu, MenuItem, Divider } = Dropdown;
  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const {
        data: { posts },
      } = await postsApi.fetchUserPosts();

      setPosts(posts);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async post => {
    try {
      await postsApi.update({
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
      await postsApi.update({
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

  useEffect(() => {
    if (!isLoggedIn) {
      history.push("/login");

      return;
    }

    fetchUserPosts();
  }, [isLoggedIn]);

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
      return post.updated_at
        ? formatDate(post.updated_at)
        : formatDate(post.created_at);
    }

    return post.created_at ? formatDate(post.created_at) : "Date unavailable";
  };

  const columnData = [
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
                  onClick={() => handleDelete(post)}
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
                  onClick={() => handleDelete(post)}
                />
              </MenuItem>
            </Menu>
          )}
        </Dropdown>
      ),
    },
  ];

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
  }));

  return (
    <>
      <h1 className="text-2xl font-bold">My Blog Posts</h1>
      <h3 className="text-md mb-4 mt-4 text-gray-500">
        {posts.length === 1 ? "1 article" : `${posts.length} articles`}
      </h3>
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
    </>
  );
};

export default UserPosts;
