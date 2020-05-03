import React, { Fragment, useState } from 'react';
import './App.css';

const G = 15 // grid size
const S = 100 / G // section length

const dots = Array((G-1) * (G-1)).fill(null).map((_, index) => ({
  x: index % (G-1),
  y: Math.floor(index / (G-1))
}))

const toPercent = (value) => S + S * value

function App() {
  const [focused, setFocused] = useState(null)
  const [selected, setSelected] = useState(null)
  const [lines, setLines] = useState([])
  const addLine = (line) => setLines([...lines, line])


  return (
    <div dir="rtl" className="App">
      <header className="App-header">
        <h3>نقشه کشی آنلاین</h3>
      </header>
      <svg id="cad" viewBox="0 0 100 100" preserveAspectRatio="xMinYMin" onClick={()=> {
        if (focused !== null) {
          if (selected !== null) {
            if (focused === selected) {
              setFocused(null)
              setSelected(null)
              return
            }
            addLine({
              x1: selected.x,
              y1: selected.y,
              x2: focused.x,
              y2: focused.y,
            })
            setSelected(null)
            setFocused(null)
          } else {
            setSelected(focused)
          }
        }
      }}>

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
        {dots.map((dot) => (
          <Fragment key={`${dot.x}-${dot.y}`}>
            <circle cx={toPercent(dot.x)} cy={toPercent(dot.y)} fill={dot === selected ? 'blue' : 'black'} r={dot === focused || dot === selected ? 2 : 0.7} />
            <circle cx={toPercent(dot.x)} cy={toPercent(dot.y)} r={S/1.5} fillOpacity="0" onMouseMove={() => setFocused(dot)} onMouseLeave={() => setFocused(null)} />
          </Fragment>
        ))}
      </svg>
    </div>
  );
}

export default App;
