import * as React from "react";
import * as ReactDOM from "react-dom";
import craftXIconSrc from "./craftx-icon.png";
import { CraftTextBlock } from "@craftdocs/craft-extension-api";
import { ForceGraph2D } from "react-force-graph";

interface BlockData {
  text: string;
  links: string[];
}

const getBlockData = ({ content }: CraftTextBlock): BlockData => ({
  text: content.map(({ text }) => text).join(),
  links: content
    .map(({ text, link }) => (link && link.type === "blockLink" ? text : ""))
    .filter(Boolean),
});

const getAllBlockData = (
  block: CraftTextBlock,
  collection: BlockData[] = []
): BlockData[] => {
  if (!block.subblocks.length) {
    return [...collection, getBlockData(block)];
  }

  return block.subblocks.reduce(
    (acc, subblock) =>
      subblock.type === "textBlock" ? getAllBlockData(subblock, acc) : acc,
    collection
  );
};

interface Node {
  id: string;
  name: string;
  value: string;
}

interface Link {
  source: string;
  target: string;
}

interface Graph {
  links: Link[];
  nodes: Node[];
}

const convertCraftBlockToNodeGraph = (
  block: CraftTextBlock,
  graph: Graph = { nodes: [], links: [] }
): Graph => {
  const currentBlockId = block.content.map(({ text }) => text).join("");

  if (!graph.nodes.find((node) => node.id === currentBlockId)) {
    graph.nodes.push({
      id: currentBlockId,
      name: currentBlockId,
      value: currentBlockId,
    });
  }

  block.content
    .filter(({ link }) => link?.type === "blockLink")
    .forEach(({ text }) => {
      const linkNode: Node = {
        id: text,
        name: text,
        value: text,
      };

      const link: Link = {
        source: currentBlockId,
        target: linkNode.id,
      };

      graph.nodes.push(linkNode);
      graph.links.push(link);
    });

  for (const subblock of block.subblocks) {
    if (subblock.type === "textBlock") {
      for (const subblockContent of subblock.content) {
        if (subblockContent.link?.type === "blockLink") {
          const linkId = subblockContent.text;

          const existingNode = graph.nodes.find((node) => node.id === linkId);

          if (existingNode) {
            graph.links.push({
              source: currentBlockId,
              target: existingNode.id,
            });
          } else {
            const linkNode: Node = {
              id: linkId,
              name: linkId,
              value: linkId,
            };

            const link: Link = {
              source: currentBlockId,
              target: linkNode.id,
            };

            graph.nodes.push(linkNode);
            graph.links.push(link);
          }
        }
      }

      if (subblock.subblocks.length) {
        const linkId = subblock.content.map(({ text }) => text).join("");

        const existingNode = graph.nodes.find((node) => node.id === linkId);

        if (existingNode) {
          graph.links.push({
            source: currentBlockId,
            target: existingNode.id,
          });
        } else {
          const linkNode: Node = {
            id: linkId,
            name: linkId,
            value: linkId,
          };

          const link: Link = {
            source: currentBlockId,
            target: linkNode.id,
          };

          graph.nodes.push(linkNode);
          graph.links.push(link);
        }

        convertCraftBlockToNodeGraph(subblock, graph);
      }
    }
  }

  return graph;
};

const App: React.FC<{}> = () => {
  const isDarkMode = useCraftDarkMode();
  // const [blocks, setBlocks] = React.useState<BlockData[]>([]);
  const [raw, setRaw] = React.useState<any>();
  const [graph, setGraph] = React.useState<Graph>({ nodes: [], links: [] });
  const [graphSize, setGraphSize] = React.useState<number>();

  const handleClick = () => {
    craft.dataApi.getCurrentPage().then((res) => {
      if (res.status === "success") {
        console.log(res.data);
        // console.log(convertCraftBlockToNodeGraph(res.data));
        // setBlocks(getAllBlockData(res.data));
        setGraph(convertCraftBlockToNodeGraph(res.data));
        setRaw(res.data);
      }
    });
  };

  React.useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div
      ref={(el) => el && setGraphSize(el.getBoundingClientRect().width - 32)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: "260pt",
        maxWidth: "300pt",
        width: "100%",
        margin: "0 auto",
      }}
    >
      <img className="icon" src={craftXIconSrc} alt="CraftX logo" />
      <button
        className={`btn ${isDarkMode ? "dark" : ""}`}
        onClick={handleClick}
      >
        Hello world!
      </button>

      <h4>{`Extension panel width: ${graphSize}`}</h4>

      <h4>{`Total links: ${graph.links.length}`}</h4>
      {graph.links.map((link, i) => (
        <div key={i}>{`${link.source} --> ${link.target}`}</div>
      ))}

      <div
        style={{
          border: "1px solid lightgray",
          borderRadius: "16px",
          margin: "0 auto",
          maxWidth: graphSize ? `calc(${graphSize} - 32px)` : "300pt",
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
    craft.env.setListener((env) => setIsDarkMode(env.colorScheme === "dark"));
  }, []);

  return isDarkMode;
}

export function initApp() {
  ReactDOM.render(<App />, document.getElementById("react-root"));
}
