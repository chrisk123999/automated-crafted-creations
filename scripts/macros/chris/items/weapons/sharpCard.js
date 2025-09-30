import {animationUtils, genericUtils, itemUtils, workflowUtils} from '../../../../utils.js';
async function attack({trigger, workflow}) {
    if (!workflow.targets.size || !workflow.token || !workflowUtils.isAttackType(workflow, 'rangedAttack')) return;
    let playAnimation = itemUtils.getConfig(workflow.item, 'playAnimation');
    if (!playAnimation) return;
    let color = itemUtils.getConfig(workflow.item, 'color');
    let sound = itemUtils.getConfig(workflow.item, 'sound');
    if (color === 'random') {
        let colors = sharpCard.config.find(i => i.value === 'color').options.map(j => j.value).filter(k => !['random', 'cycle'].includes(k));
        color = colors[Math.floor(Math.random() * colors.length)];
    } else if (color === 'cycle') {
        let lastColorIndex = workflow.item.flags['automated-crafted-creations']?.sharpCard?.lastColorIndex ?? -1;
        lastColorIndex += 1;
        if (lastColorIndex === sharpCard.config.find(i => i.value === 'color').options.length - 2) lastColorIndex = 0;
        await genericUtils.setFlag(workflow.item, 'automated-crafted-creations', 'sharpCard.lastColorIndex', lastColorIndex);
        color = sharpCard.config.find(i => i.value === 'color').options.map(j => j.value)[lastColorIndex];
    }
    if (!color) return;
    let animation = 'jb2a.ranged.card.01.projectile.01.' + color;
    animationUtils.simpleAttack(workflow.token, workflow.targets.first(), animation, {sound, missed: !workflow.hitTargets.has(workflow.targets.first())});
}
export let sharpCard = {
    name: 'Sharp Card',
    version: '0.0.4',
    rules: 'modern',
    midi: {
        item: [
            {
                pass: 'attackRollComplete',
                macro: attack,
                priority: 50
            }
        ]
    },
    config: [
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