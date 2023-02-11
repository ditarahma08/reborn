import Link from 'next/link';
import React from 'react';

const Tab = (props) => {
  const { item, active, onTabClick } = props;
  return (
    <Link href={item.path}>
      <div className={`tab-item ${active ? 'tab-active' : 'tab'}`} onClick={onTabClick}>
        <span>{item.name}</span>
      </div>
    </Link>
  );
};

export default Tab;
