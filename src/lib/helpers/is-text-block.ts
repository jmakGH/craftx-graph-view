import { CraftBlock, CraftTextBlock } from '@craftdocs/craft-extension-api';

const isTextBlock = (block: CraftBlock): block is CraftTextBlock =>
  block.type === 'textBlock';

export default isTextBlock;
