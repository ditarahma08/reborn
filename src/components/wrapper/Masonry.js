import React from 'react';

const Masonry = ({ children, column, gap }) => {
  const getColumns = () => {
    const currentColumn = column;
    const columns = new Array(currentColumn);

    const items = React.Children.toArray(children);

    for (let i = 0; i < items.length; i++) {
      const columnIndex = i % currentColumn;

      if (!columns[columnIndex]) {
        columns[columnIndex] = [];
      }

      columns[columnIndex].push(items[i]);
    }

    return columns;
  };

  const renderColumns = () => {
    return getColumns().map((column, index) => (
      <div key={index} className="masonry-item" style={{ gap: gap }}>
        {column.map((item) => item)}
      </div>
    ));
  };

  return (
    <div className="masonry" style={{ gap: gap }}>
      {renderColumns()}
    </div>
  );
};

export default Masonry;
