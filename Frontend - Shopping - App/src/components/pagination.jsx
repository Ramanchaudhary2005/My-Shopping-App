import React from "react";
import styled from "styled-components";

const Pagination = ({ page, totalPages, handlePageChange }) => {
  return (
    <StyledWrapper>
      <div className="pagination">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="real-button"
        >
          <span>Previous</span>
        </button>

        {/* Page Numbers */}
        {[...Array(totalPages)].map((_, i) => {
          const pageNum = i + 1;

          if (
            pageNum === 1 ||
            pageNum === totalPages ||
            (pageNum >= page - 1 && pageNum <= page + 1)
          ) {
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`real-button ${pageNum === page ? "active" : ""}`}
              >
                <span>{pageNum}</span>
              </button>
            );
          } else if (pageNum === page - 2 || pageNum === page + 2) {
            return (
              <span key={pageNum} className="dots">
                ...
              </span>
            );
          }
          return null;
        })}

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="real-button"
        >
          <span>Next</span>
        </button>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.75rem;
    margin-top: 2rem;
  }

  .real-button {
    position: relative;
    padding: 12px 20px;
    font-size: 14px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    color: white;
    background: #18181b;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .real-button span {
    position: relative;
    z-index: 2;
  }

  .real-button::before {
    content: "";
    position: absolute;
    inset: -2px;
    background: linear-gradient(90deg, #4f6ffd, #18181b, #4f6ffd);
    background-size: 200% 200%;
    border-radius: inherit;
    filter: blur(6px);
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
    z-index: 1;
  }

  .real-button:hover::before {
    opacity: 1;
    transform: scale(1.05);
    animation: glowing 4s linear infinite;
  }

  .real-button.active {
    background: #4f6ffd;
  }

  .dots {
    color: #888;
    padding: 0 6px;
  }

  @keyframes glowing {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

export default Pagination;
