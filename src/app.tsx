import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import { ForceGraph2D } from 'react-force-graph';

import Header from '@/components/header';
import { Graph, makeGraph } from '@/lib/graph';

const App: FC = () => {
  const isDarkMode = useCraftDarkMode();
  // const [blocks, setBlocks] = React.useState<BlockData[]>([]);
  const [raw, setRaw] = React.useState<any>();
  const [graph, setGraph] = React.useState<Graph>({ nodes: [], links: [] });
  const [graphSize, setGraphSize] = React.useState<number>();

  const handleClick = () => {
    craft.dataApi.getCurrentPage().then((res) => {
      if (res.status === 'success') {
        console.log(res.data);
        // console.log(convertCraftBlockToNodeGraph(res.data));
        // setBlocks(getAllBlockData(res.data));
        setGraph(makeGraph(res.data));
        setRaw(res.data);
      }
    });
  };

  React.useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div
      ref={(el) => el && setGraphSize(el.getBoundingClientRect().width - 32)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: '260pt',
        maxWidth: '300pt',
        width: '100%',
        margin: '0 auto',
      }}
    >
      <Header>Graph View</Header>
      <button
        className={`btn ${isDarkMode ? 'dark' : ''}`}
        onClick={handleClick}
      >
        Hello world!
      </button>

      <h4>{`Extension panel width: ${graphSize}`}</h4>

      <h4>{`Total links: ${graph.links.length}`}</h4>
      {graph.links.map((link, i) => (
        <div key={i}>{`${link.sourceName} --> ${link.targetName}`}</div>
      ))}

      <div
        style={{
          border: '1px solid lightgray',
          borderRadius: '16px',
          margin: '0 auto',
          maxWidth: graphSize ? `calc(${graphSize} - 32px)` : '300pt',
        }}
      >
        <ForceGraph2D
          height={graphSize}
          graphData={graph}
          linkColor="#fff"
          linkWidth={2}
          width={graphSize}
        />
      </div>
    </div>
  );
};

function useCraftDarkMode() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    craft.env.setListener((env) => setIsDarkMode(env.colorScheme === 'dark'));
  }, []);

  return isDarkMode;
}

export function initApp() {
  ReactDOM.render(<App />, document.getElementById('react-root'));
}
