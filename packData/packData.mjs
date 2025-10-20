import {compilePack, extractPack} from '@foundryvtt/foundryvtt-cli';
let packs = [
    'acc-items',
    'acc-class-features',
    'acc-summons',
    'acc-monsters',
    'acc-summon-features',
    'acc-monster-features'
];
for (let i of packs) {
    await compilePack('./packData/' + i, './packs/' + i, {'log': true});
}