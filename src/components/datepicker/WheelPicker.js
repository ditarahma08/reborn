/* eslint-disable */
import React from 'react';

const applyStyle = (scrollerId, itemInSelectorArea, dataLen) => {
  var topShadeItem = itemInSelectorArea
  var topFade = 1

  while (topShadeItem >= 0) {
    document.getElementById(`${scrollerId}-scroll-item--${topShadeItem}`).style.transition = `all 0.3s`
    document.getElementById(`${scrollerId}-scroll-item--${topShadeItem}`).style.opacity = `${topFade}`
    topFade -= 0.333333
    topShadeItem--
  }

  document.getElementById(`${scrollerId}-scroll-item--${itemInSelectorArea}`).style.opacity = `1`

  var bottomFade = 0.66666
  var bottomShade = itemInSelectorArea + 1
  for (var i = bottomShade; i < dataLen; i++) {
    document.getElementById(`${scrollerId}-scroll-item--${i}`).style.transition = `all 0.3s`
    document.getElementById(`${scrollerId}-scroll-item--${i}`).style.opacity = `${bottomFade}`
    bottomFade -= 0.33333
  }
}

class WheelPicker extends React.Component {
  constructor() {
    super();

    this._scrollTimer = null;
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    var height = this.props.height || 40;
    var scroller = document.getElementById(this.props.scrollerId);
    scroller.addEventListener('scroll', this.handleScroll);

    scroller.scroll({
      top: 1,
      behavior: 'smooth'
    });
    scroller.scroll({
      top: 0,
      behavior: 'smooth'
    });

    // scroll to index of default selection
    var y = this.props.defaultSelection * height - 1;
    y = y === -1 ? 0 : y;
    scroller.scroll({
      top: y,
      behavior: 'smooth'
    });
  }

  handleScroll(e) {
    var height = this.props.height || 40; // required to calculate which item should be selected on scroll

    //if there is already a timeout in process cancel it
    if (this._scrollTimer) clearTimeout(this._scrollTimer);

    var scroll = e.srcElement.scrollTop; // scroll value

    // itemInSelectorArea height of area available to scroll / height of individual item
    var itemInSelectorArea = parseInt((scroll + height / 2) / height, 10); // add (height/2) to adjust error

    if (itemInSelectorArea < this.props.data.length) {
      document
        .getElementById(`${this.props.scrollerId}-scroll-item--${itemInSelectorArea}`)
        .classList.add('selected-time');

      document
        .getElementById(`${this.props.scrollerId}-scroll-item--${itemInSelectorArea}`)
        .parentNode.classList.add('larging');

      for (var i = 0; i < this.props.data.length; i++) {
        if (i !== itemInSelectorArea) {
          document
            .getElementById(`${this.props.scrollerId}-scroll-item--${i}`)
            .classList.remove('selected-time');
          document
            .getElementById(`${this.props.scrollerId}-scroll-item--${i}`)
            .parentNode.classList.remove('larging');
        }
      }
      applyStyle(
        this.props.scrollerId,
        itemInSelectorArea,
        this.props.data.length,
        this.props.animation
      );
    }

    function finishedScrolling(selectorAreaHeight, id, updateSelection, dataLength) {
      updateSelection(itemInSelectorArea);
      var fix = document.getElementById(id);
      var y = itemInSelectorArea * selectorAreaHeight - 1;
      y = y === -1 ? 0 : y;

      var itemSeharusnya = dataLength - 1;
      var tinggiSeharusnya = itemSeharusnya * selectorAreaHeight;
      if (y > tinggiSeharusnya) {
        fix.scroll({
          top: tinggiSeharusnya - 1,
          behavior: 'smooth'
        });
      } else {
        fix.scroll({
          top: y,
          behavior: 'smooth'
        });
      }
    }

    this._scrollTimer = setTimeout(
      () =>
        finishedScrolling(
          height,
          this.props.scrollerId,
          this.props.updateSelection,
          this.props.data.length
        ),
      60
    );
  }

  renderListItems() {
    var height = this.props.height || 40;

    return this.props.data.map((item, index) => {
      return index === 0 ? (
        <div key={item} className="scroll-item-container">
          <div
            id={`${this.props.scrollerId}-scroll-item--${index}`}
            className="scroll-item selected-time items-end"
            style={{ minHeight: height + 'px', maxHeight: height + 'px', fontSize: '24px' }}
            onClick={(e) => document.getElementById(this.props.scrollerId).scroll({ top: 0, behavior: 'smooth' })}
          >
            <div
              onClick={(e) => document.getElementById(this.props.scrollerId).scroll({ top: 0, behavior: 'smooth' })}
              className="flexy cursor-pointer"
              style={{ display: 'flex' }}>
              <span>{item}</span>
            </div>
          </div>
        </div>
      ) : (
        <div key={item} className="scroll-item-container">
          <div
            id={`${this.props.scrollerId}-scroll-item--${index}`}
            className="scroll-item items-end"
            style={{ minHeight: height + 'px', maxHeight: height + 'px', fontSize: '24px' }}
            onClick={(e) => {
              var m = e.target.id.split('--')[1];
              document.getElementById(this.props.scrollerId).scroll({ top: m * height - 1, behavior: 'smooth' });
            }}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                var m = e.currentTarget.parentNode.id.split('--')[1];
                document.getElementById(this.props.scrollerId).scroll({ top: m * height - 1, behavior: 'smooth' });
              }}
              className="flexy cursor-pointer"
              style={{ display: 'flex' }}
            >
              <span>{item}</span>
            </div>
          </div>
        </div>
      );
    });
  }

  render() {
    var height = this.props.height || 40;
    const parentHeight = this.props.parentHeight || height * this.props.data.length || this.props.data.length * 40;
    
    return (
      <div className={`scroll-select-container ${this.props.customClass}`} style={{ height: parentHeight + 'px' }}>
        <div className="scroll-selector-area" style={{ height: '68px', top: `${parentHeight / 2 - height / 2}px` }} id={this.props.scrollerId + '--scroll-selector-area'}></div>
        <div
          className="scroll-select-list"
          id={this.props.scrollerId}
          style={{
            minHeight: height + 'px',
            maxHeight: height + 'px',
            paddingTop: `${parentHeight / 2 - height / 2}px`,
            paddingBottom: `${parentHeight / 2 - height / 2}px`
          }}
        >
          {this.renderListItems()}
        </div>
      </div>
    );
  }
}

export default WheelPicker;
