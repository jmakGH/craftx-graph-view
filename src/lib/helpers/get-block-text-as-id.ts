import { CraftTextBlock } from '@craftdocs/craft-extension-api';

const getBlockTextAsId = (block: CraftTextBlock): string =>
  block.content.map(({ text }) => text).join('');

export default getBlockTextAsId;
