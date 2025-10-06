import * as macros from './macros.js';
import * as legacyMacros from './legacyMacros.js';
import {macroUtils, setup} from './utils.js';
import {journal} from './extensions/journal.js';
Hooks.once('cprReady', async () => {
    setup();
    macroUtils.registerMacros(Object.entries(macros).map(([identifier, macro]) => ({...macro, source: 'automated-crafted-creations', identifier})));
    macroUtils.registerMacros(Object.entries(legacyMacros).map(([identifier, macro]) => ({...macro, source: 'automated-crafted-creations', identifier})));
    await globalThis.chrisPremades.integration.acc.init();
    await journal.addPages();
});