import {dialogUtils, genericUtils, itemUtils, workflowUtils} from '../../../utils.js';
async function save({trigger: {entity: item, config, actor, roll, saveId, token}}) {
    if (saveId != 'con') return;
    if (config['chris-premades']?.deathlessVigor) return;
    let targetValue = roll.options.target;
    if (!targetValue) return;
    if (roll.total >= targetValue) return;
    if (!itemUtils.canUse(item)) return;
    let selection = await dialogUtils.confirm(item.name, genericUtils.format('AUTOMATEDCRAFTEDCREATIONS.DeathlessVigor.Failed', {total: roll.total, name: item.name}));
    if (!selection) return;
    await workflowUtils.syntheticItemRoll(item, [token]);
    genericUtils.setProperty(config, 'chris-premades.deathlessVigor', true);
    let returnRoll = (await actor.rollSavingThrow(config, undefined, {create: false}))?.[0];
    return returnRoll;
}
export let deathlessVigor = {
    name: 'Deathless Vigor',
    version: '0.0.5',
    rules: 'legacy',
    save: [
        {
            pass: 'bonus',
            macro: save,
            priority: 50
        }
    ]
};