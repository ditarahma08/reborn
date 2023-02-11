import React from 'react';

function Skeleton({ width, height, className }) {
  const skeletonHeight = height || '200px';
  const skeletonWidth = width || '100%';

  return (
    <React.Fragment>
      <div
        className={`skeleton-placeholder${className ? ` ${className}` : ''}`}
        style={{
          width: skeletonWidth,
          height: skeletonHeight
        }}
      />
    </React.Fragment>
  );
}

export default Skeleton;
