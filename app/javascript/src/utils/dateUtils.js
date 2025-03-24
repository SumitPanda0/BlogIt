export const formatDate = dateString => {
  const date = new Date(dateString);

  return `${date.getDate()} ${date.toLocaleString("default", {
    month: "long",
  })} ${date.getFullYear()}, ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })}`;
};

export const getDisplayDate = post => {
  if (post.status === "published") {
    return post.published_at
      ? formatDate(post.published_at)
      : formatDate(post.created_at);
  }

  return post.last_published_at
    ? `${formatDate(post.last_published_at)}`
    : "Never published";
};
