type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}: PaginationProps) => {
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  if (safePage !== currentPage && totalPages > 0) {
    setTimeout(() => onPageChange(safePage), 0);
  }

  const renderInfo = () => {
    if (!itemsPerPage || !totalItems) return null;
    const start = (safePage - 1) * itemsPerPage + 1;
    const end = Math.min(safePage * itemsPerPage, totalItems);
    return (
      <div style={{ marginBottom: 8, color: "#666", fontSize: 14 }}>
        Hiển thị {start}-{end} / {totalItems} items
      </div>
    );
  };

  if (totalPages === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: 16, color: "#999" }}>
        Không có dữ liệu
      </div>
    );
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div style={{ textAlign: "center", marginTop: 16 }}>
      {renderInfo()}
      <div>
        <button
          onClick={() => onPageChange(safePage - 1)}
          disabled={safePage === 1}
          style={{
            background: "white",
            color: safePage === 1 ? "#ccc" : "black",
            border: "1px solid #ccc",
            borderRadius: 6,
            padding: "6px 12px",
            marginRight: 8,
            cursor: safePage === 1 ? "not-allowed" : "pointer",
          }}
        >
          <i className="fa-duotone fa-solid fa-left-from-line"></i>{" "}
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            style={{
              background: page === safePage ? "#0D6EFD" : "white",
              color: page === safePage ? "white" : "black",
              border: "1px solid #ccc",
              borderRadius: 6,
              padding: "6px 12px",
              marginRight: 4,
              cursor: "pointer",
              fontWeight: page === safePage ? 600 : 400,
            }}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(safePage + 1)}
          disabled={safePage === totalPages}
          style={{
            background: "white",
            color: safePage === totalPages ? "#ccc" : "black",
            border: "1px solid #ccc",
            borderRadius: 6,
            padding: "6px 12px",
            marginLeft: 4,
            cursor: safePage === totalPages ? "not-allowed" : "pointer",
          }}
        >
          <i className="fa-duotone fa-solid fa-right-from-line"></i>{" "}
        </button>
      </div>
    </div>
  );
};

export default Pagination;
