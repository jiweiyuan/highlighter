import React, { useEffect, useState } from 'react';
import { Popper, usePopper } from 'react-popper';
import './injectHighlightTooltip.css'

class VirtualReferenceElement {
  boundingClientRect;

  constructor(boundingClientRect) {
    this.boundingClientRect = boundingClientRect;
  }

  getBoundingClientRect() {
    return this.boundingClientRect;
  }

  get clientWidth() {
    return this.getBoundingClientRect().width;
  }

  get clientHeight() {
    return this.getBoundingClientRect().height;
  }
}
const InjectHighlightTooltip = (props) => {
  console.log(props.boundingClientRect)
  const [virtualReferenceElement, setVirtualReferenceElement] = useState(new VirtualReferenceElement(
    props.boundingClientRect
  ))


  const onMouseUp = (e) => {
    // const path = e.path || (e.composedPath && e.composedPath)
    console.log('onmouseup')
    handleClose()
  }

  const handleClose = () => {
    const {onHide} = props
    setTimeout(() => {
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('scroll', onScroll)
      onHide()
    } , 200)
  }

  const onScroll = () => {
    const selection= document.getSelection();
    const selectionRange = selection.getRangeAt(0);
    const boundingClientRect = selectionRange.getBoundingClientRect();
    setVirtualReferenceElement(new VirtualReferenceElement(boundingClientRect))
  }

  useEffect(() => {
    console.log('add mouseup listener')
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('scroll', onScroll);
    return () => {
      console.log('remove mouseup  listener')
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('scroll', onScroll)
    }
  }, [onScroll, onMouseUp])

  return (
    <Popper referenceElement={virtualReferenceElement}>
      {({ ref, style, placement, arrowProps }) => (
        <div ref={ref} className={'inject-trans-popover'} style={style}>
          <div>
            <div className={'popper-body'}>
             test123
            </div>
            <div
              ref={arrowProps.ref}
              data-placement={placement}
              className={'popper-arrow'}
              style={arrowProps.style}
            />
          </div>
        </div>
      )}
    </Popper>
  )
}

export default InjectHighlightTooltip
