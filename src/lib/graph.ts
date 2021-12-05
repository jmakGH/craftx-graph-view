import { CraftTextBlock } from '@craftdocs/craft-extension-api';

import { GraphNode, addLinkToNode, makeNode } from './graph-node';
import {
  getBlockLinks,
  getBlockTextAsId,
  isSubblockLink,
  isTextBlock,
  traverseCraftBlock,
} from './helpers';

interface ReactGraphLink {
  source: string;
  sourceName: string;
  target: string;
  targetName: string;
}

interface ReactGraphNode {
  id: string;
  name: string;
  value: number;
}

export interface Graph {
  links: ReactGraphLink[];
  nodes: ReactGraphNode[];
}

interface GraphNodeMap {
  [key: string]: GraphNode;
}

const getLinksFromNodeMap = (nodes: GraphNodeMap): ReactGraphLink[] =>
  Object.values(nodes).reduce(
    (allLinks, { id: sourceId, name: sourceName, links: sourceTargetIds }) => [
      ...allLinks,
      ...sourceTargetIds.map((targetId) => ({
        source: sourceId,
        sourceName,
        target: targetId,
        targetName: nodes[targetId].name,
      })),
    ],
    [] as ReactGraphLink[]
  );

const getNodesFromNodeMap = (nodes: GraphNodeMap): ReactGraphNode[] =>
  Object.values(nodes).map(({ id, name, links }) => ({
    id,
    name,
    value: links.length,
  }));

export const makeGraph = (rootBlock: CraftTextBlock): Graph => {
  const nodes: GraphNodeMap = {};

  const addNodeIfUnique = (node: GraphNode) => {
    if (nodes[node.id]) {
      return nodes[node.id];
    }

    nodes[node.id] = node;

    return node;
  };

  const addLink = (sourceId: string, target: GraphNode) => {
    const sourceNode = nodes[sourceId];

    if (!sourceNode) {
      throw new Error(`Source node does not exist: ${sourceId}`);
    }

    nodes[sourceId] = addLinkToNode(sourceNode, target.id);
  };

  traverseCraftBlock(rootBlock, (block) => {
    const node = addNodeIfUnique(makeNode(block.id, getBlockTextAsId(block)));

    getBlockLinks(block).forEach(({ link, text }) => {
      addLink(node.id, addNodeIfUnique(makeNode(link.blockId, text)));
    });

    block.subblocks.forEach((subblock) => {
      if (isTextBlock(subblock)) {
        getBlockLinks(subblock).forEach(({ link, text }) => {
          addLink(node.id, addNodeIfUnique(makeNode(link.blockId, text)));
        });
      }

      if (isSubblockLink(subblock)) {
        addLink(
          node.id,
          addNodeIfUnique(makeNode(subblock.id, getBlockTextAsId(subblock)))
        );
      }
    });
  });

  return {
    links: getLinksFromNodeMap(nodes),
    nodes: getNodesFromNodeMap(nodes),
  };
};
