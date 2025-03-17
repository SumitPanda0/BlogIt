import React from "react";

import { ExternalLink } from "@bigbinary/neeto-icons";
import { Tag, Avatar, Button } from "@bigbinary/neetoui";

const Preview = ({
  title,
  description,
  categories,
  status,
  setShowPreview,
  slug,
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

  const handleOpenInNewPage = () => {
    const previewData = {
      title,
      description,
      categories,
      status,
      timestamp: new Date().getTime(),
    };

    localStorage.setItem("postPreviewData", JSON.stringify(previewData));

    window.open(`/posts/preview/${slug}`, "_blank");
  };

  return (
    <div className="flex w-full flex-col">
      <div className="flex justify-end gap-x-2">
        <Button
          className="text-gray-800 hover:text-gray-500"
          icon={ExternalLink}
          label="Open in New Page"
          style="tertiary"
          onClick={handleOpenInNewPage}
        />
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

export default Preview;
