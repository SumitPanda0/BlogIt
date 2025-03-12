import React from "react";

import { Tag, Avatar, Button } from "@bigbinary/neetoui";

const PostPreview = ({
  title,
  description,
  categories,
  status,
  setShowPreview,
}) => {
  const formatDate = () => {
    const date = new Date();

    return `${date.getDate()} ${date.toLocaleString("default", {
      month: "long",
    })} ${date.getFullYear()}, ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`;
  };

  return (
    <div className="flex w-full flex-col">
      <div className="flex justify-end">
        <Button
          className="text-gray-800 hover:text-gray-500"
          label="Hide Preview"
          style="tertiary"
          onClick={() => setShowPreview(false)}
        />
      </div>
      <div className="mt-8 flex w-full items-start justify-between gap-x-6">
        <div className="flex w-full flex-col gap-y-2 p-8">
          {categories && categories.length > 0 && (
            <div className="flex w-full items-center gap-2">
              <div className="flex flex-wrap gap-1">
                {categories.map(category => (
                  <Tag
                    className="bg-green-200 p-2 font-semibold"
                    key={category.value}
                    label={category.label}
                    style="primary"
                    type="solid"
                  />
                ))}
              </div>
            </div>
          )}
          <div className="flex w-full items-center justify-between">
            <div className="mb-4 flex items-center gap-2">
              <h1 className="text-3xl font-bold">{title}</h1>
              <Tag
                label={status === "published" ? "Published" : "Draft"}
                size="small"
                style={status === "published" ? "success" : "danger"}
              />
            </div>
          </div>
          <div className="mb-4 flex items-center gap-x-3">
            <Avatar size="medium" user={{ name: "User" }} />
            <div className="flex flex-col gap-y-1">
              <div className="flex items-center">
                <div className="text-sm font-semibold text-gray-600">
                  Preview Mode
                </div>
              </div>
              <div className="text-xs text-gray-500">{formatDate()}</div>
            </div>
          </div>
          <p className="text-base text-gray-700">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default PostPreview;
