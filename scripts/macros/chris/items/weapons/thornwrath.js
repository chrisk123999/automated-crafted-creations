import {activityUtils, genericUtils, spellUtils, workflowUtils} from '../../../../utils.js';
async function use({trigger: {entity: item}, workflow}) {
    if (!workflow.item || !workflow.token) return;
    let uuid = workflow.item.flags.dnd5e.cachedFor;
    if (!uuid) return;
    let activity = await fromUuid(uuid, {relative: workflow.actor});
    if (!activity) return;
    let identifier = genericUtils.getIdentifier(activity.item);
    if (identifier != 'thornwrath') return;
    let activityIdentifier = activityUtils.getIdentifier(workflow.activity);
    if (activityIdentifier != 'use') return;
    let damageActivity = activityUtils.getActivityByIdentifier(item, 'damage');
    if (!damageActivity) return;
    await workflowUtils.syntheticActivityRoll(damageActivity, [workflow.token]);
}
async function added({trigger: {entity: item}}) {
    let steelWindStrike = await spellUtils.getCompendiumSpell('steelWindStrike', {identifier: true, rules: 'modern'});
    if (!steelWindStrike) return;
    let activity = activityUtils.getActivityByIdentifier(item, 'steelWindStrike', {strict: true});
    if (!activity) return;
    await activityUtils.correctSpellLink(activity, steelWindStrike);
}
export let thornwrath = {
    name: 'Thornwrath',
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