import React, { Fragment, useState } from 'react';
import './App.css';
import undoIcon from './undo.svg';
import { findClosestDot } from './utils';

const G = 15 // grid size
const S = 100 / G // section length

const dots = Array((G-1) * (G-1)).fill(null).map((_, index) => ({
  x: index % (G-1),
  y: Math.floor(index / (G-1))
}))

const toPercent = (value) => S + S * value

let touchStartDot = null

function App() {
  const [focused, setFocused] = useState(null)
  const [selected, setSelected] = useState(null)
  const [lines, setLines] = useState([])
  const [dragging, setDragging] = useState(false)
  const addLine = (line) => setLines([...lines, line])

  const onRelease = (e) => {
    const currentDot = findClosestDot(e, G, dots)
    if (!currentDot) return

    if (selected !== null) {
      if (currentDot === selected) {
        setSelected(null)
        return
      }
      addLine({
        x1: selected.x,
        y1: selected.y,
        x2: currentDot.x,
        y2: currentDot.y,
      })
      setSelected(null)
      setFocused(null)
    } else {
      setSelected(currentDot)
    }
  }

  const onMove = (e) => {
    const dot = findClosestDot(e, G, dots)
    if (dot) {
      setFocused(dot)
    }
  }


  return (
    <div dir="rtl" className="App">
      <header className="App-header">
        <h3 style={{margin: 10}}>نقشه کشی آنلاین</h3>
        <div style={{display: 'flex', justifyContent: 'space-around', flexDirection: 'row' }}>
          <button onClick={() => setLines(lines.slice(0, -1))}>
            <img src={undoIcon} width={18} height={18} alt="Undo" />
          </button>
        </div>
      </header>
      <svg
        id="cad"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMinYMin"
        onTouchStart={(e) => { touchStartDot = findClosestDot(e, G, dots) }}
        onTouchMove={(e) => {
          if (!dragging && !selected) {
            setSelected(touchStartDot)
            setDragging(true)
          }
          onMove(e)
        }}
        onMouseMove={onMove}
        onMouseUp={onRelease}
        onTouchEnd={(e) => (onRelease(e) || setDragging(false))}
      >

        <defs>
          <pattern id="smallGrid" width={S} height={S} patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2={S} y2="0" stroke="lightgrey" strokeWidth="0.3"/>
            <line x1="0" y1="0" x2="0" y2={S} stroke="lightgrey" strokeWidth="0.3"/>
            <line x1={S} y1={S} x2={S} y2="0" stroke="lightgrey" strokeWidth="0.3"/>
            <line x1={S} y1={S} x2="0" y2={S} stroke="lightgrey" strokeWidth="0.3"/>
          </pattern>
        </defs>

        <rect width="100" height="100" fill="url(#smallGrid)" />
        {lines.map((line, index) => (
          <line
            key={index}
            x1={toPercent(line.x1)}
            x2={toPercent(line.x2)}
            y1={toPercent(line.y1)}
            y2={toPercent(line.y2)}
            stroke="purple"
          />
        ))}
        {selected && focused && (
          <line x1={toPercent(selected.x)} y1={toPercent(selected.y)} x2={toPercent(focused.x)} y2={toPercent(focused.y)} stroke="mediumpurple"/>
        )}
        {dots.map((dot) => (
          <Fragment key={`${dot.x}-${dot.y}`}>
            <circle cx={toPercent(dot.x)} cy={toPercent(dot.y)} fill={dot === selected ? 'blue' : 'black'} r={dot === focused || dot === selected ? 2 : 0.7} />
          </Fragment>
        ))}
      </svg>
    </div>
  );
}

export default App;
