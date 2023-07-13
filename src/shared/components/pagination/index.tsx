const maxPagesToShow = 2; // Maximum number of page links to display
const ellipsis = <span className="px-4">...</span>; // Ellipsis separator

const Pagination: React.FC<{
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  size?: 'sm' | 'md';
}> = ({ currentPage, setCurrentPage, totalPages, size = 'md' }) => {
  const getPageLinks = () => {
    const pageLinks = [];
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (startPage > 1) {
      pageLinks.push(
        <button key="prev" onClick={() => setCurrentPage(currentPage - 1)} className="btn btn-ghost btn-xs btn-outline">
          Previous
        </button>
      );
    }

    if (startPage > 2) {
      pageLinks.push(ellipsis);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageLinks.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          aria-current={currentPage === i ? 'page' : undefined}
          className={`btn ${currentPage === i ? 'btn-primary' : 'btn-ghost btn-outline'} btn-xs`}>
          {i}
        </button>
      );
    }

    if (endPage < totalPages - 1) {
      pageLinks.push(ellipsis);
    }

    if (endPage < totalPages) {
      pageLinks.push(
        <button key="next" onClick={() => setCurrentPage(currentPage + 1)} className="btn btn-ghost btn-xs btn-outline">
          Next
        </button>
      );
    }

    return pageLinks;
  };

  return <div className="btn-group gap-2">{getPageLinks()}</div>;
};
export default Pagination;
