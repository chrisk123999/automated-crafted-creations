import {compilePack, extractPack} from '@foundryvtt/foundryvtt-cli';
let itemPacks = [
    'acc-items',
    'acc-class-features'
];
let actorPacks = [
    'acc-monsters',
    'acc-summons'
];
for (let i of itemPacks) {
    await extractPack('packs/' + i, 'packData/' + i, {'log': true, 'documentType': 'Item', transformEntry: (entry) => {
        delete entry._stats;
        delete entry.sort;
        delete entry.ownership;
        for (const i in entry.effects)
        {
            if (entry.effects[i]._stats) delete entry.effects[i]._stats;
        }
        if (entry.system?.source?.sourceClass) delete entry.system.source.sourceClass;
        if (entry.flags.core?.sourceId) delete entry.flags.core.sourceId;
    }});
}
for (let i of actorPacks) {
    await extractPack('packs/' + i, 'packData/' + i, {'log': true, 'documentType': 'Actor', transformEntry: (entry) => {delete entry._stats; delete entry.sort; delete entry.ownership;}});
}