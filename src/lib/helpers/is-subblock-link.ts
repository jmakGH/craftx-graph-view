import { CraftBlock, CraftTextBlock } from '@craftdocs/craft-extension-api';

const isSubblockLink = (block: CraftBlock): block is CraftTextBlock =>
  block.type === 'textBlock' && block.subblocks.length > 0;

export default isSubblockLink;
