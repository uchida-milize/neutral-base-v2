// Shim for next/config removed in Next.js 15+
// @storybook/nextjs@8 calls require.resolve('next/config') during preset init.
'use strict';
module.exports = function getConfig() {
  return {
    publicRuntimeConfig: {},
    serverRuntimeConfig: {},
  };
};
