import { CraftBlock, CraftTextBlock } from '@craftdocs/craft-extension-api';

import exceptLast from './except-last';
import isSubblockLink from './is-subblock-link';
import isTextBlock from './is-text-block';
import last from './last';

// Preorder traversal of n-ary tree
const traverseCraftBlock = (
  block: CraftBlock,
  callback: (block: CraftTextBlock) => void
) => {
  if (!isTextBlock(block)) {
    return;
  }

  callback(block);

  if (block.subblocks.length) {
    exceptLast(
      block.subblocks,
      (subblock) =>
        isSubblockLink(subblock) && traverseCraftBlock(subblock, callback)
    );

    last(
      block.subblocks,
      (subblock) =>
        isSubblockLink(subblock) && traverseCraftBlock(subblock, callback)
    );
  }
};

export default traverseCraftBlock;
