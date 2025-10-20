import {activityUtils, effectUtils, genericUtils, workflowUtils} from '../../../../../utils.js';
async function turnStart({trigger: {entity: effect, token}}) {
    if (!effectUtils.getEffectByStatusID(token.actor, 'concentrating')) return;
    let originItem = await effectUtils.getOriginItem(effect);
    if (!originItem) return;
    let activity = activityUtils.getActivityByIdentifier(originItem, 'damage');
    if (!activity) return;
    await workflowUtils.syntheticActivityRoll(activity, [token]);
}
async function cast({trigger: {entity: effect}, workflow}) {
    if (!workflow.item || !workflow.token) return;
    if (workflow.item.type != 'spell' || !workflow.castData) return;
    let castLevel = workflowUtils.getCastLevel(workflow);
    if (!castLevel) return;
    let originItem = await effectUtils.getOriginItem(effect);
    if (!originItem) return;
    let activity = activityUtils.getActivityByIdentifier(originItem, 'damage');
    if (!activity) return;
    let activityData = genericUtils.duplicate(activity.toObject());
    activityData.damage.parts[0].bonus = null;
    activityData.damage.parts[0].number = castLevel;
    activityData.damage.parts[0].denomination = 4;
    await workflowUtils.syntheticActivityDataRoll(activityData, originItem, originItem.actor, [workflow.token]);
}
export let curseOfDiminishedAmbitionVariant = {
    name: 'Curse of Diminished Ambition (Spell Variant) (9th Level Spell)',
    rules: 'legacy',
    version: '0.0.11',
    monsters: [
        'Varakhut'
    ]
};
export let curseOfDiminishedAmbitionVariantEffect = {
    name: 'Curse of Diminished Ambition (Spell Variant) (9th Level Spell): Effect',
    rules: curseOfDiminishedAmbitionVariant.rules,
    version: curseOfDiminishedAmbitionVariant.version,
    midi: {
        actor: [
            {
                pass: 'rollFinished',
                macro: cast,
                priority: 500
            }
        ]
    },
    combat: [
        {
            pass: 'turnStart',
            macro: turnStart,
            priority: 50
        }
    ]
};