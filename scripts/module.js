import * as macros from './macros.js';
//import * as legacyMacros from './legacyMacros.js';
import {macroUtils, setup} from './utils.js';
Hooks.once('cprReady', async () => {
    setup();
    macroUtils.registerMacros(Object.entries(macros).map(([identifier, macro]) => ({...macro, source: 'automated-crafted-creations', identifier})));
    await globalThis.chrisPremades.integration.acc.init();
});