const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('kick a member')
        .addUserOption(option => option.setName('user').setDescription('Select a user to kick').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Define a reason').setRequired(false))
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
		.setDMPermission(false),

        async execute(interaction) {
            const member = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason') || "No reason provided.";

            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)) {
                await interaction.reply({ content: "I am missing permission to do that!", ephemeral: true });
                return;
            }

            const memberFetched = await interaction.guild.members.fetch(member.id);
            const messageAuthor = await interaction.guild.members.fetch(interaction.member.id);

            if (messageAuthor.permissions.has(PermissionFlagsBits.KickMembers)) {

                if (memberFetched.roles.highest.position >= messageAuthor.roles.highest.position) return interaction.reply({ content: "You can't kick that member because their role is higher than yours!", ephemeral: true });
                try {
                await member.send(`You have been kicked from **${interaction.guild.name}**\nReason: ${reason}`);
                }
                catch {
                    console.log("could not dm kicked member");
                }
                await memberFetched.kick(reason);
                interaction.reply({ content: `Kicked ${memberFetched.user.tag} successfully!\nReason: ${reason}` });
            }
            else {
                await interaction.reply({ content: "You're not allowed to do that!", ephemeral: true }); return;
            }
        },
};
