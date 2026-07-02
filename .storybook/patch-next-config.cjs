'use strict';
/**
 * next/config was removed in Next.js 16.
 * @storybook/nextjs@8 calls require.resolve('next/config') during preset init,
 * before main.ts is even loaded — so we must patch Module._resolveFilename
 * at Node.js startup via NODE_OPTIONS="--require ./.storybook/patch-next-config.cjs".
 */
const Module = require('module');
const path   = require('path');

const MOCK = path.resolve(__dirname, 'mocks/next-config.cjs');
const orig  = Module._resolveFilename;

Module._resolveFilename = function patchedResolve(request, ...args) {
  if (request === 'next/config') return MOCK;
  return orig.apply(this, [request, ...args]);
};
