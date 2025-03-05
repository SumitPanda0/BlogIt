import React from "react";

import { Button, Input, Modal as NeetouiModal } from "@bigbinary/neetoui";

const Modal = ({
  showAddModal,
  setShowAddModal,
  newCategoryName,
  setNewCategoryName,
  submitting,
  handleAddCategory,
}) => (
  <NeetouiModal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
    <NeetouiModal.Header>
      <h3 className="text-lg font-semibold">New Category</h3>
    </NeetouiModal.Header>
    <NeetouiModal.Body>
      <Input
        label="Category Title"
        placeholder="Enter category title"
        value={newCategoryName}
        onChange={event => setNewCategoryName(event.target.value)}
      />
    </NeetouiModal.Body>
    <NeetouiModal.Footer>
      <Button
        className="bg-black text-white"
        label="Add"
        loading={submitting}
        style="secondary"
        onClick={handleAddCategory}
      />
      <Button
        label="Cancel"
        style="tertiary"
        onClick={() => setShowAddModal(false)}
      />
    </NeetouiModal.Footer>
  </NeetouiModal>
);

export default Modal;
