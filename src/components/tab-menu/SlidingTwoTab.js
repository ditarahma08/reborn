import { Text } from '@components/otoklix-elements';
import { useEffect, useState } from 'react';

const SlidingTwoTab = (props) => {
  const {
    handleTabClick,
    activeTab,
    firstTabName,
    secondTabName,
    hasSparatorComponent,
    firstDataQa,
    secondDataQa,
    isSticky,
    topSpace
  } = props;

  const [activeTabMenu, setActiveTabMenu] = useState(1);

  useEffect(() => {
    setActiveTabMenu(activeTab);
    return;
  }, [activeTab]);

  return (
    <div
      className={`${isSticky && 'sticky-top clear-header z-index-100'}`}
      style={{ top: topSpace || 0 + 'px' }}>
      <div className="wrapper-tabs-sliding">
        <ul>
          <li className={`tab ${activeTabMenu === 1 ? 'active' : ''}`}>
            <Text data-automation={firstDataQa} onClick={() => handleTabClick(1)}>
              {firstTabName || 'Tab 1'}
            </Text>
          </li>
          <li className={`tab ${activeTabMenu === 2 ? 'active' : ''}`}>
            <Text data-automation={secondDataQa} onClick={() => handleTabClick(2)}>
              {secondTabName || 'Tab 2'}
            </Text>
          </li>
          <div className="underline"></div>
        </ul>
      </div>
      {hasSparatorComponent && <div className="sparator-component" />}
    </div>
  );
};

export default SlidingTwoTab;
