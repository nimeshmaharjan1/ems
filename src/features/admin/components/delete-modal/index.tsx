import React from 'react';

const DeleteModal: React.FC<{
  deleteModalRef: React.RefObject<HTMLDialogElement>;
  title: string;
  body: string;
  children: React.ReactNode;
}> = ({ deleteModalRef, title, body, children }) => {
  return (
    <>
      <dialog id="deleteModal" className="modal" ref={deleteModalRef}>
        <section className="modal-box">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="py-4">{body}</p>
          <div className="modal-action">{children}</div>
        </section>
      </dialog>
    </>
  );
};

export default DeleteModal;
