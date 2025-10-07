import {activityUtils, dialogUtils, genericUtils, itemUtils, workflowUtils} from '../../../../utils.js';
async function damage({trigger, workflow}) {
    if (!workflow.hitTargets.size) return;
    let paralyzingTouch = itemUtils.getItemByIdentifier(workflow.actor, 'paralyzingTouch');
    if (!paralyzingTouch?.system?.uses?.value) return;
    let selection = await dialogUtils.confirmUseItem(paralyzingTouch);
    if (!selection) return;
    let formula = itemUtils.getConfig(workflow.item, 'formula');
    await workflowUtils.bonusDamage(workflow, formula);
    await workflowUtils.syntheticItemRoll(paralyzingTouch, Array.from(workflow.hitTargets), {consumeResources: true, consumeUsage: true});
}
async function added({trigger: {entity: item}}) {
    let classIdentifier = itemUtils.getConfig(item, 'classIdentifier');
    let levels = item.actor.classes[classIdentifier]?.system?.levels;
    if (!levels) return;
    if (levels < 6) return;
    let bonus = 1;
    if (levels >= 12) bonus++;
    if (levels >= 16) bonus++;
    let intActivity = activityUtils.getActivityByIdentifier(item, 'int', {strict: true});
    let strActivity = activityUtils.getActivityByIdentifier(item, 'str', {strict: true});
    if (!intActivity || !strActivity) return;
    let updates = {};
    genericUtils.setProperty(updates, 'system.properties', ['mgc']);
    genericUtils.setProperty(updates, 'system.activities.' + intActivity.id + '.attack.bonus', bonus);
    genericUtils.setProperty(updates, 'system.activities.' + strActivity.id + '.attack.bonus', bonus);
    await genericUtils.update(item, updates);
}
export let undeadGraftSkeletal = {
    name: 'Undead Graft (Skeletal)',
    version: '0.0.7',
    rules: 'legacy',
    midi: {
        item: [
            {
                pass: 'damageRollComplete',
                macro: damage,
                priority: 50
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
    ],
    config: [
        {
            value: 'formula',
            label: 'CHRISPREMADES.Config.Formula',
            type: 'text',
            default: '2d8',
            category: 'homebrew',
            homebrew: true
        },
        {
            value: 'classIdentifier',
            label: 'CHRISPREMADES.Config.ClassIdentifier',
            type: 'text',
            default: 'grave-warden',
            category: 'homebrew',
            homebrew: true
        }
    ]
};