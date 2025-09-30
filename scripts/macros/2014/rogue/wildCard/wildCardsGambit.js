import {activityUtils, actorUtils, dialogUtils, effectUtils, genericUtils, itemUtils, workflowUtils} from '../../../../utils.js';
import {sharpCard} from '../../../chris/items/weapons/sharpCard.js';
async function damage({trigger, workflow}) {
    if (!workflow.hitTargets.size || !workflow.token) return;
    let documents = {
        1: {
            name: 'AUTOMATEDCRAFTEDCREATIONS.WildCardsGambit.Blade',
            img: 'icons/weapons/thrown/dagger-ringed-steel.webp',
            id: 'blade'
        },
        2: {
            name: 'AUTOMATEDCRAFTEDCREATIONS.WildCardsGambit.Shackle',
            img: 'icons/sundries/survival/cuffs-shackles-steel.webp',
            id: 'shackle'
        },
        3: {
            name: 'AUTOMATEDCRAFTEDCREATIONS.WildCardsGambit.Heart',
            img: 'icons/magic/life/heart-glowing-red.webp',
            id: 'heart'
        }
    };
    let dice = workflow.damageRolls[0].terms[0].values;
    let options;
    if (dice.includes(4)) {
        options = new Set(Object.values(documents));
    } else {
        options = new Set(dice.map(i => documents[i]));
    }
    options = Array.from(options);
    let selection;
    if (options.length > 1) {
        selection = await dialogUtils.selectDocumentDialog(workflow.item.name, 'AUTOMATEDCRAFTEDCREATIONS.WildCardsGambit.Select', Object.values(options));
        if (!selection) selection = options[0];
    } else {
        selection = options[0];
    }
    let classIdentifier = itemUtils.getConfig(workflow.item, 'classIdentifier');
    let scaleIdentifier = itemUtils.getConfig(workflow.item, 'scaleIdentifier');
    let scale = workflow.actor.system.scale[classIdentifier]?.[scaleIdentifier];
    if (!scale) return;
    if (['blade', 'heart'].includes(selection.id)) await workflowUtils.bonusDamage(workflow, scale.formula);
    if (['blade', 'shackle'].includes(selection.id)) {
        let sourceEffect = itemUtils.getEffectByIdentifier(workflow.item, selection.id + 'Effect');
        if (!sourceEffect) return;
        let effectData = genericUtils.duplicate(sourceEffect.toObject());
        effectData.origin = sourceEffect.uuid;
        if (selection.id === 'blade') effectData.changes[0].value = effectData.changes[0].value.replace('damageRoll=0', 'damageRoll=' + workflow.damageRolls[1].total);
        await Promise.all(workflow.hitTargets.map(async token => {
            await effectUtils.createEffect(token.actor, effectData);
        }));
    }
    if (selection.id != 'heart') return;
    let totalHeal = Math.floor(workflow.damageRolls[1].total / 2);
    if (workflow.actor.system.attributes.hp.value === workflow.actor.system.attributes.hp.max) {
        workflowUtils.applyDamage([workflow.token], totalHeal, 'temphp');
    } else {
        if (actorUtils.checkTrait(workflow.actor, 'di', 'healing')) return;
        let testHP = actorUtils.checkTrait(workflow.actor, 'dr', 'healing') ? Math.floor(totalHeal / 2) : totalHeal;
        let diff = workflow.actor.system.attributes.hp.max - (workflow.actor.system.attributes.hp.value + testHP);
        if (diff >= 0) {
            workflowUtils.applyDamage([workflow.token], totalHeal, 'healing');
        } else {
            workflowUtils.applyDamage([workflow.token], totalHeal + diff, 'healing');
            workflowUtils.applyDamage([workflow.token], Math.abs(diff), 'temphp');
        }
    }
}
export let wildCardsGambitCards = {
    name: 'Wild Card\'s Gambit: Playing Cards',
    version: '0.0.4',
    rules: 'legacy',
    midi: {
        item: [
            {
                pass: 'damageRollComplete',
                macro: damage,
                priority: 1000
            },
            {
                pass: 'attackRollComplete',
                macro: sharpCard.midi.item[0].macro,
                priority: 50
            }
        ]
    },
    config: [
        {
            value: 'classIdentifier',
            label: 'CHRISPREMADES.Config.ClassIdentifier',
            type: 'text',
            default: 'rogue',
            category: 'homebrew',
            homebrew: true
        },
        {
            value: 'scaleIdentifier',
            label: 'CHRISPREMADES.Config.ScaleIdentifier',
            type: 'text',
            default: 'sneak-attack',
            category: 'homebrew',
            homebrew: true
        },
        {
            value: 'playAnimation',
            label: 'CHRISPREMADES.Config.PlayAnimation',
            type: 'checkbox',
            default: true,
            category: 'animation'
        },
        {
            value: 'color',
            label: 'CHRISPREMADES.Config.Color',
            type: 'select',
            default: 'blue',
            category: 'animation',
            options: [
                {
                    value: 'blue',
                    label: 'CHRISPREMADES.Config.Colors.Blue'
                },
                {
                    value: 'green',
                    label: 'CHRISPREMADES.Config.Colors.Green',
                    requiredModules: ['jb2a_patreon']
                },
                {
                    value: 'orange',
                    label: 'CHRISPREMADES.Config.Colors.Orange',
                    requiredModules: ['jb2a_patreon']
                },
                {
                    value: 'purple',
                    label: 'CHRISPREMADES.Config.Colors.Purple',
                    requiredModules: ['jb2a_patreon']
                },
                {
                    value: 'yellow',
                    label: 'CHRISPREMADES.Config.Colors.Yellow',
                    requiredModules: ['jb2a_patreon']
                },
                {
                    value: 'random',
                    label: 'CHRISPREMADES.Config.Colors.Random',
                    requiredModules: ['jb2a_patreon']
                },
                {
                    value: 'cycle',
                    label: 'CHRISPREMADES.Config.Colors.Cycle',
                    requiredModules: ['jb2a_patreon']
                }
            ]
        },
        {
            value: 'sound',
            label: 'CHRISPREMADES.Config.Sound',
            type: 'file',
            default: '',
            category: 'sound'
        }
    ],
    hasAnimation: true
};