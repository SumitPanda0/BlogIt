import React from "react";

const List = () => (
  <div className="container mx-auto">
    <h1 className="mb-6 text-3xl font-bold">List View</h1>
    <div className="rounded-lg bg-white p-8 shadow">
      <ul className="divide-y divide-gray-200">
        {[1, 2, 3, 4, 5].map(item => (
          <li className="py-4" key={item}>
            <div className="flex items-center space-x-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-medium text-gray-900">
                  List Item {item}
                </p>
                <p className="truncate text-sm text-gray-500">
                  This is a sample list item description
                </p>
              </div>
              <div className="inline-flex items-center text-base font-semibold text-gray-900">
                {new Date().toLocaleDateString()}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default List;
