import {errors} from '../utils.js';
async function addPages() {
    let name = 'CPR - Descriptions';
    let journal = game.journal.getName(name);
    if (!journal) return;
    let featurePacks = ['automated-crafted-creations.ACCSummonFeatures'];
    for (let i of featurePacks) {
        let pack = game.packs.get(i);
        if (!pack) {
            errors.missingPack();
            continue;
        }
        let packIndex = await pack.getIndex({fields: ['name']});
        for (let j of packIndex) {
            let page = journal.pages.getName(j.name);
            if (page) continue;
            await JournalEntryPage.create({
                name: j.name, 
                title: {show: false, level: 1}, 
                sort: journal.pages.contents.at(-1).sort + CONST.SORT_INTEGER_DENSITY
            }, 
            {
                parent: journal
            });
        }
    }
}
export let journal = {
    addPages
};