import {activityUtils, actorUtils, compendiumUtils, constants, genericUtils, itemUtils, Summons, workflowUtils} from '../../../../utils.js';
async function damage({trigger, workflow}) {
    if (!itemUtils.getEquipmentState(workflow.item)) return;
    if (actorUtils.typeOrRace(workflow.targets.first().actor) != 'dragon') return;
    await workflowUtils.bonusDamage(workflow, '3d6', {damageType: 'force'});
}
async function use({trigger, workflow}) {
    if (!itemUtils.getEquipmentState(workflow.item)) return;
    let monsterCompendium = genericUtils.getCPRSetting('monsterCompendium');
    if (!game.packs.get(monsterCompendium)) return;
    let actorName = itemUtils.getConfig(workflow.item, 'actorName');
    let actor = await compendiumUtils.getActorFromCompendium(monsterCompendium, actorName);
    if (!actor) return;
    let animation = itemUtils.getConfig(workflow.item, 'animation');
    let updates = {
        actor: {
            prototypeToken: {
                disposition: workflow.token.document.disposition
            },
            system: {
                details: {
                    type: {
                        value: 'fey'
                    },
                    alignment: 'Neutral'
                }
            }
        },
        token: {
            disposition: workflow.token.document.disposition
        }
    };
    let name = itemUtils.getConfig(workflow.item, 'name');
    if (name) {
        updates.actor.name = name;
        updates.token.name = name;
        updates.actor.prototypeToken.name = name;
    }
    await Summons.spawn(actor, updates, workflow.item, workflow.token, {
        duration: itemUtils.convertDuration(workflow.activity).seconds, 
        range: workflow.activity.range.value,
        animation,
        initiativeType: 'follows'
    });
}
export let leafwardenMoonblade = {
    name: 'Leafwarden Moonblade',
    version: '0.0.12',
    rules: 'modern',
    midi: {
        item: [
            {
                pass: 'damageRollComplete',
                macro: damage,
                priority: 50,
                activities: ['attack']
            },
            {
                pass: 'rollFinished',
                macro: use,
                priority: 50,
                activities: ['use']
            }
        ]
    },
    config: [
        {
            value: 'animation',
            label: 'CHRISPREMADES.Config.Animation',
            type: 'select',
            default: 'shadow',
            category: 'animation',
            options: () => constants.summonAnimationOptions
        },
        {
            value: 'actorName',
            label: 'CHRISPREMADES.Summons.ActorName',
            i18nOption: 'AUTOMATEDCRAFTEDCREATIONS.Summons.CreatureNames.Shadow',
            type: 'text',
            default: 'Shadow',
            category: 'summons'
        },
        {
            value: 'name',
            label: 'CHRISPREMADES.Summons.CustomName',
            i18nOption: 'AUTOMATEDCRAFTEDCREATIONS.Summons.CreatureNames.Shadow',
            type: 'text',
            default: 'Ethvarn',
            category: 'summons'
        }
    ]
};