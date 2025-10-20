import {actorUtils, dialogUtils, itemUtils, thirdPartyUtils, workflowUtils} from '../../../../utils.js';
async function attacked({trigger, workflow}) {
    if (!workflow.hitTargets.size) return; 
    await thirdPartyUtils.attacked(workflow, 'darkMending', 'use', {distance: 60, attacker: false, creatureTypes: ['undead'], isOwner: true, dispositionType: 'ally'});
}
async function damage({trigger, workflow}) {
    if (!workflow.hitTargets.size) return;
    if (!workflow.hitTargets.first().actor.flags['automated-crafted-creations']?.undeadServant) return;
    await workflowUtils.replaceDamage(workflow, workflow.damageRolls[0].formula + ' * 2');
}
async function selfAttacked({trigger: {entity: item}, workflow}) {
    if (!workflow.hitTargets.size) return;
    if (actorUtils.hasUsedReaction(workflow.hitTargets.first().actor)) return;
    if (!itemUtils.canUse(item)) return;
    let selection = await dialogUtils.confirmUseItem(item);
    if (!selection) return;
    await workflowUtils.syntheticItemRoll(item, [workflow.hitTargets.first()], {consumeResources: true, consumeUsage: true});
}
async function added({trigger: {entity: item}}) {
    await itemUtils.fixScales(item);
}
export let darkMending = {
    name: 'Dark Mending',
    version: '0.0.5',
    rules: 'legacy',
    midi: {
        actor: [
            {
                pass: 'sceneAttackRollComplete',
                macro: attacked,
                priority: 250
            },
            {
                pass: 'targetAttackRollComplete',
                macro: selfAttacked,
                priority: 250
            }
        ],
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
            value: 'classIdentifier',
            label: 'CHRISPREMADES.Config.ClassIdentifier',
            type: 'text',
            default: 'grave-warden',
            category: 'homebrew',
            homebrew: true
        },
        {
            value: 'scaleIdentifier',
            label: 'CHRISPREMADES.Config.ScaleIdentifier',
            type: 'text',
            default: 'dark-mending',
            category: 'homebrew',
            homebrew: true
        }
    ],
    scales: [
        {
            classIdentifier: 'classIdentifier',
            scaleIdentifier: 'damageScaleIdentifier',
            data: {
                type: 'ScaleValue',
                configuration: {
                    identifier: 'dark-mending',
                    type: 'dice',
                    distance: {
                        units: ''
                    },
                    scale: {
                        2: {
                            number: 1,
                            faces: 6,
                            modifiers: []
                        },
                        5: {
                            number: 1,
                            faces: 8,
                            modifiers: []
                        },
                        10: {
                            number: 1,
                            faces: 10,
                            modifiers: []
                        },
                        15: {
                            number: 1,
                            faces: 12,
                            modifiers: []
                        }
                    }
                },
                value: {},
                title: 'Dark Mending',
                hint: ''
            }
        }
    ]
};