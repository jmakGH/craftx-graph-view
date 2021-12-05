export interface GraphNode {
  id: string;
  name: string;
  links: string[];
}

export const makeNode = (
  id: string,
  name: string,
  links: string[] = []
): GraphNode => ({
  id,
  name,
  links,
});

export const addLinkToNode = (node: GraphNode, linkId: string) => ({
  ...node,
  links: node.links.includes(linkId) ? node.links : [...node.links, linkId],
});
