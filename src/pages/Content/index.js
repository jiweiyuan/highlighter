// import { printLine } from './modules/print';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import InjectHighlightTooltip from '../../components/InjectHighlightTooltip';

console.log('Content script works!');

const CONFIG = {
  selectionHighlightMode: 'enable' // enable disable
}

const ELEMENT_ID = '_highlight_tooltip_'

const injectHighlightTooltip = () => {
  const selection = document.getSelection()
  if (selection.rangeCount === 0) return

  let el = document.createElement('div')
  el.setAttribute('id', ELEMENT_ID)
  document.body.appendChild(el)

  const selectionRange = selection.getRangeAt(0)
  const selectionRect = selectionRange.getBoundingClientRect()

  if (selectionRect.x === 0 && selectionRect.y === 0) return;

  ReactDOM.render(
    <InjectHighlightTooltip
      boundingClientRect={selectionRect}
      element={ el }
      onHide = {() => {
        console.log('remove')
        if (el) el.remove()
      }}
    />,
    el
  )
}

window.onload = async () => {

  const onMouseUp = (e) => {
    const path = e.path || (e.composedPath && e.composedPath())
    if (path.length > 0) {
      const firstTagName = path[0].tagName;
      if (firstTagName === 'INPUT' || firstTagName === 'TEXTAREA') return
    }

    if (CONFIG.selectionHighlightMode === 'disable') return
    if (document.getElementById(ELEMENT_ID)) return;

    injectHighlightTooltip()
  }

  window.addEventListener('mouseup', onMouseUp)
}
