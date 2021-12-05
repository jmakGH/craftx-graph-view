import {
  CraftBlockLink,
  CraftTextBlock,
  CraftTextRun,
} from '@craftdocs/craft-extension-api';

interface CraftBlockLinkTextRun extends CraftTextRun {
  link: CraftBlockLink;
}

const getBlockLinks = (block: CraftTextBlock) =>
  block.content.filter(
    ({ link }) => link?.type === 'blockLink'
  ) as CraftBlockLinkTextRun[];

export default getBlockLinks;
