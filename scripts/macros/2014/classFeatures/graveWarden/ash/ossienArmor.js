import {actorUtils, dialogUtils, socketUtils, thirdPartyUtils, workflowUtils} from '../../../../../utils.js';
async function damaged({trigger: {targetToken}, workflow, ditem}) {
    await thirdPartyUtils.damaged(workflow, ditem, targetToken, 'ossienArmor', 'use', {distance: 5, halfDamage: true});
}
async function selfDamage({trigger: {entity: item, token}, ditem}) {
    if (!ditem.isHit) return;
    if (actorUtils.hasUsedReaction(item.actor)) return;
    let selection = await dialogUtils.confirmUseItem(item, {userId: socketUtils.firstOwner(item.actor).id});
    if (!selection) return;
    await workflowUtils.syntheticItemRoll(item, [token], {consumeUsage: true, consumeResources: true});
    workflowUtils.modifyDamageAppliedFlat(ditem, -Math.floor(ditem.totalDamage / 2));
}
export let ossienArmor = {
    name: 'Ossien Armor',
    version: '0.0.10',
    rules: 'legacy',
    midi: {
        actor: [
            {
                pass: 'sceneApplyDamage',
                macro: damaged,
                priority: 50
            },
            {
                pass: 'targetApplyDamage',
                macro: selfDamage,
                priority: 50
            }
        ]
    }
};