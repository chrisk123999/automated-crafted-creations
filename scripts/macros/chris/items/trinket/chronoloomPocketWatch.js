import {activityUtils, genericUtils, rollUtils, spellUtils} from '../../../../utils.js';
async function use({trigger: {entity: item}, workflow}) {
    if (!workflow.item) return;
    let uuid = workflow.item.flags.dnd5e.cachedFor;
    if (!uuid) return;
    let activity = await fromUuid(uuid, {relative: workflow.actor});
    if (!activity) return;
    let identifier = genericUtils.getIdentifier(activity.item);
    if (identifier != 'chronoloomPocketWatch') return;
    let roll = await rollUtils.rollDice('1d12', {chatMessage: true, flavor: item.name});
    if (roll.roll.total != 12) return;
    await genericUtils.update(item, {'system.uses.spent': 0});
}
async function added({trigger: {entity: item}}) {
    let timeStop = await spellUtils.getCompendiumSpell('timeStop', {identifier: true, rules: 'modern'});
    if (!timeStop) return;
    let activity = activityUtils.getActivityByIdentifier(item, 'timeStop', {strict: true});
    if (!activity) return;
    await activityUtils.correctSpellLink(activity, timeStop);
}
export let chronoloomPocketWatch = {
    name: 'Chronoloom Pocket Watch',
    version: '0.0.1',
    rules: 'modern',
    midi: {
        actor: [
            {
                pass: 'rollFinished',
                macro: use,
                priority: 55
            }
        ]
    },
    item: [
        {
            pass: 'created',
            macro: added,
            priority: 50
        },
        {
            pass: 'itemMedkit',
            macro: added,
            priority: 50
        },
        {
            pass: 'actorMunch',
            macro: added,
            priority: 50
        }
    ]
};